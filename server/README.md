# Nithish Pizzeria — Backend API

Express + PostgreSQL backend powering menu data, order placement, and order
confirmation emails for the Nithish Pizzeria frontend.

## Architecture

This is the **3-tier** setup:

1. **Frontend (Tier 1)** — React app (`/src`), talks to the API over HTTP.
2. **Backend (Tier 2)** — this folder. Express REST API, validates input,
   owns business logic (pricing, order totals), sends email.
3. **Database (Tier 3)** — PostgreSQL. Stores `menu_items`, `orders`,
   `order_items`.

## Running locally (without Docker)

```bash
cd server
cp .env.example .env   # fill in DB + SMTP values
npm install
npm run dev             # nodemon, restarts on change
```

You'll need a local Postgres instance running with a database matching
`DB_NAME` in your `.env`. Apply the schema once:

```bash
psql -U your_db_user -d your_db_name -f src/db/schema.sql
```

## Running with Docker Compose (recommended)

From the project root (not inside `server/`):

```bash
cp .env.example .env    # fill in DB + SMTP values
docker compose up --build
```

This starts all three tiers:
- `db` — Postgres, auto-seeded with the schema and starter menu on first run
- `api` — this backend, on port 5000
- `web` — the React frontend, on port 3000

Visit `http://localhost:3000`.

## API Reference

| Method | Path                | Description                          |
|--------|----------------------|---------------------------------------|
| GET    | `/api/health`         | Health check                          |
| GET    | `/api/menu`            | List available menu items             |
| POST   | `/api/orders`           | Place an order (see body shape below) |
| GET    | `/api/orders/:id`        | Look up an order by id                |

### POST /api/orders — request body

```json
{
  "customerName": "Jane Doe",
  "customerEmail": "jane@example.com",
  "customerPhone": "555-0100",
  "deliveryAddress": "123 Main St",
  "notes": "Ring the doorbell twice",
  "items": [
    { "menuItemId": 1, "quantity": 2 },
    { "menuItemId": 3, "quantity": 1 }
  ]
}
```

Prices are always looked up server-side from the database — the client
never controls the total. If `items` references an unavailable or
nonexistent menu item, the whole request is rejected before anything is
written to the database (the order insert and order_items inserts happen
inside a single transaction).

## Email

Order confirmation emails are sent via Nodemailer using whatever SMTP
credentials are set in `.env`. If SMTP isn't configured, the order still
succeeds — the email content is logged to the console instead of sent, and
the API response includes `"email": { "sent": false }` so the frontend can
inform the user gracefully.
