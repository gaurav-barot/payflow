# 💰 PayFlow - Digital Wallet & Payment Platform

[![CI/CD Pipeline](https://github.com/saurabh3108/payflow/actions/workflows/ci-cd.yaml/badge.svg)](https://github.com/saurabh3108/payflow/actions/workflows/ci-cd.yaml)

> Real-time Digital Wallet and Payment Platform built with Microservices Architecture

## 🏗️ Architecture

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                              AWS EC2 / K3s                                   │
│  ┌────────────────────────────────────────────────────────────────────────┐ │
│  │                                                                         │ │
│  │   ┌─────────┐ ┌─────────┐ ┌─────────┐ ┌─────────┐ ┌─────────┐        │ │
│  │   │ React   │ │ API     │ │ Account │ │ Txn     │ │ Notify  │        │ │
│  │   │ UI      │ │ Gateway │ │ Service │ │ Service │ │ Service │        │ │
│  │   │ :3000   │ │ :8080   │ │ :8081   │ │ :8082   │ │ :8083   │        │ │
│  │   └─────────┘ └─────────┘ └─────────┘ └─────────┘ └─────────┘        │ │
│  │                                                                         │ │
│  │   ┌─────────┐ ┌──────────┐ ┌──────────┐ ┌─────────┐                   │ │
│  │   │ Kafka   │ │PostgreSQL│ │Prometheus│ │ Grafana │                   │ │
│  │   │ :9092   │ │ :5432    │ │ :9090    │ │ :3001   │                   │ │
│  │   └─────────┘ └──────────┘ └──────────┘ └─────────┘                   │ │
│  │                                                                         │ │
│  └────────────────────────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────────────────────┘
```

## 🛠️ Technology Stack

| Layer | Technology |
|-------|------------|
| **Backend** | Java 21, Spring Boot 3.2, Spring Cloud Gateway |
| **Database** | PostgreSQL 15 |
| **Messaging** | Apache Kafka 3.7 |
| **Frontend** | React 18, TypeScript, Tailwind CSS |
| **Container** | Docker |
| **Orchestration** | Kubernetes (K3s) |
| **CI/CD** | GitHub Actions, GHCR |
| **Monitoring** | Prometheus, Grafana |

## 📁 Project Structure

```
payflow/
├── services/
│   ├── api-gateway/          # API Gateway (Port 8080)
│   ├── account-service/      # Account Management (Port 8081)
│   ├── transaction-service/  # Transaction Processing (Port 8082)
│   └── notification-service/ # Notifications (Port 8083)
├── frontend/                 # React Frontend
├── k8s/                      # Kubernetes Manifests
│   ├── deployments/
│   ├── services/
│   ├── configmaps/
│   ├── secrets/
│   └── ingress/
└── .github/workflows/        # CI/CD Pipeline
```

## 🚀 Quick Start

### Prerequisites
- Java 21
- Maven 3.8+
- Docker
- Node.js 20+

### Local Development

```bash
# Clone the repository
git clone https://github.com/saurabh3108/payflow.git
cd payflow

# Build all services
mvn clean package

# Run with Docker Compose (coming soon)
docker-compose up -d
```

### Build Individual Service

```bash
cd services/account-service
mvn clean package
java -jar target/account-service-1.0.0.jar
```

## 📨 API Endpoints

### Account Service (8081)
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/accounts` | Create account |
| GET | `/api/accounts/{id}` | Get account by ID |
| GET | `/api/accounts/number/{num}` | Get by account number |
| PUT | `/api/accounts/balance` | Update balance |

### Transaction Service (8082)
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/transactions` | Initiate transfer |
| GET | `/api/transactions/{id}` | Get transaction |
| GET | `/api/transactions/account/{num}` | Get by account |

## 🔄 Kafka Topics

| Topic | Producer | Consumer |
|-------|----------|----------|
| `transaction-initiated` | Transaction Service | Account Service |
| `debit-completed` | Account Service | Transaction Service |
| `credit-completed` | Account Service | Transaction Service |
| `transaction-completed` | Transaction Service | Notification Service |

## 🔧 Key Features

- ✅ **Microservices Architecture** - 4 independent services
- ✅ **Event-Driven** - Kafka for async communication
- ✅ **Multi-threading** - ThreadPoolExecutor for concurrent processing
- ✅ **Spring AOP** - Logging & Audit aspects
- ✅ **Transaction Management** - @Transactional with pessimistic locking
- ✅ **API Documentation** - Swagger UI (OpenAPI 3)
- ✅ **Health Checks** - Spring Actuator
- ✅ **Metrics** - Prometheus + Grafana
- ✅ **CI/CD** - GitHub Actions → GHCR → K3s

## 📊 Monitoring

- **Swagger UI**: `http://<host>:8081/swagger-ui.html`
- **Prometheus**: `http://<host>:9090`
- **Grafana**: `http://<host>:3001`
- **Kafdrop**: `http://<host>:9000`

## 👥 Authors

- **Saurabh Kumar** - [GitHub](https://github.com/saurabh3108)

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
