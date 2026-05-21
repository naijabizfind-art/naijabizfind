# NaijaBizFind — Full Stack Business Directory

Nigeria's local business directory. Businesses pay to list; admin approves; customers discover.

---

## Project Structure

```
naijabizfind/
├── backend/
│   ├── models/
│   │   ├── Business.js        ← Mongoose schema
│   │   └── Transaction.js     ← Payment records
│   ├── routes/
│   │   ├── businesses.js      ← Public listing endpoints
│   │   ├── payments.js        ← Paystack integration
│   │   └── admin.js           ← Protected admin endpoints
│   ├── middleware/
│   │   └── adminAuth.js       ← Simple password-based admin guard
│   ├── server.js              ← Express app + MongoDB connection
│   ├── .env.example           ← Copy to .env and fill in values
│   └── package.json
│
└── frontend/
    └── src/
        └── App.jsx            ← Full SPA (home, directory, submit, detail, etc.)
```

---

## Tech Stack

| Layer     | Technology                             |
|-----------|----------------------------------------|
| Frontend  | React 19, Vite, Tailwind CSS v4        |
| Backend   | Node.js, Express 5                     |
| Database  | MongoDB + Mongoose                     |
| Payments  | Paystack (NGN, Kobo conversion)        |
| Media     | Cloudinary (images + certificates)    |
| Auth      | Shared admin password via header       |

---

## Backend Setup

```bash
cd backend
npm install
cp .env.example .env   # Fill in your values
npm run dev            # Nodemon hot-reload on port 5000
```

### Environment Variables

| Variable                | Description                                   |
|-------------------------|-----------------------------------------------|
| `PORT`                  | Server port (default: 5000)                   |
| `MONGODB_URI`           | MongoDB Atlas or local connection string      |
| `PAYSTACK_SECRET_KEY`   | Paystack secret key (use `sk_test_` for dev)  |
| `CLOUDINARY_CLOUD_NAME` | Cloudinary cloud name                         |
| `CLOUDINARY_API_KEY`    | Cloudinary API key                            |
| `CLOUDINARY_API_SECRET` | Cloudinary API secret                         |
| `ADMIN_PASSWORD`        | Password for admin routes (via header)        |
| `FRONTEND_URL`          | Frontend URL for Paystack callback redirect   |

---

## Frontend Setup

```bash
cd frontend
npm install
cp .env.example .env   # Set VITE_API_URL
npm run dev            # Vite dev server on port 5173
```

---

## API Reference

### Public — Businesses

| Method | Route                        | Description                                      |
|--------|------------------------------|--------------------------------------------------|
| GET    | `/api/businesses`            | All approved + paid listings. Supports `?category=` and `?city=` |
| GET    | `/api/businesses/:id`        | Single approved business by ID                   |
| POST   | `/api/businesses/register`   | Register new business (status: pending, isPaid: false) |

**POST /api/businesses/register body:**
```json
{
  "name": "Elite Styles",
  "category": "fashion",
  "city": "Lagos",
  "address": "12 Broad Street, Lagos Island",
  "description": "Premium tailoring and fashion house.",
  "phone": "+234 801 234 5678",
  "whatsapp": "+234 801 234 5678",
  "openTime": "9am",
  "closeTime": "6pm",
  "plan": "featured",
  "shopPhoto": "https://res.cloudinary.com/...",
  "certificate": "https://res.cloudinary.com/..."
}
```

---

### Payments (Paystack)

| Method | Route                            | Description                               |
|--------|----------------------------------|-------------------------------------------|
| POST   | `/api/payments/initialize`       | Start Paystack transaction, returns `authorization_url` |
| GET    | `/api/payments/verify/:reference`| Verify payment, updates `isPaid = true`   |
| POST   | `/api/payments/webhook`          | Paystack webhook (HMAC verified)          |

**POST /api/payments/initialize body:**
```json
{ "businessId": "...", "email": "owner@example.com" }
```

**Webhook setup:** In your Paystack dashboard, set webhook URL to:
`https://yourdomain.com/api/payments/webhook`

---

### Admin (Protected)

All admin routes require the header:
```
x-admin-password: your_admin_password
```

| Method | Route                       | Description                              |
|--------|-----------------------------|------------------------------------------|
| GET    | `/api/admin/submissions`    | List all paid + pending businesses       |
| GET    | `/api/admin/all`            | All businesses (supports `?status=` and `?isPaid=`) |
| PUT    | `/api/admin/approve/:id`    | Approve listing → visible on site        |
| PUT    | `/api/admin/reject/:id`     | Reject listing (body: `{ "reason": "..." }`) |
| GET    | `/api/admin/transactions`   | All payment transaction records          |

---

## Payment Flow

```
User fills form (Step 1–2) →
  POST /api/businesses/register  (creates pending, unpaid record)
    ↓
  POST /api/payments/initialize  (gets Paystack authorization_url)
    ↓
  User redirected to Paystack checkout
    ↓
  Paystack redirects to /payment-success?reference=xxx
    ↓
  GET /api/payments/verify/:reference (sets isPaid = true)
    ↓
  Admin reviews → PUT /api/admin/approve/:id
    ↓
  Business appears on site (isPaid === true AND status === 'approved')
```

---

## Admin Flow

A business is only publicly visible when **both** conditions are true:
- `isPaid === true` (payment confirmed by Paystack)
- `status === 'approved'` (manually approved by admin)

Use the admin endpoints with the `x-admin-password` header or build a simple
admin dashboard UI that calls them.

---

## Cloudinary Integration (TODO)

Currently `shopPhoto` accepts a URL directly. To enable real uploads:

1. Install: `npm install multer cloudinary multer-storage-cloudinary`
2. Create `middleware/upload.js` with a Cloudinary storage engine
3. Add a `POST /api/upload` route that accepts `multipart/form-data` and returns the Cloudinary URL
4. Frontend Step 2: upload file to `/api/upload` first, then pass returned URL to `/api/businesses/register`

---

## Pricing

| Plan     | Price (NGN) |
|----------|-------------|
| Basic    | ₦5,000      |
| Featured | ₦10,000     |

Prices are set in `routes/payments.js` under `PLAN_PRICES`.
