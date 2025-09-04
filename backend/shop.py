from fastapi import APIRouter, HTTPException, Body, Request
from pydantic import BaseModel, Field
from typing import List, Optional
from datetime import datetime
import uuid
import os
import hmac
import hashlib
import base64
import json
import requests

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

    # Helper for missing configuration
    def missing(msg: str):
        return {"order_id": order.id, "provider": provider, "status": "requires_configuration", "message": msg}

    # We support a single integration via Adyen that can handle PayPal/Klarna/Apple/Google and cards.
    if provider in ("applepay", "googlepay", "klarna", "paypal", "adyen", "card"):
        api_key = os.environ.get("ADYEN_API_KEY")
        merchant_account = os.environ.get("ADYEN_MERCHANT_ACCOUNT")
        client_key = os.environ.get("ADYEN_CLIENT_KEY")
        environment = os.environ.get("ADYEN_ENV", "test")  # 'test' or 'live'

        if not (api_key and merchant_account and client_key):
            return missing("Fehlende ADYEN_* Umgebungsvariablen (ADYEN_API_KEY, ADYEN_MERCHANT_ACCOUNT, ADYEN_CLIENT_KEY).")

        # Build Adyen Sessions API request body
        # Docs: https://docs.adyen.com/online-payments/web-drop-in#create-payment-session
        # Note: amount in minor units (e.g. cents).
        base_url = "https://checkout-test.adyen.com" if environment == "test" else "https://checkout-live.adyen.com"
        sessions_url = f"{base_url}/v70/sessions"

        # Choose a reference for reconciliation
        reference = f"ORDER-{order.id}"

        # Return URLs (for redirects). In dev you can keep placeholders; frontend can handle final result page.
        origin = os.environ.get("FRONTEND_ORIGIN", "http://localhost:3000")
        return_url = f"{origin}/payment/result?orderId={order.id}"

        body = {
            "amount": {"currency": order.currency, "value": order.total_cents},
            "merchantAccount": merchant_account,
            "reference": reference,
            "returnUrl": return_url,
            # Restrict or allow payment methods depending on selected provider
            # If explicit provider is selected, we can pass a hint via 'shopperLocale' or let Drop-in present options.
            # For simplicity, we let Drop-in handle available methods by account configuration.
            "channel": "Web",
            # Optional: countryCode, shopperLocale, etc.
        }

        headers = {
            "x-API-key": api_key,
            "content-type": "application/json",
        }

        try:
            resp = requests.post(sessions_url, headers=headers, data=json.dumps(body), timeout=15)
        except Exception as e:
            return {"order_id": order.id, "provider": provider, "status": "error", "message": f"Adyen Sessions Request fehlgeschlagen: {e}"}

        if resp.status_code != 200:
            return {"order_id": order.id, "provider": provider, "status": "error", "message": f"Adyen Sessions Status {resp.status_code}: {resp.text}"}

        data = resp.json()
        # Persist the provider session id for later mapping
        provider_session_id = data.get("id")
        await db.orders.update_one({"id": order.id}, {"$set": {"provider_session_id": provider_session_id}})

        return {
            "order_id": order.id,
            "provider": provider,
            "status": "session_created",
            "adyen": {
                "id": data.get("id"),
                "sessionData": data.get("sessionData"),
                "clientKey": client_key,
                "environment": environment,
            },
        }

    raise HTTPException(status_code=400, detail="Unbekannter Provider")

@router.post("/checkout/webhook")
async def checkout_webhook(request: Request, provider: Optional[str] = None):
    """
    Webhook endpoint to receive payment result notifications.
    - Stores all events in 'checkout_events'.
    - If ADYEN_HMAC_KEY is configured and the payload contains Adyen fields, verifies HMAC signature.
    NOTE: In production, configure the exact webhook format in Adyen and adapt verification accordingly.
    """
    db = get_db(request)
    body = await request.json()

    verified = None
    hmac_key_b64 = os.environ.get("ADYEN_HMAC_KEY")

    # Minimalistic verification attempt for Adyen standard webhook format (json with additionalData.hmacSignature)
    try:
        if hmac_key_b64 and isinstance(body, dict):
            additional = body.get("additionalData") or {}
            signature = additional.get("hmacSignature")
            # Construct signing string as per your Adyen webhook configuration.
            # This varies by webhook type; adjust accordingly.
            # Here we try a common pattern using amount.currency:value:pspReference:merchantAccountCode:merchantReference:eventCode:success
            amount = body.get("amount", {})
            signing_items = [
                amount.get("currency", ""),
                str(amount.get("value", "")),
                body.get("pspReference", ""),
                body.get("merchantAccountCode") or body.get("merchantAccount", ""),
                body.get("merchantReference", ""),
                body.get("eventCode", ""),
                str(body.get("success", "")),
            ]
            signing_string = ":".join(signing_items)

            key = base64.b64decode(hmac_key_b64)
            mac = hmac.new(key, signing_string.encode("utf-8"), hashlib.sha256)
            calc_sig = base64.b64encode(mac.digest()).decode("utf-8")
            verified = (signature == calc_sig)
    except Exception:
        verified = False

    event = {
        "id": str(uuid.uuid4()),
        "provider": provider or "unknown",
        "payload": body,
        "received_at": datetime.utcnow(),
        "verified": verified,
    }
    await db.checkout_events.insert_one(event)
    return {"ok": True, "verified": verified}

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