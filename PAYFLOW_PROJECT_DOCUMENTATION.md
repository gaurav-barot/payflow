# 💰 PayFlow - Digital Wallet & Payment Platform

> **Complete Project Documentation**
> 
> Created: December 26, 2025
> Authors: Saurabh Kumar & Team

---

## 📖 Table of Contents

1. [Project Overview](#project-overview)
2. [What We Have Completed](#what-we-have-completed)
3. [What We Are Going To Do](#what-we-are-going-to-do)
4. [Project Phases](#project-phases)
5. [Technical Architecture](#technical-architecture)
6. [Technology Stack](#technology-stack)
7. [Microservices Details](#microservices-details)
8. [Future Scope & Roadmap](#future-scope--roadmap)
9. [Interview Pitch](#interview-pitch)
10. [Quick Reference Commands](#quick-reference-commands)

---

## 🎯 Project Overview

**PayFlow** is a real-time digital wallet and payment platform similar to Paytm, PhonePe, or Google Pay. It demonstrates enterprise-level architecture with microservices, event-driven design, and cloud-native deployment.

### Why PayFlow?

| Aspect | Benefit |
|--------|---------|
| **Interview Value** | Covers System Design, Concurrency, Distributed Systems |
| **Real-World Use** | Daily use case everyone understands |
| **Scalability** | Designed to handle millions of transactions |
| **Modern Stack** | Uses latest technologies (K8s, Kafka, Spring Boot 3) |
| **Unique Name** | Not a generic "Bank App" - stands out in portfolio |

---

## ✅ What We Have Completed

### 🖥️ Local PC Setup

| Tool | Version | Purpose |
|------|---------|---------|
| Java | 21 | Spring Boot backend development |
| Maven | Latest | Build and dependency management |
| Git | Latest | Version control |
| Docker | 29.1.3 | Containerization |
| Node.js | 24.12.0 | React frontend development |
| npm | 11.6.2 | Package management |

### ☁️ AWS EC2 Setup

| Component | Status | Details |
|-----------|--------|---------|
| EC2 Instance | ✅ Running | t2.micro, Mumbai region (ap-south-1) |
| Ubuntu | ✅ Installed | Ubuntu Server 24.04 LTS |
| K3s (Kubernetes) | ✅ Installed | v1.33.6+k3s1 |
| Swap Space | ✅ Configured | 2GB swap for memory optimization |
| Security Group | ✅ Configured | Ports: 22, 80, 443, 3000-3001, 8080-8083, 9000-9092, 6443 |

### 🗄️ Infrastructure on K3s

| Service | Status | Namespace |
|---------|--------|-----------|
| PostgreSQL | ✅ Running | payflow |
| Kafka (KRaft mode) | ✅ Running | payflow |
| PayFlow Namespace | ✅ Created | - |

### 📊 Database Setup

| Table | Columns | Sample Data |
|-------|---------|-------------|
| `accounts` | id, account_number, holder_name, email, balance, timestamps | 3 sample accounts |
| `transactions` | id, transaction_id, from_account, to_account, amount, status, timestamp | Ready for use |
| Indexes | ✅ Created | For faster queries |

### ⌨️ Aliases Configured (on EC2)

| Alias | Command |
|-------|---------|
| `kc` | `kubectl` |
| `pgsql` | Connect to PostgreSQL |
| `kafka-topics` | Manage Kafka topics |
| `kafka-console-producer` | Send Kafka messages |
| `kafka-console-consumer` | Read Kafka messages |

---

## 🚀 What We Are Going To Do

### Immediate Next Steps

| Step | Task | Status |
|------|------|--------|
| 1 | Create GitHub Repository | ⏳ Pending |
| 2 | Set up project structure locally | ⏳ Pending |
| 3 | Build 4 Spring Boot Microservices | ⏳ Pending |
| 4 | Create React Frontend | ⏳ Pending |
| 5 | Dockerize all services | ⏳ Pending |
| 6 | Set up GitHub Actions CI/CD | ⏳ Pending |
| 7 | Deploy to K3s on AWS | ⏳ Pending |
| 8 | Set up Prometheus & Grafana | ⏳ Pending |

---

## 📅 Project Phases

### 🏁 Phase 1: Core Platform (Current - 1-2 Days)

**Goal:** Build a working digital wallet with basic operations

| Feature | Description | Priority |
|---------|-------------|----------|
| User Wallet | Create account, view balance | P0 |
| Money Transfer | Send money P2P | P0 |
| Transaction History | View past transactions | P0 |
| Real-time Updates | Kafka event streaming | P0 |
| Basic UI | React dashboard | P0 |
| CI/CD Pipeline | GitHub Actions → GHCR → K3s | P0 |
| Monitoring | Prometheus + Grafana basics | P1 |

**Deliverables:**
- 4 running microservices
- React frontend
- PostgreSQL database
- Kafka messaging
- Automated deployment

---

### 🔧 Phase 2: Enhanced Features (Week 2)

**Goal:** Add production-grade features

| Feature | Description | Priority |
|---------|-------------|----------|
| User Authentication | JWT-based login/signup | P0 |
| Password Encryption | BCrypt hashing | P0 |
| Transaction Notifications | Email/SMS alerts | P1 |
| QR Code Payments | Scan to pay | P1 |
| Transaction Limits | Daily/monthly limits | P1 |
| Rate Limiting | API throttling | P1 |
| Audit Logging | Track all operations | P1 |
| Error Handling | Graceful error responses | P0 |

**Technical Additions:**
- Spring Security integration
- Redis for caching & rate limiting
- Email service (SMTP/SendGrid)
- QR code generation library

---

### 📈 Phase 3: Scale & Reliability (Week 3-4)

**Goal:** Make it production-ready

| Feature | Description | Priority |
|---------|-------------|----------|
| Database Replication | PostgreSQL replicas | P0 |
| Kafka Clustering | Multi-broker setup | P1 |
| Auto-scaling | HPA (Horizontal Pod Autoscaler) | P1 |
| Circuit Breaker | Resilience4j integration | P0 |
| Distributed Tracing | Jaeger/Zipkin | P1 |
| API Gateway | Kong/NGINX Ingress | P0 |
| Load Testing | K6/JMeter scripts | P1 |
| Disaster Recovery | Backup & restore procedures | P1 |

**Infrastructure:**
- Multi-AZ deployment
- Database backups
- Log aggregation (ELK Stack)

---

### 🏢 Phase 4: Enterprise Level (Month 2+)

**Goal:** Enterprise-grade features for production deployment

| Feature | Description | Priority |
|---------|-------------|----------|
| Multi-tenancy | Support multiple organizations | P1 |
| RBAC | Role-based access control | P0 |
| Compliance | PCI-DSS basics | P0 |
| Data Encryption | At rest & in transit | P0 |
| Secrets Management | HashiCorp Vault | P1 |
| Blue-Green Deployment | Zero-downtime releases | P1 |
| Canary Releases | Gradual rollouts | P2 |
| SLA Monitoring | Uptime tracking | P1 |
| Cost Optimization | Resource right-sizing | P2 |

**Enterprise Integrations:**
- SSO (Single Sign-On)
- LDAP/Active Directory
- Webhook notifications
- API versioning

---

### 🤖 Phase 5: AI/ML Integration (Month 3+)

**Goal:** Intelligent payment platform with AI capabilities

| Feature | Description | AI/ML Tech |
|---------|-------------|------------|
| **Fraud Detection** | Real-time anomaly detection | TensorFlow/PyTorch |
| **Transaction Categorization** | Auto-categorize expenses | NLP Classification |
| **Spending Predictions** | Predict future expenses | Time Series (Prophet) |
| **Credit Scoring** | ML-based credit assessment | Gradient Boosting |
| **Chatbot Support** | AI-powered customer service | LLM (GPT/Claude API) |
| **Smart Notifications** | Personalized alerts | Recommendation Engine |
| **Risk Assessment** | Transaction risk scoring | Ensemble Models |

**AI/ML Architecture:**

```
┌─────────────────────────────────────────────────────────────┐
│                    AI/ML Pipeline                            │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│   Transaction ──► Kafka ──► ML Service ──► Prediction       │
│       │                         │              │             │
│       │                         ▼              ▼             │
│       │                   ┌──────────┐   ┌──────────┐       │
│       │                   │ Feature  │   │  Model   │       │
│       │                   │  Store   │   │  Store   │       │
│       │                   │ (Redis)  │   │ (S3/MLflow)      │
│       │                   └──────────┘   └──────────┘       │
│       │                                                      │
│       └──► PostgreSQL ──► Training Pipeline ──► Model       │
│                              (Airflow)           Update      │
│                                                              │
└─────────────────────────────────────────────────────────────┘
```

**Fraud Detection Model Features:**
- Transaction amount patterns
- Time-of-day analysis
- Geolocation anomalies
- Device fingerprinting
- Velocity checks (transactions per minute)
- Network analysis (suspicious connections)

---

## 🏗️ Technical Architecture

### System Architecture Diagram

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                              AWS EC2 INSTANCE                                │
│  ┌────────────────────────────────────────────────────────────────────────┐ │
│  │                      K3s (Lightweight Kubernetes)                       │ │
│  │                                                                         │ │
│  │   PODS (Microservices):                                                │ │
│  │   ┌─────────┐ ┌─────────┐ ┌─────────┐ ┌─────────┐ ┌─────────┐        │ │
│  │   │ React   │ │ API     │ │ Account │ │ Txn     │ │ Notify  │        │ │
│  │   │ UI Pod  │ │ Gateway │ │ Service │ │ Service │ │ Service │        │ │
│  │   │ :3000   │ │ :8080   │ │ :8081   │ │ :8082   │ │ :8083   │        │ │
│  │   └─────────┘ └─────────┘ └─────────┘ └─────────┘ └─────────┘        │ │
│  │                                                                         │ │
│  │   Infrastructure Pods:                                                  │ │
│  │   ┌─────────┐ ┌──────────┐ ┌──────────┐ ┌─────────┐                   │ │
│  │   │ Kafka   │ │PostgreSQL│ │Prometheus│ │ Grafana │                   │ │
│  │   │ :9092   │ │ :5432    │ │ :9090    │ │ :3001   │                   │ │
│  │   └─────────┘ └──────────┘ └──────────┘ └─────────┘                   │ │
│  │                                                                         │ │
│  │   K8s Resources: ConfigMaps | Secrets | PVCs | HPA | Ingress          │ │
│  └────────────────────────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────────────────────┘
```

### CI/CD Pipeline

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                           PayFlow CI/CD Pipeline                             │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                              │
│   LOCAL PC                    GITHUB                      AWS EC2           │
│   ─────────                   ──────                      ───────           │
│                                                                              │
│   ┌─────────┐    git push    ┌─────────────┐             ┌─────────────┐   │
│   │ Cursor  │ ──────────────►│   GitHub    │             │    K3s      │   │
│   │ + Code  │                │   Repo      │             │  Cluster    │   │
│   └─────────┘                └──────┬──────┘             └──────▲──────┘   │
│                                     │                           │           │
│                                     │ Triggers                  │           │
│                                     ▼                           │           │
│                              ┌─────────────┐                    │           │
│                              │   GitHub    │                    │           │
│                              │   Actions   │                    │           │
│                              │    (CI)     │                    │           │
│                              └──────┬──────┘                    │           │
│                                     │                           │           │
│                                     │ Build + Push              │           │
│                                     ▼                           │           │
│                              ┌─────────────┐      SSH Deploy    │           │
│                              │    GHCR     │ ───────────────────┘           │
│                              │  (Registry) │      (CD)                      │
│                              └─────────────┘                                │
│                                                                              │
└─────────────────────────────────────────────────────────────────────────────┘
```

---

## 🛠️ Technology Stack

### Backend

| Technology | Version | Purpose |
|------------|---------|---------|
| Java | 21 | Programming language |
| Spring Boot | 3.2+ | Microservices framework |
| Spring Data JPA | 3.2+ | Database ORM |
| Spring Kafka | 3.1+ | Event streaming |
| Spring AOP | 3.2+ | Cross-cutting concerns |
| Lombok | Latest | Reduce boilerplate |
| MapStruct | Latest | Object mapping |

### Frontend

| Technology | Version | Purpose |
|------------|---------|---------|
| React | 18+ | UI framework |
| TypeScript | 5+ | Type safety |
| Tailwind CSS | 3+ | Styling |
| Axios | Latest | HTTP client |
| React Query | Latest | Server state management |

### Database & Messaging

| Technology | Version | Purpose |
|------------|---------|---------|
| PostgreSQL | 15 | Primary database |
| Apache Kafka | 3.7 | Event streaming |
| Redis | 7+ | Caching (Phase 2) |

### DevOps & Cloud

| Technology | Purpose |
|------------|---------|
| Docker | Containerization |
| Kubernetes (K3s) | Container orchestration |
| GitHub Actions | CI/CD pipeline |
| GHCR | Container registry |
| AWS EC2 | Cloud hosting |
| Prometheus | Metrics collection |
| Grafana | Metrics visualization |

---

## 🔧 Microservices Details

### Service 1: API Gateway (Port 8080)

**Responsibilities:**
- Request routing
- Load balancing
- Rate limiting
- Authentication (Phase 2)
- Request/Response logging

**Endpoints:**
```
POST   /api/accounts          → Account Service
GET    /api/accounts/{id}     → Account Service
POST   /api/transactions      → Transaction Service
GET    /api/transactions      → Transaction Service
```

---

### Service 2: Account Service (Port 8081)

**Responsibilities:**
- Account creation
- Balance management
- Account queries

**Endpoints:**
```
POST   /accounts              Create new account
GET    /accounts/{id}         Get account details
GET    /accounts/number/{num} Get by account number
PUT    /accounts/{id}/balance Update balance
GET    /accounts/{id}/balance Get balance
```

**Kafka Events Published:**
- `account-created`
- `balance-updated`

---

### Service 3: Transaction Service (Port 8082)

**Responsibilities:**
- Process money transfers
- Validate transactions
- Maintain transaction history

**Endpoints:**
```
POST   /transactions          Initiate transfer
GET    /transactions/{id}     Get transaction status
GET    /transactions/account/{accountId}  Transaction history
```

**Kafka Events:**
- Publishes: `transaction-initiated`, `transaction-completed`, `transaction-failed`
- Consumes: `debit-completed`, `credit-completed`

---

### Service 4: Notification Service (Port 8083)

**Responsibilities:**
- Consume Kafka events
- Send notifications (log/email in Phase 2)
- Maintain notification history

**Kafka Events Consumed:**
- `transaction-completed`
- `transaction-failed`
- `account-created`

---

## 📨 Kafka Topics

| Topic | Producer | Consumer |
|-------|----------|----------|
| `transaction-initiated` | Transaction Service | Account Service |
| `debit-completed` | Account Service | Transaction Service |
| `credit-completed` | Account Service | Transaction Service |
| `transaction-completed` | Transaction Service | Notification Service |
| `transaction-failed` | Transaction Service | Notification Service |
| `notification-request` | Any Service | Notification Service |

---

## 🚀 Future Scope & Roadmap

### Short Term (1-3 months)

- [ ] User authentication & authorization
- [ ] Email/SMS notifications
- [ ] QR code payments
- [ ] Transaction limits & controls
- [ ] Mobile-responsive UI
- [ ] API rate limiting

### Medium Term (3-6 months)

- [ ] Multi-currency support
- [ ] Recurring payments
- [ ] Bill payments integration
- [ ] Merchant dashboard
- [ ] Analytics dashboard
- [ ] Redis caching layer

### Long Term (6-12 months)

- [ ] AI-powered fraud detection
- [ ] ML-based spending categorization
- [ ] Chatbot customer support
- [ ] Credit scoring system
- [ ] Investment features
- [ ] Cryptocurrency integration

### Enterprise Features

- [ ] Multi-tenancy
- [ ] SSO/SAML integration
- [ ] Audit compliance (PCI-DSS)
- [ ] Disaster recovery
- [ ] Geographic redundancy
- [ ] SLA monitoring

---

## 🎤 Interview Pitch

> "I built **PayFlow**, a real-time digital wallet platform inspired by Paytm and PhonePe. It's a microservices-based system with four Spring Boot services communicating through Kafka for event-driven architecture.
>
> The system handles money transfers with proper transaction management - when you transfer money, it publishes events to Kafka, the account service debits the sender, credits the receiver, and the notification service picks up completion events to notify users.
>
> I deployed everything on Kubernetes using K3s on AWS EC2. The entire CI/CD pipeline is automated using GitHub Actions - when I push code, it builds Docker images, pushes to GitHub Container Registry, and deploys to the K8s cluster.
>
> For monitoring, I integrated Prometheus and Grafana to track API latencies, transaction volumes, and system health. The system is designed to scale - Kafka enables handling high transaction volumes, and Kubernetes HPA can auto-scale pods based on load.
>
> What I'm most proud of is the transaction saga implementation - it ensures consistency across services even if one fails. This is critical for financial applications."

---

## ⌨️ Quick Reference Commands

### AWS EC2 Connection

```bash
# Connect to EC2
ssh -i payflow-key.pem ubuntu@<EC2_PUBLIC_IP>
```

### Kubernetes (on EC2)

```bash
# Aliases already set up:
kc get pods -n payflow          # List pods
kc get services -n payflow      # List services
kc logs -n payflow <pod-name>   # View logs
kc describe pod -n payflow <pod> # Pod details
```

### PostgreSQL

```bash
pgsql                           # Connect to database
\dt                             # List tables
\q                              # Exit
```

### Kafka

```bash
kafka-topics --list                              # List topics
kafka-topics --create --topic <name> --partitions 1 --replication-factor 1
kafka-console-producer --topic <name>            # Send messages
kafka-console-consumer --topic <name> --from-beginning  # Read messages
```

### Docker (Local)

```bash
docker build -t payflow/<service> .   # Build image
docker images                         # List images
docker ps                            # Running containers
```

### Git

```bash
git add .
git commit -m "message"
git push origin main
```

---

## 📝 Notes

- **Cost Optimization:** Always STOP EC2 instance when not working (good habit)
- **IP Changes:** Public IP changes after stop/start (no Elastic IP to save cost)
- **Free Tier (t2.micro):** ₹0 for first 12 months (750 hours/month)
- **Free Tier (EBS 25GB):** ₹0 (30GB free)
- **After Free Tier Expires:** ~₹1.50/hour for t2.micro

### AWS Free Tier Details (First 12 Months)

| Resource | Free Allowance | Our Usage |
|----------|---------------|-----------|
| EC2 (t2.micro) | 750 hours/month | ✅ Covered |
| EBS Storage | 30 GB/month | ✅ 25GB used |
| Data Transfer | 15 GB/month | ✅ Covered |
| **Total Cost** | - | **₹0** |

---

## 🔗 Important Links

| Resource | URL |
|----------|-----|
| GitHub Repo | `https://github.com/<username>/payflow` |
| AWS Console | `https://console.aws.amazon.com` |
| K3s Docs | `https://k3s.io` |
| Spring Boot Docs | `https://spring.io/projects/spring-boot` |

---

## 📞 Backup Prompt

If this conversation is lost, use this prompt to restore context:

```
I'm building PayFlow - a digital wallet platform. Here's my setup:

LOCAL PC:
- Java 21, Maven, Git, Docker 29.1.3, Node.js 24.12.0, npm 11.6.2

AWS EC2 (Mumbai - ap-south-1):
- Ubuntu 24.04 on t2.micro
- K3s v1.33.6 installed
- PostgreSQL running (payflow namespace)
- Kafka running (KRaft mode, payflow namespace)
- Database tables: accounts, transactions (with sample data)
- 2GB swap configured
- Aliases: kc (kubectl), pgsql (connect db), kafka-topics, kafka-console-producer, kafka-console-consumer

NEXT STEPS:
1. Create GitHub repo
2. Build 4 Spring Boot microservices
3. Create React frontend
4. Set up GitHub Actions CI/CD (GHCR → K3s)
5. Deploy to AWS

Tech Stack: Spring Boot 3, React 18, PostgreSQL 15, Kafka 3.7, K3s, Docker, GitHub Actions
```

---

*Last Updated: December 26, 2025*

