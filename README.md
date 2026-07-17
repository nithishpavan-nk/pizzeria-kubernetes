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
                     Git Push
                        │
                        ▼
                 ┌───────────────┐
                 │    GitHub     │
                 └───────────────┘
                        │
                        ▼
         ┌────────────────────────────────┐
         │        Jenkins Server          │
         │         (EC2 Instance)         │
         │────────────────────────────────│
         │ • Clone Repository             │
         │ • Build Docker Images          │
         │ • Push Images to Docker Hub    │
         │ • Deploy to Kubernetes         │
         └────────────────────────────────┘
                        │
                        ▼
                 ┌───────────────┐
                 │  Docker Hub   │
                 └───────────────┘
                        │
                        ▼
        ┌────────────────────────────────┐
        │   Kubernetes Cluster (K3s)     │
        │        (EC2 Instance)          │
        └────────────────────────────────┘
                        │
        ┌───────────────┼────────────────┐
        ▼               ▼                ▼
   Frontend Pod    Backend Pod     PostgreSQL
    (React.js)     (Node.js API)   (StatefulSet)
        │               │                │
        └───────────────┼────────────────┘
                        ▼
                 Traefik Ingress
                        │
                        ▼
                    End Users
```

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
git clone https://github.com/nithishpavan-nk/pizzeria-kubernetes.git

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

<img width="1902" height="867" alt="Screenshot 2026-07-17 130544" src="https://github.com/user-attachments/assets/038922ad-a14d-4db1-bd9f-5a415aaf03a6" />


---

## Menu

<img width="1917" height="875" alt="Screenshot 2026-07-17 130612" src="https://github.com/user-attachments/assets/6417ced7-5bb6-4bce-aa4c-0caa50bed2ea" />


---

## Checkout

<img width="1917" height="865" alt="Screenshot 2026-07-17 130637" src="https://github.com/user-attachments/assets/5cbf05c1-89d1-436e-9b8a-beb855117634" />

<img width="1911" height="867" alt="Screenshot 2026-07-17 130739" src="https://github.com/user-attachments/assets/98d393e9-7c42-468a-893f-fcb5ca13eb87" />

<img width="1917" height="866" alt="Screenshot 2026-07-17 130804" src="https://github.com/user-attachments/assets/ac3419d4-7390-417b-93b5-18ecd752522c" />



---

## Mailtrap Email

<img width="1917" height="876" alt="Screenshot 2026-07-17 130833" src="https://github.com/user-attachments/assets/d2826818-75ca-4e93-bd3b-e9a1362f5503" />


---

## Kubernetes Pods

<img width="1887" height="846" alt="Screenshot 2026-07-17 131616" src="https://github.com/user-attachments/assets/acb7e117-1ad5-4b44-af5a-d5de979a9ea3" />


---

## Jenkins Pipeline

<img width="1915" height="868" alt="Screenshot 2026-07-17 145448" src="https://github.com/user-attachments/assets/03d9749b-dd03-4ac4-b4af-c9ca34743b24" />

<img width="1917" height="872" alt="Screenshot 2026-07-17 145420" src="https://github.com/user-attachments/assets/36bb93cb-0d85-4050-a6ba-9fb42ff5d59a" />


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

LinkedIn: *www.linkedin.com/in/nithishpavan-nk*

GitHub: *https://github.com/nithishpavan-nk*

---

# ⭐ If you found this project useful, consider giving it a Star!
