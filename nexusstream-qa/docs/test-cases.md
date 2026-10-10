# NexusStream QA — Test Case Matrix

This document summarizes the real automated test coverage available in the `nexusstream-qa` project. It is based on the actual test files and validation patterns currently implemented in the repository.

The purpose is to reflect practical QA coverage for the app, not generic template test cases.

---

## 1. Authentication and User Access

| Test ID | Priority | Layer | Scope | Scenario | Expected Result |
|---|---:|---|---|---|---|
| TC-AUTH-001 | High | API | `/api/user` | Unauthenticated user requests profile data | HTTP 401 |
| TC-AUTH-002 | High | API | `/api/auth/register` | Register a valid new user | HTTP 200 and success response |
| TC-AUTH-003 | High | API | `/api/auth/login` | Login with valid credentials | HTTP 200 and token returned |
| TC-AUTH-004 | High | API | `/api/auth/login` | Login with invalid credentials | HTTP 401 / auth failure |
| TC-AUTH-005 | High | UI | Home → Login flow | User registers and logs in from UI | Browser redirects to `/shop` |

### Source coverage
- `tests/api/test_auth.py`
- `tests/ui/test_auth_ui.py`

---

## 2. Product and Catalog Validation

| Test ID | Priority | Layer | Scope | Scenario | Expected Result |
|---|---:|---|---|---|---|
| TC-PROD-001 | Medium | API | `/api/products` | Fetch product catalog | HTTP 200 and valid product list structure |
| TC-PROD-002 | Medium | API | `/api/products` | Create product without auth | 401 or 403 |
| TC-PROD-003 | Low | API | `/api/health` | Health endpoint is available | HTTP 200 |
| TC-PROD-004 | Low | API | `/api/policy` | Policy endpoint returns data | HTTP 200 |

### Source coverage
- `tests/api/test_products.py`
- `tests/api/test_health.py`
- `tests/api/test_policy.py`

---

## 3. Orders and Checkout Business Rules

| Test ID | Priority | Layer | Scope | Scenario | Expected Result |
|---|---:|---|---|---|---|
| TC-ORDER-001 | Critical | API | `/api/orders` | Place order without auth | HTTP 401 |
| TC-ORDER-002 | Critical | API | `/api/orders` | Place a valid order with valid auth | HTTP 200 and success payload |
| TC-ORDER-003 | Critical | API | `/api/orders` | Attempt order with invalid stock quantity | HTTP 409 |
| TC-ORDER-004 | Critical | UI | Storefront flow | Home → login → search → add item → checkout | Checkout completes successfully |

### Source coverage
- `tests/api/test_orders.py`
- `tests/ui/test_storefront_flow.py`
- `tests/e2e/test_storefront_to_db.py`

---

## 4. Admin and Authorization Rules

| Test ID | Priority | Layer | Scope | Scenario | Expected Result |
|---|---:|---|---|---|---|
| TC-ADMIN-001 | High | API | `/api/admin/logs` | Unauthenticated access | HTTP 401 |
| TC-ADMIN-002 | High | API | `/api/admin/logs` | Regular user access attempt | Expected 403, currently marked xfail |
| TC-ADMIN-003 | High | API | `/api/admin/logs` | Admin access | HTTP 200 |

### Source coverage
- `tests/api/test_admin.py`

---

## 5. Database Verification Checks

| Test ID | Priority | Layer | Scope | Scenario | Expected Result |
|---|---:|---|---|---|---|
| TC-DB-001 | High | Database | `users` | User creation persists correctly | User row exists after registration |
| TC-DB-002 | Critical | Database | `orders` + `order_items` | Order creation persists records | Order and line items are stored |
| TC-DB-003 | Critical | Database | `products` | Stock decreases after successful order | Inventory count reflects order quantity |
| TC-DB-004 | High | Database | `audit_logs` | Actions are logged | Audit log entry exists |

### Source coverage
- `tests/e2e/`
- `sql/order-verification.sql`

---

## 6. Performance Coverage

| Test ID | Priority | Layer | Scope | Scenario | Expected Result |
|---|---:|---|---|---|---|
| TC-PERF-001 | Medium | Performance | k6 script | Product endpoint under load | Endpoint remains responsive within expected thresholds |

### Source coverage
- `performance/k6-load-test.js`
- `tests/api/test_load_performance.py`

---

## 7. Current Test Coverage Summary

The project currently covers the practical QA flow of the application:

- authentication and access control
- product list validation
- order creation and stock enforcement
- admin route protection
- UI and e2e regression checks
- basic database verification
- performance sanity checks

This is a realistic and maintainable test matrix for a portfolio-focused QA project.
