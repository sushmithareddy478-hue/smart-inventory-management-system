# 📦 Inventory Pro — Smart Inventory Management System

[![Spring Boot](https://img.shields.io/badge/Spring%20Boot-3.3.4-brightgreen.svg)](https://spring.io/projects/spring-boot)
[![Spring AI](https://img.shields.io/badge/Spring%20AI-OpenAI%20GPT--4o-blue.svg)](https://spring.io/projects/spring-ai)
[![React](https://img.shields.io/badge/React-18.3-61DAFB.svg)](https://reactjs.org/)
[![Vite](https://img.shields.io/badge/Vite-5.4-purple.svg)](https://vitejs.dev/)
[![Tailwind CSS](https://img.shields.io/badge/TailwindCSS-3.4-38B2AC.svg)](https://tailwindcss.com/)
[![Aiven MySQL](https://img.shields.io/badge/Database-Aiven%20Cloud%20MySQL-orange.svg)](https://aiven.io/)
[![Docker](https://img.shields.io/badge/Docker-Multi--stage%20Compose-2496ED.svg)](https://www.docker.com/)

**Inventory Pro** is a modern, enterprise-ready smart inventory and supply chain management platform. It combines robust backend microservices in **Java Spring Boot 3**, automated database schema migrations via **Flyway**, cloud-native storage on **Aiven Cloud MySQL**, and an AI copilot layer powered by **Spring AI / OpenAI** with a reactive dashboard in **React 18 &amp; Tailwind CSS**.

---

## 🌐 Live Deployed Links

- **🚀 Live Web App:** [https://smart-inventory-management-system-t-mu.vercel.app](https://smart-inventory-management-system-t-mu.vercel.app)
- **⚡ GitHub Repository:** [https://github.com/sushmithareddy478-hue/smart-inventory-management-system](https://github.com/sushmithareddy478-hue/smart-inventory-management-system)

---

## 🌟 Key Features

1. **Enterprise Product Catalog &amp; Barcode / QR Scanning**
   - Full CRUD product master data with SKUs, category classifications, and supplier bindings.
   - Barcode and QR code scanning viewport simulation with instant SKU lookup.
   - Inline Stock In / Out adjustments with automatic audit trails.

2. **Automated Low-Stock Alerts &amp; Threshold Tracking**
   - Real-time stock status monitoring against customized minimum thresholds.
   - Immediate warning badges and automated notification hooks.

3. **AI Copilot &amp; Smart Insights (Spring AI / OpenAI GPT-4o)**
   - **Smart Demand Forecasting:** Calculates historical sales velocity from inventory transactions and forecasts depletion runout days with 7-day projection curves.
   - **Automated Reorder Point Suggestions:** Computes dynamic safety stock considering supplier lead times and generates 1-click purchase order drafts.
   - **Natural Language Assistant:** Live contextual queries such as *"Which items are low in stock?"* or *"Generate a purchase order draft for Supplier Apex"*.

4. **Procurement &amp; Supplier Management**
   - Vendor directory tracking contact details, ratings, and lead times in days.
   - Complete Purchase Order lifecycle (`PENDING` ➔ `APPROVED` ➔ `RECEIVED` / `CANCELLED`).
   - Automatic inventory ingestion upon order delivery (`RECEIVED`).

5. **Multi-Tenant / Role-Based Access Control (RBAC) &amp; Audit Logs**
   - Roles: `ROLE_ADMIN`, `ROLE_WAREHOUSE_MANAGER`, `ROLE_STAFF`.
   - Stateless JWT authentication via Spring Security 6.
   - Immutable audit logs tracking all stock movements, IP addresses, user emails, and JSON change diffs.

6. **Cloud Database Ready (Aiven Cloud MySQL)**
   - SSL connection configuration (`sslMode=REQUIRED`).
   - Production connection pooling with HikariCP.

---

## 📂 Project Architecture &amp; Folder Structure

```text
smart-inventory-management-system/
├── docker-compose.yml              # Multi-container orchestration (MySQL, Backend, Frontend)
├── .env.example                    # Template environment variables
├── README.md                       # Comprehensive guide & documentation
│
├── backend/                        # Java Spring Boot 3 Application (Maven)
│   ├── pom.xml                     # Maven dependencies (Spring Boot, Spring AI, Security, Flyway, MySQL)
│   ├── Dockerfile                  # Multi-stage Docker build (Temurin 17 JRE)
│   └── src/
│       └── main/
│           ├── resources/
│           │   ├── application.yml         # Production config for Aiven MySQL & Spring AI
│           │   ├── application-local.yml   # Local profile
│           │   └── db/migration/
│           │       ├── V1__init_schema.sql # Relational database schema
│           │       └── V2__seed_demo_data.sql # Realistic seed data & test credentials
│           └── java/com/inventorypro/
│               ├── InventoryProApplication.java
│               ├── config/                 # Security, JWT filter, CORS, Swagger OpenAPI
│               │   ├── SecurityConfig.java
│               │   ├── JwtAuthenticationFilter.java
│               │   ├── JwtUtils.java
│               │   ├── CorsConfig.java
│               │   └── OpenApiConfig.java
│               ├── entity/                 # JPA domain models
│               │   ├── User.java, Role.java
│               │   ├── Category.java, Supplier.java, Product.java
│               │   ├── PurchaseOrder.java, PurchaseOrderItem.java
│               │   ├── InventoryTransaction.java, AuditLog.java
│               ├── repository/             # Spring Data JPA repositories
│               ├── dto/                    # Auth, Product, Order, AI, Dashboard DTOs
│               ├── service/                # Business logic services
│               │   ├── AuthService.java, ProductService.java
│               │   ├── SupplierService.java, OrderService.java
│               │   ├── AuditLogService.java
│               │   └── ai/InventoryAiService.java # Spring AI integration & forecasting
│               ├── controller/             # REST API Controllers
│               │   ├── AuthController.java, ProductController.java
│               │   ├── SupplierController.java, OrderController.java
│               │   ├── AiAssistantController.java, DashboardController.java
│               │   └── AuditLogController.java, UserController.java
│               └── exception/              # Global REST Exception Handlers
│
└── frontend/                       # React 18 + Vite + TypeScript Application
    ├── package.json                # Dependencies (Tailwind, Lucide, Vite)
    ├── vite.config.ts              # Vite server & API proxy config
    ├── tailwind.config.js          # Modern dark-mode palette & glassmorphism
    ├── Dockerfile                  # Multi-stage build (Node 20 -> Nginx Alpine)
    ├── nginx.conf                  # Nginx reverse proxy & SPA routing
    └── src/
        ├── types/index.ts          # TypeScript type definitions
        ├── api/client.ts           # REST API client with intelligent offline fallback
        ├── components/
        │   ├── Navbar.tsx          # Top bar, role switcher, quick scanner trigger
        │   ├── Sidebar.tsx         # Navigation tabs & alert badges
        │   └── BarcodeScannerModal.tsx # Interactive barcode & QR scanning modal
        └── pages/
            ├── Dashboard.tsx       # Real-time KPIs & category visualizations
            ├── Inventory.tsx       # Product CRUD, barcode search, stock adjustments
            ├── AiAssistant.tsx     # AI Copilot chat, forecasting & reorder points
            ├── SuppliersAndOrders.tsx # Vendor catalog & PO workflow
            └── AuditAndUsers.tsx   # Audit event log & RBAC permission matrix
```

---

## 🗄️ Database Schema (`schema.sql` Overview)

The database schema is automated via Flyway migrations located in `backend/src/main/resources/db/migration/`:

1. `users`: System accounts, role enum (`ROLE_ADMIN`, `ROLE_WAREHOUSE_MANAGER`, `ROLE_STAFF`), password hashes.
2. `categories`: SKU product taxonomies (`Electronics`, `Networking`, `Office`, `Packaging`).
3. `suppliers`: Vendor name, contact person, email, lead time days, ratings.
4. `products`: Barcode (unique), SKU (unique), unit price, cost price, current quantity, min threshold, reorder point, warehouse rack location.
5. `purchase_orders` & `purchase_order_items`: Procurement orders, unit costs, delivery dates, workflow status.
6. `inventory_transactions`: Historical delta log (`STOCK_IN`, `STOCK_OUT`, `ADJUSTMENT`) used to derive sales velocity.
7. `audit_logs`: Detailed JSON audit events tracking user email, IP address, and changed fields.

---

## ☁️ Aiven Cloud MySQL Configuration

To connect directly to **Aiven Cloud MySQL**:

1. Log in to [Aiven Console](https://console.aiven.io/) and create a MySQL instance.
2. In the **Overview** tab, copy your connection details:
   - Host: `mysql-xxxxx-yourproject.aivencloud.com`
   - Port: `25060` (or your assigned port)
   - User: `avnadmin`
   - Password: `<your-password>`
3. Set your environment variables in `.env` or system environment:
   ```env
   DB_HOST=mysql-xxxxx-yourproject.aivencloud.com
   DB_PORT=25060
   DB_NAME=defaultdb
   DB_USER=avnadmin
   DB_PASSWORD=your_aiven_password
   DB_SSL_MODE=REQUIRED
   ```
4. Spring Boot will connect using the configured JDBC string with SSL validation:
   ```yaml
   spring:
     datasource:
       url: jdbc:mysql://${DB_HOST}:${DB_PORT}/${DB_NAME}?sslMode=${DB_SSL_MODE:REQUIRED}&allowPublicKeyRetrieval=true&useSSL=true&serverTimezone=UTC
   ```

---

## 🚀 Running Locally

### Option 1: Full Docker Compose (Recommended)

To launch the complete stack (MySQL + Spring Boot Backend + React Frontend):

```bash
# 1. Clone repository & copy environment variables
cp .env.example .env

# 2. Build and start containers
docker-compose up --build -d

# 3. Access applications:
# Frontend: http://localhost:80
# Backend API: http://localhost:8080/api/v1
# Swagger UI: http://localhost:8080/api/v1/swagger-ui.html
```

### Option 2: Running Frontend & Backend Separately

#### 1. Backend (Java 17+ & Maven)
```bash
cd backend
mvn spring-boot:run
# Server starts at http://localhost:8080/api/v1
```

#### 2. Frontend (Node.js 18+ & npm)
```bash
cd frontend
npm install
npm run dev
# Vite dev server runs at http://localhost:5173
```

---

## 🔑 Default Seed Credentials

Flyway migration `V2__seed_demo_data.sql` provisions default accounts:

| Username | Default Password | Role | Description |
| :--- | :--- | :--- | :--- |
| `admin` | `admin123` | `ROLE_ADMIN` | Full administrative & access governance privileges |
| `manager` | `manager123` | `ROLE_WAREHOUSE_MANAGER` | Can create products, manage POs, adjust inventory |
| `staff` | `staff123` | `ROLE_STAFF` | Scan barcodes, look up items, dispatch items |

---

## 🤖 AI Copilot Capabilities

- **Natural Language Inventory Queries:** Ask questions in plain English (*"Which items are running out of stock this week?"*).
- **Predictive Velocity Calculation:** Uses real transaction movements to compute daily burn rate and forecast stockout dates.
- **1-Click Purchase Order Drafts:** Instantly generates supplier purchase orders from low-stock recommendations.
- **Offline / Autonomous Fallback:** Gracefully degrades to rule-based algorithms if an OpenAI API key is omitted.
