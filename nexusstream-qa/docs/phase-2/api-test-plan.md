# Phase 2 — API and Database Testing

## Objective
This phase focuses on validating the NexusStream backend through REST API testing and database verification. The work is aligned to the actual endpoints implemented in `nexusstream-app/server.ts` and the QA portfolio goal of demonstrating API and SQL testing ability.

## Scope
The following endpoints are in scope for this phase:
- `GET /api/health`
- `POST /api/auth/register`
- `POST /api/auth/login`
- `GET /api/products`
- `POST /api/orders`
- `GET /api/admin/logs`
- `GET /api/policy`

## Goals
- Verify request/response correctness for REST endpoints.
- Validate HTTP status codes and error handling.
- Check authentication and authorization behavior.
- Confirm order creation updates inventory and writes transactional records.
- Validate database entries after API actions using SQL.
- Record defects with evidence during API and database validation.

## Tools
- Postman for API request validation
- PostgreSQL or SQLite inspection for verification
- SQL query execution via psql or DB client
- Browser DevTools and app logs for supporting evidence

## Key test areas
### 1. Health and availability
- Confirm the service is reachable and returns success payloads.

### 2. Authentication
- Register a new user with valid email and password.
- Reject invalid email patterns and short passwords.
- Attempt login with valid and invalid credentials.
- Validate token behavior and session cookie creation.

### 3. Catalog and product retrieval
- GET product list returns expected order and structure.
- Category filter works as implemented.
- Empty or invalid input is handled gracefully.

### 4. Order creation and stock validation
- Order creation succeeds for valid items.
- Insufficient stock returns `409 Conflict`.
- Order creates related records in `orders` and `order_items`.
- Product stock decreases after valid order placement.

### 5. Admin logs and authorization
- Logged-in user can retrieve admin logs.
- Unauthenticated access is rejected with `401`.
- Admin log data is stored with timestamp and message values.

### 6. Database verification
- Validate that user, order, product, and audit table records match API behavior.
- Confirm transactions and data consistency for order placement.

## Success criteria
- API responses match expected status codes and payload structure.
- Order creation creates correct database records.
- Insufficient stock and invalid requests are rejected appropriately.
- SQL verification confirms the same business outcomes as the API.
- Defects are documented with reproducible evidence.

## Deliverables
- Postman collection or request checklist
- SQL verification scripts
- API and database defect evidence
- Phase 2 test-case log and summary
