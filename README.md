# 🍕 Nithish Pizzeria — Full-Stack DevOps Project

A fully functional pizza ordering web application built as a **3-tier architecture** and deployed on **AWS EC2** using **Docker Compose**, with a **Jenkins CI/CD pipeline** that auto-deploys on every GitHub push.

---

## 🏗️ Architecture

```
Browser
  │
  ▼
React Frontend (port 3000)        ← Tier 1
  │
  ▼
Node.js / Express API (port 5000) ← Tier 2
  │
  ▼
PostgreSQL Database (port 5432)   ← Tier 3
```

| Tier | Technology | Purpose |
|------|------------|---------|
| Frontend | React (CRA) | UI, cart, checkout, order confirmation |
| Backend | Node.js + Express | REST API, business logic, email |
| Database | PostgreSQL 16 | Menu items, orders, order items |

---

## ✨ Features

- 🛒 **Add to Cart** — add menu items, adjust quantities, remove items
- 📋 **Category filtering** — filter menu by Classic / Specialty / Vegan
- ✅ **Checkout with validation** — inline form validation, real-time error feedback
- 📧 **Order confirmation emails** — Nodemailer + Mailtrap SMTP sandbox
- 🗄️ **PostgreSQL backend** — full DB transaction (order + order items succeed or both rollback)
- 🐳 **Fully Dockerized** — one command starts all 3 tiers
- 🔄 **CI/CD with Jenkins** — auto-deploys on every `git push`
- 🔒 **Secrets management** — `.env` stored in Jenkins credentials, never in git
- 🌐 **Deployed on AWS EC2** — with Elastic IP for stable public access

---

## 🚀 Quick Start (Local)

### Prerequisites
- Node.js 18+
- Docker + Docker Compose
- Git

### Run with Docker Compose

```bash
# Clone the repo
git clone https://github.com/nithishpavan-nk/my-react-app.git
cd my-react-app

# Set up environment variables
cp .env.example .env
nano .env  # fill in DB credentials and SMTP values

# Start all 3 tiers
docker compose -p pizzeria up --build -d

# Open the app
open http://localhost:3000
```

### Environment Variables

Copy `.env.example` to `.env` and fill in:

```env
# Database
DB_USER=pizzeria_user
DB_PASSWORD=yourpassword
DB_NAME=pizzeria_db

# Email (Mailtrap sandbox recommended for testing)
SMTP_HOST=sandbox.smtp.mailtrap.io
SMTP_PORT=587
SMTP_USER=your_mailtrap_username
SMTP_PASSWORD=your_mailtrap_password
SMTP_FROM="Nithish Pizzeria <no-reply@nithishpizzeria.com>"
```

> ⚠️ **Never commit `.env` to git.** It's already in `.gitignore`.

---

## 📁 Project Structure

```
my-react-app/
├── src/                          # React frontend
│   ├── api/client.js             # Centralised API fetch helpers
│   ├── context/CartContext.js    # Global cart state (useReducer)
│   ├── pages/
│   │   ├── Home.js
│   │   ├── Menu.js               # Live menu from API + category filter
│   │   ├── Cart.js               # Cart management
│   │   ├── Checkout.js           # Order form + validation
│   │   ├── OrderConfirmation.js  # Order slip + email status
│   │   ├── About.js
│   │   └── Contact.js
│   ├── components/
│   │   ├── Navbar.js             # Sticky nav + cart badge
│   │   ├── MenuItems.js          # Menu card + Add to Cart
│   │   └── Footer.js
│   ├── helpers/MenuList.js       # Offline fallback menu data
│   └── styles/                   # Per-page CSS files
│
├── server/                       # Express backend
│   ├── src/
│   │   ├── index.js              # App entry point
│   │   ├── routes/               # menuRoutes, orderRoutes
│   │   ├── controllers/          # menuController, ordersController
│   │   ├── db/
│   │   │   ├── pool.js           # PostgreSQL connection pool
│   │   │   └── schema.sql        # Tables + seed data (auto-runs on first start)
│   │   └── utils/email.js        # Nodemailer transporter
│   ├── Dockerfile
│   ├── package.json
│   └── .env.example
│
├── public/
│   └── menu-images/              # Pizza images served statically
│
├── Dockerfile                    # Frontend container
├── docker-compose.yml            # Full 3-tier stack definition
├── Jenkinsfile                   # CI/CD pipeline
├── .env.example                  # Environment variable template
└── .gitignore
```

---

## 🔌 API Reference

### Base URL
```
http://<YOUR_IP>:5000
```

### Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/health` | Health check |
| GET | `/api/menu` | List all available menu items |
| POST | `/api/orders` | Place an order |
| GET | `/api/orders/:id` | Get order by ID |

### POST /api/orders — Request Body

```json
{
  "customerName": "Jane Doe",
  "customerEmail": "jane@example.com",
  "customerPhone": "555-0100",
  "deliveryAddress": "123 Main St",
  "notes": "Ring the bell twice",
  "items": [
    { "menuItemId": 1, "quantity": 2 },
    { "menuItemId": 3, "quantity": 1 }
  ]
}
```

> Prices are always looked up server-side. The client never controls the total.

---

## 🗄️ Database Schema

```sql
menu_items     — id, name, description, price, category, image_url, is_available
orders         — id, customer_name, customer_email, delivery_address, status, total_amount
order_items    — id, order_id (FK), menu_item_id (FK), item_name, unit_price, quantity
```

- Orders and order_items are created in a **single transaction** — both succeed or both rollback.
- `item_name` and `unit_price` are snapshotted at order time so historical orders stay accurate even if the menu changes.
- Schema auto-runs on first container start via Docker's `docker-entrypoint-initdb.d/` mechanism.

---

## ☁️ AWS Deployment

### EC2 Instance Setup

| Setting | Value |
|---------|-------|
| AMI | Amazon Linux 2023 |
| Instance type | t3.medium |
| Storage | 15 GiB gp3 |
| Public IP | Elastic IP (stable across reboots) |

### Security Group Rules

| Port | Source | Purpose |
|------|--------|---------|
| 22 | My IP | SSH |
| 3000 | Anywhere | React frontend |
| 5000 | Anywhere | Express API |
| 8080 | Anywhere | Jenkins dashboard |

### Install Docker on Amazon Linux 2023

```bash
sudo dnf update -y
sudo dnf install -y docker
sudo systemctl enable --now docker
sudo usermod -aG docker $USER

# Log out and back in, then install Compose plugin system-wide:
sudo mkdir -p /usr/local/lib/docker/cli-plugins
sudo curl -SL https://github.com/docker/compose/releases/latest/download/docker-compose-linux-x86_64 \
     -o /usr/local/lib/docker/cli-plugins/docker-compose
sudo chmod +x /usr/local/lib/docker/cli-plugins/docker-compose
docker compose version
```

---

## 🔄 Jenkins CI/CD Pipeline

### Install Jenkins

```bash
sudo dnf install -y java-21-amazon-corretto
sudo wget -O /etc/yum.repos.d/jenkins.repo https://pkg.jenkins.io/redhat-stable/jenkins.repo
sudo rpm --import https://pkg.jenkins.io/redhat-stable/jenkins.io-2023.key
sudo dnf install -y jenkins
sudo systemctl enable --now jenkins
sudo usermod -aG docker jenkins
sudo systemctl restart jenkins
```

Unlock at `http://<ELASTIC_IP>:8080`:
```bash
sudo cat /var/lib/jenkins/secrets/initialAdminPassword
```

### Pipeline Stages

```
Checkout → Verify Docker → Build & Deploy → Verify Containers → Health Check
```

### Secrets Management

The `.env` file is stored as a **Jenkins Secret File credential** (ID: `pizzeria-env-file`):

1. Manage Jenkins → Credentials → System → Global credentials → Add Credentials
2. Kind: **Secret file**, upload your `.env`, ID: `pizzeria-env-file`

The pipeline copies it securely into the workspace at build time — never stored in git, never exposed in logs.

### GitHub Webhook (Auto-trigger on push)

1. Jenkins job → Configure → Build Triggers → ✅ **GitHub hook trigger for GITScm polling**
2. GitHub repo → Settings → Webhooks → Add webhook:
   - Payload URL: `http://<ELASTIC_IP>:8080/github-webhook/`
   - Content type: `application/json`
   - Events: **Just the push event**

---

## 📧 Email Setup

Emails are sent via **Nodemailer**. For testing, [Mailtrap](https://mailtrap.io) sandbox is recommended (no real emails sent, free, no domain required).

1. Sign up at mailtrap.io → Sandboxes → My Sandbox → Integration → SMTP
2. Copy credentials into your `.env` file
3. Place a test order — the confirmation appears in your Mailtrap inbox

If SMTP isn't configured, the order still succeeds. The API responds with `"email": { "sent": false }` and the email content is logged to the console.

---

## 🐛 Common Issues

### "Showing offline menu" / Failed to fetch
`REACT_APP_API_URL` is set to `localhost` instead of your public IP. Update `docker-compose.yml`, commit, push, and rebuild.

### Emails not sending after restart
The running container has stale (blank) SMTP env vars. Check with:
```bash
docker exec pizzeria-api env | grep SMTP
```
If blank, recreate the containers:
```bash
docker compose -p pizzeria down
docker compose -p pizzeria up --build -d
```

### Container name conflict
```bash
docker rm -f pizzeria-db pizzeria-api pizzeria-web
docker compose -p pizzeria up --build -d
```

### Jenkins `.env` permission denied
```bash
sudo rm -f /var/lib/jenkins/workspace/pizzeria-pipeline/.env
sudo chown -R jenkins:jenkins /var/lib/jenkins/workspace/pizzeria-pipeline
```

---

## 🛠️ Useful Commands

```bash
# Start stack
docker compose -p pizzeria up --build -d

# Stop stack
docker compose -p pizzeria down

# View logs
docker logs pizzeria-api --tail 50
docker logs pizzeria-web --tail 50

# Check container env vars
docker exec pizzeria-api env | grep SMTP
docker exec pizzeria-web env | grep REACT_APP

# Remove all pizzeria containers (clean slate)
docker rm -f pizzeria-db pizzeria-api pizzeria-web
```

---

## 📄 License

This project was built for learning purposes as part of a DevOps training exercise.
