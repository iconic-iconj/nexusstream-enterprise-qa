# NexusStream — Enterprise Defect Registry & Engineering Triage Log

This log serves as the single source of truth for validated, reproducible defects uncovered across the NexusStream application layers during automated and manual testing regressions. 

---

## 🛑 Active System Vulnerabilities (Triage: Open)

### BUG-SEC-001 — Broken Object Level Authorization (BOLA) on Administrative Logs
*   **Module:** Role-Based Access Control (RBAC) / API Security
*   **Severity:** Critical
*   **Priority:** Critical
*   **Status:** Open (Tracked via automated `@pytest.mark.xfail`)
*   **Traceability:** `TC-OPS-002`

#### Preconditions
1. Target test account exists in the database.
2. The user has valid, authenticated session headers **but does not possess administrative privileges** (Standard Customer Account).

#### Test Data
```json
{
  "name": "User User",
  "email": "user.90b75005@example.com",
  "role": "customer"
}
```

#### Steps to Reproduce
1. Authenticate against the system using standard, non-admin customer credentials to retrieve a standard bearer token.
2. Construct a `GET` request targeting the administrative logging backend route: `/api/admin/logs`.
3. Inject the standard customer authorization headers into the request package.
4. Dispatch the payload and evaluate the returned status boundaries.

#### Expected Result
The security perimeter must intercept the unprivileged token, reject data extraction, and return an **HTTP 403 Forbidden** status code to safeguard administrative data layers.

#### Actual Result
The API accepts the standard user token without evaluating the structural authorization context, returning an **HTTP 200 OK** code and leaking the full array of administrative system logs.

#### Automated Assertion Evidence
```text
tests\api\test_admin.py:48: AssertionError
    def test_admin_logs_deny_regular_user(api, user_headers):
>       assert response.status_code == 403
E       AssertionError: Expected 403 Forbidden for regular user, got 200
E       assert 200 == 403
E        +  where 200 = <Response [200 OK]>.status_code
```

---

### BUG-DATA-002 — Failure of Inventory Count Synchronization During Checkout Flow
*   **Module:** Checkout Operations / Database Transaction Layer
*   **Severity:** High
*   **Priority:** High
*   **Status:** Open
*   **Traceability:** `TC-DB-003`

#### Preconditions
1. Target catalog asset item exists in the system database with an established, traceable stock inventory quantity.
2. A user profile is authorized and holds active checkout permissions.

#### Test Data
```text
Product ID: 1 (Quantum Blade X1)
Initial Database Stock Level: 10
Purchased Line Quantity: 1
```

#### Steps to Reproduce
1. Establish a database connection and poll the initial inventory level for Product ID `1`.
2. Access the frontend interface or backend endpoint to execute a successful order for 1 unit of Product ID `1`.
3. Wait for the transaction confirmation sequence to resolve cleanly (`HTTP 200 OK` / `order-success`).
4. Re-query the relational database tables to check the final stock level of Product ID `1`.

#### Expected Result
The system database transaction must decrease the product inventory count atomically by the identical amount of units purchased (Stock should reduce from `10` down to `9`).

#### Actual Result
The application processes the transactional credit loop and updates the order status in the UI, but the direct product inventory stock level remains completely unchanged at `10`, violating transaction lifecycle guidelines.

#### Backend Query Tracking Evidence
```sql
-- Query executed immediately following successful order placement:
SELECT stock FROM products WHERE id = 1;
-- Output Result: 10 (Expected: 9)
```

---

### BUG-UI-003 — Race Condition / Missing Idempotency on Fast Checkout Operations
*   **Module:** Frontend Checkout Components / Client Actions
*   **Severity:** High
*   **Priority:** Medium
*   **Status:** Open
*   **Traceability:** `TC-ORD-004`

#### Preconditions
1. User profile is authenticated with an active browser context.
2. Target storefront shopping cart contains at least 1 valid stock item.

#### Steps to Reproduce
1. Navigate directly to the `/checkout` view page layout.
2. Populated all mandatory shipping text boxes and billing parameters with clean data.
3. Locate the final `checkout-complete` element submit button.
4. Perform a rapid double-click action sequence directly on the submission target button.
5. Access the backend profile page or run database validations to inspect the generated receipt structure.

#### Expected Result
The application frontend should freeze inputs on the initial click state or utilize backend payment parameters to guarantee transaction idempotency, producing exactly one order and one charge invoice.

#### Actual Result
The client UI allows multiple rapid submissions, generating two completely identical order blocks inside the storage system and forcing the database tracking layer to log duplicate records.

#### Network Inspection Logs
```text
--> POST /api/orders (Timestamp: 14:32:01.102) -> Response: 200 OK (Order ID: 1045)
--> POST /api/orders (Timestamp: 14:32:01.240) -> Response: 200 OK (Order ID: 1046)
```
