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

# --- reCAPTCHA Enterprise (v3/Score) config from environment ---
RECAPTCHA_PROJECT_ID = os.environ.get("RECAPTCHA_PROJECT_ID", "")
RECAPTCHA_SITE_KEY = os.environ.get("RECAPTCHA_SITE_KEY", "")
RECAPTCHA_API_KEY = os.environ.get("RECAPTCHA_API_KEY", "")  # GCP API key for Recaptcha Enterprise API
RECAPTCHA_MIN_SCORE = float(os.environ.get("RECAPTCHA_MIN_SCORE", "0.5"))

router = APIRouter(prefix="/api")

# Pydantic Models
class ProductIn(BaseModel):
{{ ... }}
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

# =============================
# Inquiry with reCAPTCHA v3 Enterprise verification
# =============================

class InquiryIn(BaseModel):
    name: str
    email: str
    message: str
    subject: str | None = None
    phone: str | None = None
    source: str | None = None
    service_id: str | None = None
    recaptcha_token: str

class Inquiry(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    name: str
    email: str
    message: str
    subject: str | None = None
    phone: str | None = None
    source: str | None = None
    service_id: str | None = None
    created_at: datetime = Field(default_factory=datetime.utcnow)
    recaptcha_score: float | None = None

@router.post("/inquiry")
async def create_inquiry(request: Request, payload: InquiryIn):
    """
    Accepts inquiries from the frontend and validates reCAPTCHA Enterprise token.
    Expected frontend flow: grecaptcha.enterprise.execute(siteKey, { action: 'submit' })
    """
    # Basic env config checks
    if not (RECAPTCHA_PROJECT_ID and RECAPTCHA_SITE_KEY and RECAPTCHA_API_KEY):
        raise HTTPException(status_code=500, detail="Server reCAPTCHA config missing (RECAPTCHA_PROJECT_ID, RECAPTCHA_SITE_KEY, RECAPTCHA_API_KEY")

    # Verify token via Recaptcha Enterprise Assessments API
    assess_url = f"https://recaptchaenterprise.googleapis.com/v1/projects/{RECAPTCHA_PROJECT_ID}/assessments?key={RECAPTCHA_API_KEY}"
    body = {
        "event": {
            "token": payload.recaptcha_token,
            "siteKey": RECAPTCHA_SITE_KEY,
            "expectedAction": "submit"
        }
    }
    try:
        resp = requests.post(assess_url, json=body, timeout=10)
    except Exception as e:
        raise HTTPException(status_code=502, detail=f"reCAPTCHA verification failed: {e}")

    if resp.status_code != 200:
        raise HTTPException(status_code=400, detail=f"recaptcha_http_error: {resp.status_code}")

    data = resp.json()
    # Enterprise response fields
    token_props = (data.get("tokenProperties") or {})
    valid = token_props.get("valid", False)
    action = token_props.get("action")
    score = (data.get("riskAnalysis") or {}).get("score", 0.0)

    if not valid:
        raise HTTPException(status_code=400, detail="recaptcha_invalid")
    if action and action != "submit":
        raise HTTPException(status_code=400, detail=f"recaptcha_unexpected_action:{action}")
    if score is None or float(score) < RECAPTCHA_MIN_SCORE:
        raise HTTPException(status_code=403, detail="recaptcha_low_score")

    # Persist inquiry after passing verification
    db = get_db(request)
    inquiry = Inquiry(
        name=payload.name,
        email=payload.email,
        message=payload.message,
        subject=payload.subject,
        phone=payload.phone,
        source=payload.source,
        service_id=payload.service_id,
        recaptcha_score=float(score),
    )
    await db.inquiries.insert_one(inquiry.model_dump())

    return {"ok": True, "id": inquiry.id, "score": float(score)}