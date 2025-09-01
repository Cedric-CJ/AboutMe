from fastapi import APIRouter, HTTPException, Body, Request
from pydantic import BaseModel, Field
from typing import List, Optional
from datetime import datetime
import uuid
import os

router = APIRouter(prefix="/api")

# Pydantic Models
class ProductIn(BaseModel):
    title: str
    description: str = ""
    price_cents: int
    currency: str = "EUR"
    tags: List[str] = []
    active: bool = True

class Product(ProductIn):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow)

class CartItem(BaseModel):
    product_id: str
    qty: int = Field(gt=0)

class CheckoutRequest(BaseModel):
    provider: str
    items: List[CartItem]

class OrderItem(BaseModel):
    product_id: str
    qty: int
    unit_price_cents: int

class Order(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    items: List[OrderItem]
    total_cents: int
    currency: str = "EUR"
    status: str = "created"
    provider: str
    provider_session_id: Optional[str] = None
    provider_payment_id: Optional[str] = None
    created_at: datetime = Field(default_factory=datetime.utcnow)


def get_db(request: Request):
    # db is attached to app state by server.py
    return request.app.state.db

# Utils
async def _fetch_products_by_ids(db, ids: List[str]):
    products = await db.products.find({"id": {"$in": ids}}).to_list(len(ids))
    return {p["id"]: p for p in products}

@router.get("/products", response_model=List[Product])
async def list_products(request: Request, q: Optional[str] = None, active: Optional[bool] = None, skip: int = 0, limit: int = 100):
    db = get_db(request)
    query = {}
    if active is not None:
        query["active"] = active
    if q:
        query["$or"] = [
            {"title": {"$regex": q, "$options": "i"}},
            {"tags": {"$elemMatch": {"$regex": q, "$options": "i"}}},
        ]
    cur = db.products.find(query).skip(skip).limit(min(limit, 200))
    rows = await cur.to_list(length=min(limit, 200))
    return [Product(**r) for r in rows]

@router.post("/products", response_model=Product)
async def create_product(request: Request, payload: ProductIn):
    db = get_db(request)
    prod = Product(**payload.model_dump())
    await db.products.insert_one(prod.model_dump())
    return prod

@router.get("/products/{pid}", response_model=Product)
async def get_product(request: Request, pid: str):
    db = get_db(request)
    row = await db.products.find_one({"id": pid})
    if not row:
        raise HTTPException(status_code=404, detail="Produkt nicht gefunden")
    return Product(**row)

@router.patch("/products/{pid}", response_model=Product)
async def update_product(request: Request, pid: str, payload: ProductIn):
    db = get_db(request)
    update = payload.model_dump()
    update["updated_at"] = datetime.utcnow()
    res = await db.products.find_one_and_update({"id": pid}, {"$set": update}, return_document=True)
    if not res:
        raise HTTPException(status_code=404, detail="Produkt nicht gefunden")
    return Product(**res)

@router.delete("/products/{pid}")
async def delete_product(request: Request, pid: str):
    db = get_db(request)
    await db.products.delete_one({"id": pid})
    return {"ok": True}

@router.post("/checkout/session")
async def create_checkout_session(request: Request, payload: CheckoutRequest):
    db = get_db(request)
    # Load products and compute totals
    ids = [i.product_id for i in payload.items]
    found = await _fetch_products_by_ids(db, ids)
    if len(found) != len(ids):
        raise HTTPException(status_code=400, detail="Einige Produkte existieren nicht")

    currency = None
    total = 0
    order_items: List[OrderItem] = []
    for it in payload.items:
        p = found[it.product_id]
        if currency is None:
            currency = p.get("currency", "EUR")
        if p.get("currency") != currency:
            raise HTTPException(status_code=400, detail="Mischwährungen werden nicht unterstützt")
        total += int(p["price_cents"]) * int(it.qty)
        order_items.append(OrderItem(product_id=p["id"], qty=it.qty, unit_price_cents=p["price_cents"]))

    provider = payload.provider.lower()

    # Persist order in 'created' state
    order = Order(items=order_items, total_cents=total, currency=currency or "EUR", status="created", provider=provider)
    await db.orders.insert_one(order.model_dump())

    # Provider config check
    def missing(msg: str):
        return {"order_id": order.id, "provider": provider, "status": "requires_configuration", "message": msg}

    if provider in ("applepay", "googlepay", "klarna", "paypal", "adyen"):
        # Recommended: use ADYEN_* for all (Adyen routes PayPal/Klarna/Apple/Google)
        has_adyen = bool(os.environ.get("ADYEN_API_KEY") and os.environ.get("ADYEN_MERCHANT_ACCOUNT") and os.environ.get("ADYEN_CLIENT_KEY"))
        if not has_adyen:
            return missing("Fehlende ADYEN_* Umgebungsvariablen. Empfohlen: Adyen für PayPal/Klarna/Apple/Google unter einer Integration.")
        # Keys exist, but full call not yet wired without credentials. Return pseudo-session for now.
        return {
            "order_id": order.id,
            "provider": provider,
            "mode": "redirect",
            "redirect_url": "/payment/redirect/placeholder",
            "message": "Adyen konfiguriert – Redirect-URL wird nach echter API-Initialisierung geliefert."
        }

    raise HTTPException(status_code=400, detail="Unbekannter Provider")

@router.post("/checkout/webhook")
async def checkout_webhook(request: Request, provider: Optional[str] = None):
    db = get_db(request)
    body = await request.json()
    event = {
        "id": str(uuid.uuid4()),
        "provider": provider or "unknown",
        "payload": body,
        "received_at": datetime.utcnow(),
    }
    await db.checkout_events.insert_one(event)
    # TODO: verify signatures per provider (Adyen HMAC, PayPal webhook signature)
    return {"ok": True}

class ContactIn(BaseModel):
    topic: str
    name: str
    email: str
    message: str

class Contact(ContactIn):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    created_at: datetime = Field(default_factory=datetime.utcnow)

@router.post("/contact", response_model=Contact)
async def create_contact(request: Request, payload: ContactIn):
    db = get_db(request)
    c = Contact(**payload.model_dump())
    await db.contact_messages.insert_one(c.model_dump())
    return c