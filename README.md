# 💰 PayFlow - Digital Wallet & Payment Platform

[![CI/CD Pipeline](https://github.com/saurabh3108/payflow/actions/workflows/ci-cd.yml/badge.svg)](https://github.com/saurabh3108/payflow/actions/workflows/ci-cd.yml)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

> Real-time Digital Wallet and Payment Platform built with Microservices Architecture, Kubernetes, and Event-Driven Design

## 🎬 Demo

![PayFlow Dashboard](https://via.placeholder.com/800x400?text=PayFlow+Dashboard)

## 🏗️ Architecture

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                         KUBERNETES CLUSTER                                   │
│  ┌────────────────────────────────────────────────────────────────────────┐ │
│  │                         payflow namespace                               │ │
│  │                                                                         │ │
│  │   ┌─────────┐ ┌─────────┐ ┌─────────┐ ┌─────────┐ ┌─────────┐        │ │
│  │   │ React   │ │ API     │ │ Account │ │ Txn     │ │ Notify  │        │ │
│  │   │ Frontend│ │ Gateway │ │ Service │ │ Service │ │ Service │        │ │
│  │   │ :80     │ │ :8080   │ │ :8081   │ │ :8082   │ │ :8083   │        │ │
│  │   └────┬────┘ └────┬────┘ └────┬────┘ └────┬────┘ └────┬────┘        │ │
│  │        │           │           │           │           │              │ │
│  │        └───────────┴───────────┴─────┬─────┴───────────┘              │ │
│  │                                      │                                 │ │
│  │                         ┌────────────┴────────────┐                   │ │
│  │                         │         KAFKA           │                   │ │
│  │                         │        (Events)         │                   │ │
│  │                         └────────────┬────────────┘                   │ │
│  │                                      │                                 │ │
│  │                         ┌────────────┴────────────┐                   │ │
│  │                         │      POSTGRESQL         │                   │ │
│  │                         │       (Database)        │                   │ │
│  │                         └─────────────────────────┘                   │ │
│  │                                                                         │ │
│  └────────────────────────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────────────────────┘
```

## 🛠️ Technology Stack

| Layer | Technology |
|-------|------------|
| **Backend** | Java 21, Spring Boot 3.2, Spring Cloud Gateway |
| **Database** | PostgreSQL 15 |
| **Messaging** | Apache Kafka 3.7 (KRaft mode) |
| **Frontend** | React 18, Vite, Tailwind CSS, Framer Motion |
| **Container** | Docker |
| **Orchestration** | Kubernetes (Docker Desktop / K3s) |
| **CI/CD** | GitHub Actions with selective builds |
| **Registry** | GitHub Container Registry (GHCR) |
| **Monitoring** | Prometheus, Grafana *(coming soon)* |

## 📁 Project Structure

```
payflow/
├── services/
│   ├── api-gateway/          # Spring Cloud Gateway (Port 8080)
│   ├── account-service/      # Account Management (Port 8081)
│   ├── transaction-service/  # Transaction Processing (Port 8082)
│   └── notification-service/ # Kafka Event Consumer (Port 8083)
├── frontend/                 # React + Vite + Tailwind
│   ├── src/
│   │   ├── pages/           # Dashboard, Accounts, Transfer, Transactions
│   │   ├── components/      # Reusable UI components
│   │   └── api/             # API client configuration
│   └── nginx.conf           # Nginx config with API proxy
├── k8s/                      # Kubernetes Manifests
│   ├── namespace.yaml
│   ├── deployments/         # All service deployments
│   ├── services/            # ClusterIP services
│   ├── configmaps/          # Configuration
│   └── secrets/             # Sensitive data
├── .github/workflows/       # CI/CD Pipeline
│   └── ci-cd.yml            # Selective build & deploy
└── deploy-k8s.ps1           # Local deployment script
```

## 🚀 Quick Start

### Prerequisites

- Docker Desktop with Kubernetes enabled
- Java 21
- Maven 3.8+
- Node.js 20+
- kubectl

### Option 1: Local Kubernetes (Recommended)

```powershell
# Clone the repository
git clone https://github.com/saurabh3108/payflow.git
cd payflow

# Deploy to Kubernetes
./deploy-k8s.ps1 -Environment dev

# Access the application
kubectl port-forward svc/frontend 8000:80 -n payflow

# Open http://localhost:8000
```

### Option 2: Docker Compose

```bash
docker-compose up -d
# Open http://localhost:3000
```

## 🔄 CI/CD Pipeline

Our pipeline features **selective builds** - only changed services are built and deployed:

```
┌──────────────┐   ┌──────────────┐   ┌──────────────┐   ┌──────────────┐
│   DETECT     │──►│    BUILD     │──►│    PUSH      │──►│   DEPLOY     │
│   CHANGES    │   │ (only changed)│   │  to GHCR    │   │  Commands    │
└──────────────┘   └──────────────┘   └──────────────┘   └──────────────┘
```

| Branch | Image Tag | Action |
|--------|-----------|--------|
| `develop` | `:develop` | Build → Push → Show deploy commands |
| `main` | `:latest` | Build → Push → Deploy to AWS (auto) |

### After Push to `develop`:

The pipeline summary shows exact commands to run:

```powershell
# Restart updated services
kubectl rollout restart deployment/frontend -n payflow
kubectl rollout restart deployment/account-service -n payflow

# Verify
kubectl get pods -n payflow
```

## 📨 API Endpoints

### Account Service (8081)

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/accounts` | Create account |
| GET | `/api/accounts` | List all accounts |
| GET | `/api/accounts/{id}` | Get account by ID |
| GET | `/api/accounts/number/{num}` | Get by account number |

### Transaction Service (8082)

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/transactions` | Initiate transfer |
| GET | `/api/transactions` | List all transactions |
| GET | `/api/transactions/{id}` | Get transaction by ID |
| GET | `/api/transactions/account/{num}` | Get by account number |

## 🔧 Key Features

- ✅ **Microservices Architecture** - 5 independent services
- ✅ **Event-Driven** - Kafka for async communication
- ✅ **Kubernetes Native** - Full k8s deployment manifests
- ✅ **Selective CI/CD** - Only builds changed services
- ✅ **Modern React UI** - Tailwind CSS, Framer Motion animations
- ✅ **API Gateway** - Spring Cloud Gateway routing
- ✅ **Health Checks** - Kubernetes probes configured
- ✅ **GitOps Ready** - GHCR images, k8s manifests

## 🖥️ Local Development

### Quick Restart (After Pipeline Push)

```powershell
# Pull latest changes
git pull origin develop

# Restart only changed services
./deploy-k8s.ps1 -RolloutOnly
```

### Full Redeploy

```powershell
./deploy-k8s.ps1 -Environment dev
```

### Skip Infrastructure

```powershell
./deploy-k8s.ps1 -Environment dev -SkipInfra
```

## 📊 Upcoming Features

- [ ] Prometheus metrics collection
- [ ] Grafana dashboards
- [ ] User authentication (JWT)
- [ ] Transaction notifications
- [ ] QR code payments

## 👥 Author

**Saurabh Kumar** - [GitHub](https://github.com/saurabh3108)

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

*Built with ❤️ using Spring Boot, React, Kubernetes, and Kafka*
