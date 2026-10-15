# NexusStream App

NexusStream is a full-stack e-commerce and product showcase application used as a practical QA sandbox. It includes authentication, checkout, inventory-aware order handling, audit logging, and a lightweight AI assistant workflow that supports quality engineering exercises.

## What this app demonstrates

- storefront browsing and product catalog behavior
- user registration and authentication
- protected access for checkout and admin routes
- cart and order validation with stock checks
- audit log access for privileged users
- policy and AI support scenarios for QA evaluation

## Architecture

- Frontend: React + Vite
- Backend: Express + TypeScript
- Default database: SQLite
- Optional database: PostgreSQL via Docker
- Session auth: JWT + cookie-based session

## Local setup

### Requirements
- Node.js 18+
- npm
- Docker (optional for PostgreSQL)

### Install and run
```bash
cd nexusstream-app
npm install
npm run dev
```

The app runs at http://localhost:3000

### Optional database service
```bash
npm run compose:up
```

## Key app routes

- `GET /api/health`
- `POST /api/auth/register`
- `POST /api/auth/login`
- `GET /api/products`
- `POST /api/orders`
- `GET /api/admin/logs`
- `GET /api/policy`
- `POST /api/mock/payment`

## QA use cases

This app is structured to support:

- manual functional and negative testing
- API validation and contract checks
- SQL and database integrity verification
- Python automation with Pytest and HTTPX
- Playwright end-to-end regression testing
- risk-based testing and security checks
- AI prompt grounding and response evaluation

## Portfolio story

The project is intentionally small but realistic. It gives a clear quality engineering path from manual exploration to automated regression, CI validation, and AI quality checks without overbuilding unnecessary complexity.

