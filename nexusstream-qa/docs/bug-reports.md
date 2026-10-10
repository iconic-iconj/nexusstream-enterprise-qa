# NexusStream QA — Bug Report Log

This document tracks known defects and relevant test findings in the NexusStream application. Each entry should be based on observed application behavior or evidence from the automated test suite.

The goal is to document issues clearly, explain their impact, and make them easy to reproduce and retest.

## 1. Known Defect: Regular Users Can Access Admin Logs

**Severity:** High  
**Priority:** High  
**Status:** Open — marked as an expected failure in the QA suite  
**Component:** API authorization / Admin routes  
**Endpoint:** `GET /api/admin/logs`  
**Test reference:** `tests/api/test_admin.py`

### Description

The current test identifies an authorization issue in the admin logs endpoint. A regular authenticated user is expected to be denied access, but the test is designed to detect a response that incorrectly allows the request.

If the observed HTTP 200 response contains admin log data, this indicates that the endpoint may not be enforcing the required role-based access control.

### Steps to reproduce

1. Register or use an existing regular user account.
2. Authenticate as that user and obtain the user's authentication token.
3. Send a `GET` request to `/api/admin/logs` using the regular user's credentials.
4. Check the HTTP status code and response body.

### Expected result

The API should reject the request with **HTTP 403 Forbidden** because the authenticated user does not have administrator privileges.

### Actual result

The reported behavior is that the endpoint returns **HTTP 200 OK** and exposes admin log data to a regular user.

This behavior should be confirmed against the current application before the issue is treated as a verified, still-open defect.

### Security impact

If confirmed, this is a broken access-control issue. Users without administrator privileges may be able to view information intended for administrators.

The severity depends partly on the contents of the logs and whether they contain sensitive information.

### Automated test evidence

The following test is marked as an expected failure while the defect remains unresolved:

```python
@pytest.mark.xfail(
    reason="BUG: Regular users can illegally access admin logs"
)
def test_admin_logs_deny_regular_user(api, user_headers):
    response = api.get(
        "/api/admin/logs",
        headers=user_headers,
    )
    assert response.status_code == 403
```

**Current handling:** The `xfail` marker records the known problem without treating the expected assertion failure as an ordinary test failure. If the test unexpectedly passes, Pytest may report it as an XPASS; whether that fails the suite depends on the marker configuration.

**Recommended fix:** Enforce administrator-role authorization on the endpoint, then rerun the test with a regular user's credentials. Also verify that an administrator can access the endpoint and that unauthenticated requests are rejected.

**Resolution criteria:** The regular-user request returns HTTP 403, the administrator access test passes, and the regression tests confirm that the authorization rule remains enforced.

## 2. Order Creation and Stock Validation

**Test reference:** `tests/api/test_orders.py`  
**Component:** Orders API / Inventory validation

The order tests cover important rules around authentication, order creation, and available stock.

### Valid order placement

The test suite checks that:

- An unauthenticated request to create an order is rejected with HTTP 401 Unauthorized.
- An authenticated user can create an order using a valid request payload.
- A successful order response includes the expected `success` and `orderId` fields.

### Insufficient stock

The suite also checks that an order requesting more stock than is available is rejected with HTTP 409 Conflict.

This is intended to prevent customers from ordering quantities that exceed available inventory.

These entries describe the checks in the test suite. They should not be interpreted as proof that every scenario currently passes; the latest test results should be checked before reporting their status.

## 3. Regression Tracking

Bug reports should remain focused on issues that can be investigated and retested.

For each finding, record:

- What happened and where it occurred.
- The steps needed to reproduce it.
- The expected and actual results.
- The relevant automated test or other evidence.
- The impact on users, data, security, or business behavior.
- The current status and the criteria for closing the issue.

When a defect is fixed, retain the original finding and update its status rather than removing the record. The associated regression test should remain in the suite to help prevent the issue from returning.

## 4. Bug Report Format

New findings in this project should use a consistent, straightforward format:

| Field | What to record |
|---|---|
| Title | A short description of the defect |
| Severity | The impact if the defect is confirmed |
| Priority | How urgently it should be addressed |
| Status | Open, In Progress, Fixed, or Closed |
| Component | The affected feature or API route |
| Reproduction steps | Instructions for reproducing the issue |
| Expected result | What the application should do |
| Actual result | What the application did |
| Evidence | Test reference, response, screenshot, or log |
| Resolution criteria | What must be verified before closure |

The aim is to maintain a useful record of real findings, backed by evidence and connected to regression testing, without reporting unverified behavior as fact.