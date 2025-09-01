# API Contracts (Frontend ↔ Backend)

Note: Current frontend uses mock.js. After backend is ready, frontend will switch to these endpoints. All routes prefix: /api

Entities
- Product
  - id: string (uuid)
  - title: string
  - description: string
  - price_cents: number
  - currency: string (default "EUR")
  - tags: string[]
  - active: boolean (default true)
  - created_at: ISO datetime
  - updated_at: ISO datetime
- Order
  - id: string (uuid)
  - items: [{ product_id: string, qty: number, unit_price_cents: number }]
  - total_cents: number
  - currency: string
  - status: "created" | "pending" | "paid" | "failed" | "canceled"
  - provider: "adyen" | "paypal" | "klarna" | "googlepay" | "applepay"
  - provider_session_id?: string
  - provider_payment_id?: string
  - created_at: ISO datetime
- ContactMessage
  - id: string (uuid)
  - topic: string
  - name: string
  - email: string
  - message: string
  - created_at: ISO datetime

Back-end Endpoints
- GET /api/               → { message: "Hello World" }
- POST /api/status        → status check (existing)
- GET  /api/status        → list checks (existing)

Shop
- GET    /api/products                → Product[] (query: q, active=true|false, limit, skip)
- POST   /api/products                → Product (body: ProductIn)
- GET    /api/products/{id}           → Product
- PATCH  /api/products/{id}           → Product
- DELETE /api/products/{id}           → { ok: true }

Checkout
- POST /api/checkout/session
  - body: { provider: "adyen"|"paypal"|"klarna"|"applepay"|"googlepay", items: [{ product_id, qty }] }
  - response:
    - 200: { order_id, provider, mode: "redirect"|"client_token", redirect_url?, client_token?, message? }
    - 400/501 if provider missing configuration (keys not set)
- POST /api/checkout/webhook?provider=adyen|paypal|klarna
  - Raw JSON from provider; backend verifies signature if configured
  - 200: { ok: true }

Contact
- POST /api/contact → { id, ...payload }

Mongo Collections
- products, orders, contact_messages, checkout_events, status_checks

Mock-to-Backend Switch
- Frontend currently mocks: projects, skills, timeline, blogPosts, gallery, contact. Initially we will only wire: products & checkout & contact. Others remain mock until we expand.

Payment Strategy (recommended)
- Single PSP: Adyen covers PayPal, Klarna, Apple Pay, Google Pay under one integration. Frontend will render a provider selection (or use Adyen Drop-in later). If you prefer Stripe+PayPal (Braintree), confirm and we’ll adapt.

Env Vars Needed (not committed)
- ADYEN_API_KEY, ADYEN_MERCHANT_ACCOUNT, ADYEN_CLIENT_KEY (Apple/Google Pay require additional domain/app verification)
- PAYPAL_CLIENT_ID, PAYPAL_SECRET (if PayPal direct)
- KLARNA_USERNAME, KLARNA_PASSWORD (if Klarna direct)
- GOOGLEPAY_MERCHANT_ID (if direct)
- APPLEPAY_MERCHANT_ID, APPLEPAY_CERT_PATH (if direct)

Testing
- Backend tests with deep_testing_backend_v2 before any frontend switch.