<h1 align="center">GYM Backend API</h1>

<p align="center">
Backend API for gym management built with Node.js and TypeScript.
</p>

<p align="center">
Authentication, user management, products and purchase orders.
</p>

<p align="center">
  <img src="https://img.shields.io/badge/Node.js-20-green?logo=node.js" />
  <img src="https://img.shields.io/badge/TypeScript-3178C6?logo=typescript&logoColor=white" />
  <img src="https://img.shields.io/badge/Express.js-000000?logo=express&logoColor=white" />
  <img src="https://img.shields.io/badge/PostgreSQL-4169E1?logo=postgresql&logoColor=white" />
  <img src="https://img.shields.io/badge/Docker-2496ED?logo=docker&logoColor=white" />
</p>


📖 About

GYM Backend API is a backend application designed to manage users, products and purchase orders.

The project follows Clean Architecture principles, focusing on maintainability, testability and separation of concerns.

---

🚀 Features

👉 Authentication & Authorization

- JWT authentication
- User registration
- User login
- Role-based access control (RBAC)

👉 Product Management

- Product registration
- Product update
- Product search and filtering

👉 Order Management

- Purchase order creation
- Order item management
- Duplicate item validation
- Historical purchase price tracking

👉 System

- Input validation
- Error handling
- Unit tests with Jest
- In-Memory repositories for testing

---

🛠 Tech Stack

👉 Backend

- Node.js
- TypeScript
- Express.js

👉 Database

- PostgreSQL
- TypeORM

👉 DevOps

- Docker
- Docker Compose

👉 Testing

- Jest

---

🏛 Architecture

💡 This project follows a modular architecture inspired by Clean Architecture principles.

```bash
src/
├── @types/
├── infra/
├── modules/
│   ├── auth/
│   ├── user/
│   ├── product/
│   ├── order/
│   └── order-item/
├── services/
├── shared/
└── utils/

---

Module Structure

```bash
module/
├── controllers/
├── dtos/
├── entities/
├── mappers/
├── repositories/
├── usecases/
└── tests/
```

💡 Request Flow

```text
HTTP Request
      │
      ▼
 Controller
      │
      ▼
  Use Case
      │
      ▼
 Repository
      │
      ▼
 Database
```

---

🧪 Testing

Business rules are tested independently from the database using In-MemoryRepositories.

For Example:

```ts
const repository = new InMemoryProductRepository();

const useCase = new ProductUseCase(repository);

await useCase.create(product);
```

This approach allows fast and reliable unit tests without requiring a database connection.

---

## ⚙️ Running the Project

### Clone the repository

```bash
git clone <repository-url>
```

### Install dependencies

```bash
npm install
```

### Configure environment variables

```bash
cp .env.example .env
```

### Run with Docker

```bash
docker-compose up -d
```

### Run locally

```bash
npm run dev
```

---

💡 Main Concepts Demonstrated

- Clean Architecture
- SOLID Principles
- Repository Pattern
- Dependency Injection
- DTO Pattern
- Unit Testing
- Modular Architecture
- JWT Authentication

---

## 📄 License

This project is licensed under the MIT License.