# NexusStream QA — Bug Report Log

This document records the defects and validation notes that are relevant to the current `nexusstream-qa` project. The entries below reflect real test behavior observed against the live application and its automated QA suite.

The purpose is to keep the bug log clear, factual, and traceable to actual test coverage rather than listing generic or impossible issues.

---

## 1. Current Known Defect: Admin logs access for regular users

### Title
Regular users can access admin logs endpoint

### Severity
High

### Priority
High

### Status
Open / expected fail in QA suite

### Affected area
API authorization, Admin routes

### Traceability
`tests/api/test_admin.py`

### Description
A regular authenticated user is currently able to access `/api/admin/logs` when that route should be restricted to admin-level users only.

### Reproduction
1. Register and log in as a normal user.
2. Send a request to `/api/admin/logs` with the user token.
3. Observe the response status and payload.

### Expected result
The request should be rejected with HTTP 403 Forbidden.

### Actual result
The endpoint returns HTTP 200 and exposes admin log data.

### Evidence
```python
@pytest.mark.xfail(reason="BUG: Regular users can illegally access admin logs")
def test_admin_logs_deny_regular_user(api, user_headers):
    assert api.get("/api/admin/logs", headers=user_headers).status_code == 403
```

This is intentionally marked as an expected failure in the QA suite to document the known defect without breaking the rest of the regression run.

---

## 2. Verification Notes for Orders and Stock Rules

The project includes automated tests to verify that order creation and stock validation work correctly.

### Valid order placement
`tests/api/test_orders.py` verifies that:

- unauthenticated order creation returns 401
- authenticated order creation succeeds with a valid payload
- a valid order response includes `success` and `orderId`

### Insufficient stock rejection
The same suite verifies that oversized quantity requests result in a 409 Conflict when stock limits are violated.

This reflects the intended business rule of the application: customers cannot order more stock than is available.

---

## 3. Regression Notes

The current QA project focuses on reproducible, test-backed findings. The bug log should stay limited to issues that are:

- reproducible
- tied to a specific route or user flow
- validated by code or automated tests
- useful for regression tracking

This helps maintain a clean QA trail without cluttering the repo with vague or speculative issues.

---

## 4. Recommended Bug Log Discipline

For this repository, bug reports should follow this format:

- summary title
- severity / priority
- component or route
- reproduction steps
- expected vs actual behavior
- test or script reference
- current status

This keeps the bug log aligned with the QA project rather than broad enterprise template language.
