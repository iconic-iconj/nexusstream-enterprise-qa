# Bug Reports — NexusStream

## Defect Register

| Defect ID | Title | Severity | Priority | Status | Related requirements | Related test cases |
|---|---|---|---|---|---|---|
| DEF-001 | Regular user may access administrative logs | Critical | P0 | Confirmed / Open pending fix verification | REQ-13 | TC-006; TC-007 |
| DEF-002 | Unauthenticated order creation is allowed | Critical | P0 | Confirmed / Open pending fix verification | REQ-05; REQ-09; REQ-18 | TC-013 |
| DEF-003 | Malformed email is accepted during registration | High | P1 | Confirmed / Open pending fix verification | REQ-01; REQ-17 | TC-019; TC-001 |

Statuses reflect the supplied reproduction evidence. Update them after checking the current build. Do not mark a defect fixed until its regression test passes against the fix.

---

## DEF-001 — Regular User May Access Administrative Logs

**Status:** Confirmed; fix not verified  
**Severity:** Critical — privileged data exposure  
**Priority:** P0  
**Component:** API authorization  
**Endpoint:** `GET /api/admin/logs`  
**Related requirements:** REQ-13  
**Related test cases:** TC-006, TC-007  
**Evidence source:** Supplied failing/xfail test output; save a sanitized response capture under `docs/evidence/`.

### Description

A regular authenticated user was able to access the administrative log endpoint. The supplied source review indicated that authentication middleware was present but an explicit role check was not visible. The supplied execution evidence reportedly returned HTTP 200 for a regular-user token.

### Preconditions

- Application is running in an authorized local test environment.
- A regular user can register and log in.
- A valid regular-user token is available.
- The test database contains synthetic or otherwise safe audit data.

### Steps to Reproduce

1. Register or use a synthetic regular-user account.
2. Log in and obtain a bearer token.
3. Send `GET /api/admin/logs` with `Authorization: Bearer <regular-user-token>`.
4. Record the status and sanitized response body.
5. Verify whether administrative log data is disclosed.

### Expected Result

- HTTP `403 Forbidden`.
- No administrative log data is disclosed to the regular user.
- The authorization check is enforced server-side before privileged data is returned.

### Actual Result

The supplied evidence reports HTTP `200 OK` and disclosure of administrative logs to a standard user. Reconfirm on the current build before reporting the finding as current.

### Evidence

Supplied test reference:

```text
tests/api/test_admin_authorization.py::test_admin_logs_access_restrictions[user_api-403]
Reason recorded: /api/admin/logs lacks visible role check
```

Attach sanitized request/response evidence and the tested commit. Do not store the bearer token in the report.

### Resolution Criteria

- Add server-side role-based authorization to the administrative logs route.
- A regular-user token receives 403 and no privileged data.
- A genuinely provisioned administrator can access logs according to the contract.
- Unauthenticated access is rejected.
- Regression tests pass without an xfail override.
- Relevant API regression suite passes.

---

## DEF-002 — Unauthenticated Order Creation Is Allowed

**Status:** Confirmed; fix not verified  
**Severity:** Critical — unauthorized business transaction  
**Priority:** P0  
**Component:** Order creation and authentication  
**Endpoint:** `POST /api/orders`  
**Related requirements:** REQ-05, REQ-09, REQ-18  
**Related test case:** TC-013  
**Evidence source:** Supplied failing test output; save sanitized evidence under `docs/evidence/`.

### Description

The supplied execution indicates that an order could be created without an `Authorization` header or authenticated session. This allows an anonymous request to create a persistent business transaction.

### Preconditions

- Application is running in an authorized local test environment.
- A valid product exists.
- A dedicated test database is being used.
- A valid order payload can be constructed without any credentials.

### Steps to Reproduce

1. Record the relevant product stock and order count in the test database.
2. Construct a valid order payload using a real product ID from the test catalog.
3. Send `POST /api/orders` without a bearer token or authentication cookie.
4. Record the status and sanitized response.
5. Query the database to determine whether an order or order items were persisted and whether stock changed.

### Expected Result

- HTTP `401 Unauthorized` for an unauthenticated request, according to the expected contract.
- No order or order-item records are created.
- No inventory is deducted.

### Actual Result

The supplied test output reports HTTP `200 OK` and `{"success":true,"orderId":12}` for an unauthenticated request. The reported persisted state and stock impact should be captured in the evidence record.

### Evidence

Supplied test reference:

```text
tests/api/test_orders.py::test_create_order_requires_authentication
AssertionError: expected 401; received 200
Response: {"success":true,"orderId":12}
```

Confirm the exact response and database side effects on the current build. Do not reuse an order ID as a fixed test assumption.

### Resolution Criteria

- Enforce authentication middleware on `POST /api/orders`.
- Requests without valid credentials return 401 before order processing.
- Invalid credentials are rejected according to the middleware contract.
- No order, order-item, idempotency, or stock side effect occurs for rejected anonymous requests.
- TC-013 and related order regression tests pass.

---

## DEF-003 — Malformed Email Is Accepted During Registration

**Status:** Confirmed; fix not verified  
**Severity:** High — data quality and account-integrity risk  
**Priority:** P1  
**Component:** User registration  
**Endpoint:** `POST /api/auth/register`  
**Related requirements:** REQ-01, REQ-17  
**Related test cases:** TC-019, TC-001  
**Evidence source:** Supplied failing test output; save sanitized evidence under `docs/evidence/`.

### Description

The supplied execution indicates that structurally malformed email values were accepted by the registration endpoint and a user account was created. Examples included `not-an-email` and empty email values.

### Preconditions

- Application is running in an authorized local test environment.
- Registration endpoint is available.
- Use a disposable database or unique synthetic input to avoid polluting persistent test data.

### Steps to Reproduce

1. Prepare a registration payload with a malformed email such as `not-an-email`.
2. Submit the request to `POST /api/auth/register`.
3. Record status and sanitized response.
4. Query the database using safe fields only to determine whether an account was created.
5. Repeat with an empty email only if that case is included in the current test plan.

### Expected Result

- HTTP `400 Bad Request` or the documented validation response.
- A clear validation error is returned.
- No account is created for an invalid email value.

### Actual Result

The supplied test output reports HTTP `200 OK` and a response similar to `{"success":true,"message":"User created"}` for malformed input.

### Evidence

Supplied test reference:

```text
tests/api/test_auth.py::test_registration_rejects_invalid_emails
AssertionError: expected 400; received 200
Response: {"success":true,"message":"User created"}
```

Confirm the current behavior and preserve sanitized response evidence.

### Resolution Criteria

- Validate required registration fields on the server before inserting a user.
- Reject malformed email addresses according to a documented validation rule.
- Reject empty required fields.
- Do not rely only on browser-side validation.
- TC-019 fails before the fix and passes after the fix; valid registration remains successful.
- Verify no user row is created for rejected requests.

---

## Defect Reporting Rules

- Keep defect IDs stable.
- Record severity and priority separately.
- Link every defect to requirements, detailed test cases, and evidence.
- Use `Open`, `In Progress`, `Fixed — Pending Retest`, `Verified Fixed`, or `Closed` consistently.
- Do not use `Verified Fixed` until regression testing passes against the fix.
- A test that unexpectedly passes while marked xfail should be investigated; do not assume the defect is fixed without confirming the assertion and build.
