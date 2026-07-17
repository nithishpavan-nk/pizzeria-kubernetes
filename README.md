# 🍕 Nithish Pizzeria - Production Kubernetes Deployment

A production-ready full-stack pizza ordering application deployed on Kubernetes (K3s) with an automated CI/CD pipeline using Jenkins and Docker Hub.

This project demonstrates modern DevOps practices including containerization, Kubernetes orchestration, automated database initialization, ingress routing, secrets management, persistent storage, and continuous deployment.

---

# 📌 Project Overview

This application allows customers to:

- 🍕 Browse the pizza menu
- 🛒 Place online orders
- 📧 Receive order confirmation emails
- 💾 Store orders in PostgreSQL
- 🚀 Access the application through Kubernetes Ingress

The project was built to demonstrate an end-to-end DevOps deployment workflow rather than only application development.

---

# 🏗️ Architecture

```
                         GitHub
                            │
                            ▼
                       Jenkins Pipeline
                            │
                 Build Docker Images
                            │
                            ▼
                        Docker Hub
                            │
                            ▼
                  Kubernetes Cluster (K3s)
                            │
        ┌───────────────────┼────────────────────┐
        │                   │                    │
        ▼                   ▼                    ▼
   Frontend             Backend            PostgreSQL
 (React.js)          (Node.js API)       (StatefulSet)
        │                   │                    │
        └──────────────┬────┘                    │
                       ▼                         │
                Traefik Ingress                  │
                       │                         │
                       ▼                         │
                  End Users                Persistent Volume
```

---

# 🚀 Technologies Used

## Frontend

- React.js
- React Router
- JavaScript
- HTML5
- CSS3

## Backend

- Node.js
- Express.js
- PostgreSQL
- Nodemailer
- REST API

## DevOps

- Docker
- Docker Hub
- Jenkins
- Kubernetes (K3s)
- Traefik Ingress
- ConfigMaps
- Secrets
- StatefulSets
- Persistent Volumes
- Kubernetes Jobs
- Kustomize

## Database

- PostgreSQL 16

---

# 📂 Project Structure

```
pizzeria-kubernetes/
│
├── frontend/
│
├── server/
│
├── k8s/
│   ├── base/
│   ├── backend/
│   ├── frontend/
│   ├── ingress/
│   ├── postgres/
│   │     ├── service.yaml
│   │     ├── statefulset.yaml
│   │     ├── db-init-job.yaml
│   │     └── scripts/
│   │           └── schema.sql
│   │
│   └── kustomization.yaml
│
├── Jenkinsfile
├── docker-compose.yml
└── README.md
```

---

# ⭐ Features

- Full-stack Pizza Ordering Platform
- Kubernetes Deployment
- Automated CI/CD Pipeline
- PostgreSQL StatefulSet
- Persistent Storage
- Automated Database Initialization
- Email Notifications
- Kubernetes Secrets
- ConfigMaps
- Ingress Routing
- Dockerized Frontend & Backend
- Production-ready Kubernetes Architecture

---

# 🔄 CI/CD Pipeline

```
Developer
    │
    ▼
Git Push
    │
    ▼
Jenkins
    │
    ├── Checkout Source Code
    ├── Build Backend Image
    ├── Build Frontend Image
    ├── Push Images to Docker Hub
    ├── Deploy to Kubernetes
    ├── Wait for Rollout
    └── Verify Deployment
```

---

# ☸ Kubernetes Components

| Component | Purpose |
|------------|----------|
| Namespace | Isolates application resources |
| Deployment | Frontend & Backend deployment |
| StatefulSet | PostgreSQL deployment |
| Service | Internal communication |
| Ingress | External routing via Traefik |
| Secret | Database & SMTP credentials |
| ConfigMap | Database initialization script |
| Job | Automatic database schema creation |
| PVC | Persistent PostgreSQL storage |

---

# 💾 Database Initialization

The PostgreSQL database is automatically initialized using a Kubernetes Job.

Workflow:

```
schema.sql
      │
      ▼
ConfigMap
      │
      ▼
Database Initialization Job
      │
      ▼
PostgreSQL
```

This removes the need for manually importing SQL files after deployment.

---

# 📦 Deployment

Clone the repository

```bash
git clone https://github.com/<your-username>/pizzeria-kubernetes.git

cd pizzeria-kubernetes
```

Deploy the application

```bash
kubectl apply -k k8s/
```

Verify

```bash
kubectl get pods -n pizzeria
```

Check services

```bash
kubectl get svc -n pizzeria
```

Check ingress

```bash
kubectl get ingress -n pizzeria
```

---

# 📷 Application

## Home Page

(Add Screenshot)

---

## Menu

(Add Screenshot)

---

## Checkout

(Add Screenshot)

---

## Mailtrap Email

(Add Screenshot)

---

## Kubernetes Pods

(Add Screenshot)

---

## Jenkins Pipeline

(Add Screenshot)

---

# 🔐 Kubernetes Secrets

The following sensitive data is managed using Kubernetes Secrets:

- PostgreSQL Password
- Mailtrap Username
- Mailtrap Password

No credentials are stored in the source code.

---

# 📈 Future Improvements

- Helm Charts
- Horizontal Pod Autoscaler
- Prometheus Monitoring
- Grafana Dashboards
- GitHub Actions
- ArgoCD GitOps
- AWS EKS Deployment
- SSL using Let's Encrypt
- Custom Domain

---

# 🎯 Learning Outcomes

This project helped me gain hands-on experience with:

- Docker Containerization
- Kubernetes Architecture
- Stateful Applications
- Persistent Volumes
- ConfigMaps
- Secrets Management
- Kubernetes Jobs
- Traefik Ingress
- CI/CD using Jenkins
- Docker Hub Image Registry
- PostgreSQL Administration
- Production Deployment Strategies

---

# 👨‍💻 Author

**Nithishpavan N K**

DevOps Engineer | AWS | Docker | Kubernetes | Jenkins | Linux

LinkedIn: *(Add your profile)*

GitHub: *(Add your profile)*

---

# ⭐ If you found this project useful, consider giving it a Star!
