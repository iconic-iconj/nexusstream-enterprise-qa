# NexusStream QA — Test Coverage Matrix

## 1. Purpose

This document summarizes the intended and reported automated test coverage for NexusStream, a full-stack storefront application.

I use this matrix to organize test scenarios by feature, testing layer, priority, expected behavior, and source file. It provides a practical view of the application's quality checks across authentication, product catalog, checkout, authorization, database integrity, and performance.

Test status should be confirmed against the current test files and latest execution results. A documented scenario does not, by itself, establish that the test is implemented or passing.

## 2. Authentication and User Access

| Test ID | Priority | Layer | Scenario | Expected Result | Test Source |
|---|---|---|---|---|---|
| TC-AUTH-001 | High | API | Request user profile without authentication | Request is rejected with HTTP 401 | `tests/api/test_auth.py` |
| TC-AUTH-002 | High | API | Register a new user with valid details | Registration succeeds with the documented success response | `tests/api/test_auth.py` |
| TC-AUTH-003 | High | API | Log in with valid credentials | Authentication succeeds and the expected token or session is issued | `tests/api/test_auth.py` |
| TC-AUTH-004 | High | API | Log in with invalid credentials | Authentication fails without granting access | `tests/api/test_auth.py` |
| TC-AUTH-005 | High | UI | Register and log in through the browser | User reaches the expected authenticated destination, such as `/shop` | `tests/ui/test_auth_ui.py` |

## 3. Product Catalog and Service Availability

| Test ID | Priority | Layer | Scenario | Expected Result | Test Source |
|---|---|---|---|---|---|
| TC-PROD-001 | Medium | API | Retrieve the product catalog | HTTP 200 and a response matching the expected product structure | `tests/api/test_products.py` |
| TC-PROD-002 | High | API / Security | Attempt a protected product-creation operation without authentication | Request is rejected with HTTP 401 or 403, according to the API contract | `tests/api/test_products.py` |
| TC-SVC-001 | Medium | API | Request the application health endpoint | HTTP 200 when the service is healthy | `tests/api/test_health.py` |
| TC-SVC-002 | Low | API | Retrieve policy information | HTTP 200 and the documented policy response structure | `tests/api/test_policy.py` |

## 4. Orders and Checkout

| Test ID | Priority | Layer | Scenario | Expected Result | Test Source |
|---|---|---|---|---|---|
| TC-ORDER-001 | Critical | API / Security | Submit an order without authentication | Request is rejected with HTTP 401 | `tests/api/test_orders.py` |
| TC-ORDER-002 | Critical | API | Submit a valid order as an authenticated user | Order creation succeeds and returns the expected response | `tests/api/test_orders.py` |
| TC-ORDER-003 | Critical | API / Business Rules | Submit an order exceeding available inventory | Request is rejected with the documented stock-conflict response, expected to be HTTP 409 | `tests/api/test_orders.py` |
| TC-ORDER-004 | Critical | UI / E2E | Complete the storefront journey from product discovery to checkout | The user completes the workflow and receives the expected confirmation | `tests/ui/test_storefront_flow.py` |
| TC-ORDER-005 | Critical | E2E / Database | Complete checkout and verify the saved order | The order is persisted with the expected customer, product, quantity, and total | `tests/e2e/test_storefront_to_db.py` |

## 5. Administrative Access Control

| Test ID | Priority | Layer | Scenario | Expected Result | Test Source |
|---|---|---|---|---|---|
| TC-ADMIN-001 | Critical | API / Security | Access administrative logs without authentication | Request is rejected with HTTP 401 | `tests/api/test_admin.py` |
| TC-ADMIN-002 | Critical | API / Security | Attempt to access administrative logs as a regular user | Access is denied with HTTP 403 | `tests/api/test_admin.py` |
| TC-ADMIN-003 | High | API / Authorization | Access administrative logs as an authorized administrator | Request succeeds with HTTP 200 and the expected response structure | `tests/api/test_admin.py` |

**Known defect:** TC-ADMIN-002 has previously been documented as an expected failure (`xfail`). It should remain identified as an unresolved authorization issue until the application's behavior is corrected and the test passes. An `xfail` result is not evidence that the security requirement has been satisfied.

## 6. Database Integrity

| Test ID | Priority | Layer | Scenario | Expected Result | Test Source |
|---|---|---|---|---|---|
| TC-DB-001 | High | Database / Integration | Register a new user and verify persistence | The expected user record exists in the database | Relevant authentication or integration tests |
| TC-DB-002 | Critical | Database / E2E | Place an order and verify transactional records | The order and its associated line items are persisted consistently | Relevant E2E tests; `sql/order-verification.sql`, if applicable |
| TC-DB-003 | Critical | Database / Business Rules | Place an order and inspect inventory | Stock reflects the completed order according to the inventory rules | Relevant order or database tests |
| TC-DB-004 | High | Database / Audit | Perform an auditable operation and inspect audit records | The expected audit entry exists when the operation is designed to generate one | Relevant audit tests, if implemented |

Database scenarios should be listed as automated coverage only when a corresponding assertion exists in the test suite. SQL verification scripts are useful supporting evidence, but a standalone query is not automatically an automated test.

## 7. Performance Testing

| Test ID | Priority | Layer | Scenario | Expected Result | Test Source |
|---|---|---|---|---|---|
| TC-PERF-001 | Medium | Performance | Exercise the product endpoint under simulated load | Response latency and error rates remain within explicitly configured thresholds | `performance/k6-load-test.js` |
| TC-PERF-002 | Medium | API / Performance | Measure endpoint response times during automated execution, if implemented | Measurements are collected and evaluated against the configured performance criteria | `tests/api/test_load_performance.py`, if present |

Performance results should include the workload, duration, thresholds, and observed metrics. A script that generates load does not establish that the application meets its performance objectives.

## 8. Coverage Overview

| Quality Area | Coverage Objective |
|---|---|
| Authentication | Registration, login, invalid credentials, protected resources |
| Authorization | Role-based access and administrative route protection |
| Product catalog | Product retrieval, response validation, protected operations |
| Order processing | Authentication requirements, inventory rules, order creation |
| UI regression | Browser-based authentication and storefront workflows |
| Database integrity | Persistence of users, orders, line items, and inventory changes |
| Performance | Response latency, error rates, and behavior under simulated load |
| AI application quality | Evaluation of customer-support responses against defined expectations, as implemented |

## 9. Test Execution and Reporting

Tests are executed using Pytest, with Playwright for browser automation and HTTPX for API testing. GitHub Actions provides automated execution and stores configured test reports as workflow artifacts.

Example commands from the `nexusstream-qa` directory:

```bash
# API tests
uv run pytest tests/api/ -v

# UI tests
uv run pytest tests/ui/ -v

# e2e tests
uv run pytest tests/e2e/ -v

# Full test suite
uv run pytest -v
```

Performance tests are executed separately using k6 when the required tooling and application environment are available.

The latest execution report should be used to record the number of passed, failed, skipped, and expected-failure tests. Results should not be inferred from this matrix.

## 10. Maintenance

I maintain this matrix alongside the test suite so that scenarios remain traceable to their implementation.

- Add or update scenarios when application requirements or behavior change.
- Keep expected results aligned with the API contract and business rules.
- Record known defects separately from passing coverage.
- Verify source file paths and test assertions before claiming coverage.
- Update test execution figures only from actual reports.
- Add dedicated LLM evaluation scenarios when corresponding automated checks are implemented.
