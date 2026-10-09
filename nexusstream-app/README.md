# NexusStream QA Portfolio App

This repository contains the working NexusStream application used as the main portfolio project for a QA and quality engineering roadmap. The app is intentionally built as a realistic e-commerce and digital product storefront with authentication, cart flow, database-backed order processing, admin audit logging, and an AI assistant mock that can be used for QA and automation exercises.

This project is designed to match the real learning path in the NexusStream QA roadmap:
- manual testing and defect reporting
- API testing and database verification
- Python and Pytest automation
- UI automation with Playwright
- CI/CD and reliability work
- AI/LLM evaluation later in the portfolio

## App overview

NexusStream is a small full-stack marketplace for hardware and digital products. It includes:
- landing page
- product catalog and filtering
- search and product cards
- login and registration flow
- protected routes for checkout and admin
- shopping cart and checkout wizard
- order creation with stock checks and idempotency support
- audit log console for admin users
- policy endpoint and a simple AI assistant
- optional PostgreSQL support via Docker

## What is actually in this app

### Frontend
- React + Vite app
- routes for `/`, `/shop`, `/login`, `/checkout`, `/admin`
- protected routes for checkout and admin access
- dark, technical UI with test selectors and accessible page structure

### Backend
- Express server in `server.ts`
- JWT auth with cookie-based session
- SQLite default database for local development
- PostgreSQL option through environment variables and Docker Compose
- product listing, register/login, order processing, audit log access, and policy API

### Data and business logic
- users
- products
- orders
- order items
- audit logs
- idempotency keys

### QA-relevant behavior
- cart limits and stock validation
- authentication errors for invalid credentials
- duplicate email handling
- insufficient stock handling on order placement
- admin-only log access
- protected route redirect to login when unauthenticated
- mock payment endpoint for failure and timeout scenarios

## Repository structure

```text
nexusstream-app/
├── .env
├── .env.example
├── docker-compose.yml
├── package.json
├── server.ts
├── tsconfig.json
├── vite.config.ts
├── index.html
├── metadata.json
├── README.md
├── nexusstream.db
├── dist/
├── src/
│   ├── App.tsx
│   ├── main.tsx
│   ├── index.css
│   ├── components/
│   │   ├── Navigation.tsx
│   │   ├── NexusAgent.tsx
│   ├── context/
│   │   ├── Authcontext.tsx
│   │   └── CartContext.tsx
│   └── pages/
│       ├── Home.tsx
│       ├── Shop.tsx
│       ├── Auth.tsx
│       ├── Checkout.tsx
│       └── Admin.tsx
└──
```

## Local setup

Requirements:
- Node.js 18+
- npm
- Docker (optional, for PostgreSQL)

Install dependencies:

```bash
npm install
```

Run the app locally:

```bash
npm run dev
```

The app runs on:
- http://localhost:3000

Optional database service:

```bash
npm run compose:up
```

This starts the PostgreSQL container used by the project when configured with environment variables.

## Environment variables

Create a local `.env` file based on `.env.example`.

Example:

```env
TEST_MODE=1
NODE_ENV=development
PGHOST=localhost
PGPORT=5432
PGUSER=nexus
PGPASSWORD=nexus_password
PGDATABASE=nexusstream
GEMINI_API_KEY=your_key_here
```

## Useful app routes

### Auth
- `POST /api/auth/register`
- `POST /api/auth/login`
- `POST /api/auth/logout`
- `GET /api/user`

### Products
- `GET /api/products`
- `POST /api/products`

### Orders
- `POST /api/orders`

### Admin
- `GET /api/admin/logs`

### Misc
- `GET /api/health`
- `GET /api/policy`
- `POST /api/mock/payment`

### Testing helpers
- `POST /api/test/seed`
- `POST /api/test/teardown`

## QA roadmap aligned to this app

### Phase 0 — Environment setup
Goal: get a working local environment, repo, and project baseline.

This project uses:
- Node.js + npm
- Express API
- SQLite by default
- PostgreSQL optional via Docker
- Git and GitHub

Deliverable:
- working app locally
- repository ready for QA and automation work

### Phase 1 — Software QA fundamentals
Use the NexusStream app to practice:
- smoke and regression testing
- functional testing
- negative testing
- boundary value testing
- defect documentation
- risk assessment

Example areas:
- login validation
- registration validation
- shop filtering and search
- cart stock limits
- checkout step validation
- admin access and audit logging

Deliverable:
- test plan
- bug reports
- risk matrix
- 40–60 meaningful test cases

### Phase 2 — API and database testing
Focus on the backend contract and persisted behavior.

Use this app to test:
- authentication endpoints
- product API responses
- order creation and stock deduction
- idempotency behavior
- database state after order creation
- SQL verification of orders and products

Deliverable:
- Postman collection
- API defect log
- SQL verification queries

### Phase 3 — Python and Pytest automation
Translate the API and validation work into Python automation:
- login and registration tests
- product and order API checks
- invalid-input negative tests
- stock validation checks
- database assertions for saved records

Deliverable:
- Python API automation suite
- reusable fixtures and request helpers

### Phase 4 — Playwright and end-to-end testing
Automate the real UI workflow in this app:
- login and registration
- product search and filtering
- cart behavior
- checkout step flow
- order confirmation
- admin log view
- protected route redirects

Deliverable:
- Playwright suite for user journeys and regression coverage

### Phase 5 — Reliable automation and CI/CD
Focus on stable, reusable automation:
- test isolation
- fixtures and helpers
- regression execution
- GitHub Actions workflows
- CI artifact collection and failure evidence

Deliverable:
- GitHub Actions pipeline
- reproducible environment setup
- test reporting

### Phase 6 — AI quality engineering
This app includes an AI assistant and policy-based behavior, which makes it suitable for AI QA work later in the portfolio.

Good evaluation areas:
- prompt grounding
- policy adherence
- refusal handling
- safety and hallucination checks
- structured outputs
- tool-use validation

Deliverable:
- evaluation dataset
- repeatable AI quality checks
- CI execution for AI tests

## Recommended portfolio story

The portfolio should present NexusStream as one main project, not three separate projects. The story is:
- build the app
- test the app manually
- automate the API and UI
- verify data integrity
- run in CI
- evaluate AI behavior later

This keeps the project coherent and makes it easy to explain in interviews.

## What this app is good for in QA

This app is suitable for:
- manual QA exercises
- API testing with Postman
- SQL and database validation
- Python API automation
- Playwright E2E automation
- GitHub project and defect tracking
- CI/CD workflow practice
- later AI quality engineering tasks

## Practical note

The app is not a large production system. It is a focused QA sandbox built to demonstrate realistic flows, realistic testing challenges, and a clear path from manual testing into automation. That makes it a strong fit for a quality engineering portfolio.

Use this project to show real work, not invented claims. Document the exact behaviors you verify, the defects you record, and the automation you build.

