# NexusStream — Core Automation Test Matrix

This matrix provides a consolidated registry of all structural, business-rule, and integration-layer test specifications verified within the framework. It categorizes test coverage across API Core Contracts, UI User Journeys, and Direct Backend Data Tier Assertions.

---

## 🔐 1. Identity & Access Management (Authentication / Authorization)

| Test ID | Priority | Layer | Feature / Endpoint | Scenario Description | Expected Result |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **TC-SEC-001** | High | API | `POST /api/auth/register` | Register a new user utilizing unique, valid payload structures. | HTTP 200/201; User record initialized successfully. |
| **TC-SEC-002** | High | API | `POST /api/auth/register` | Reject registration attempts utilizing an identical, pre-existing email. | HTTP 400 Conflict; Secondary account blocked. |
| **TC-SEC-003** | High | API | `POST /api/auth/register` | Validate payload data format validation rules (malformed email / short password). | HTTP 400 Bad Request; Client input error returned. |
| **TC-SEC-004** | High | API | `POST /api/auth/login` | Authenticate an existing user using correct profile credentials. | HTTP 200 OK; Secure JWT auth token generated. |
| **TC-SEC-005** | High | API | `POST /api/auth/login` | Reject authorization requests providing invalid passwords or missing usernames. | HTTP 401 Unauthorized; Security access denied. |
| **TC-SEC-006** | High | API | `GET /api/user` | Enforce route authentication restrictions for profile details on guest users. | HTTP 401/403 Security block enforced. |
| **TC-SEC-007** | High | UI | `/login` -> `/shop` | Execute full UI registration, switch context, and follow-up with a login sequence. | Browser switches routes and successfully loads `/shop`. |
| **TC-SEC-008** | High | UI | `/checkout` -> `/login` | Attempt to load protected paths directly via browser routing without active storage sessions. | System intercepts request and redirects browser to `/login`. |

---

## 🛒 2. Catalog & System Configuration

| Test ID | Priority | Layer | Feature / Endpoint | Scenario Description | Expected Result |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **TC-CAT-001** | Medium | API | `GET /api/products` | Query total item catalog collection and validate structural contract payload properties. | HTTP 200 OK; Dict returned with expected `data` array schema. |
| **TC-CAT-002** | Medium | API | `GET /api/products?cat` | Query catalog applying explicit parameters (e.g. `category=Digital`). | Response payload isolates filtered category records exclusively. |
| **TC-CAT-003** | Low | API | `GET /api/health` | Call infrastructure diagnostic verification check endpoint. | HTTP 200 OK; Operational success and timestamp payload. |
| **TC-CAT-004** | Low | API | `GET /api/policy` | Query static metadata reference documents for platform usage patterns. | HTTP 200 OK; Valid operational system policy strings returned. |

---

## 💳 3. Transaction Operations (Orders & Checkout)

| Test ID | Priority | Layer | Feature / Endpoint | Scenario Description | Expected Result |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **TC-ORD-001** | Critical | API | `POST /api/orders` | Place a standard, well-formed item purchase request using a verified authorization token. | HTTP 200 OK; Tracking tracking payload generated with valid `orderId`. |
| **TC-ORD-002** | Critical | API | `POST /api/orders` | Enforce stock limits by submitting a product request matching excessive item quantities (e.g. 999). | HTTP 409 Conflict; Overstock operation blocked by backend. |
| **TC-ORD-003** | High | API | `POST /api/orders` | Intercept transaction operations completely if the authorization header is omitted. | HTTP 401/403 Security perimeter block enforced. |
| **TC-ORD-004** | Critical | UI | End-to-End Flow | Execute complete frontend journey: Land on Home -> Login -> Search -> Add to Cart -> Checkout. | System confirms placement and renders `order-success` marker. |
| **TC-ORD-005** | High | API | `POST /api/mock/payment` | Parametrize mock payment gateway conditions across multi-state parameters (`success`, `fail`, `timeout`). | Gateway codes match inputs correctly (`200`, `402`, `504`). |

---

## 🛡️ 4. Role-Based Access Control (RBAC) & Audit Integrity

| Test ID | Priority | Layer | Feature / Endpoint | Scenario Description | Expected Result |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **TC-OPS-001** | High | API | `GET /api/admin/logs` | Fetch configuration audit logs utilizing authenticated administrator credentials. | HTTP 200 OK; Administrative tracking record array is provided. |
| **TC-OPS-002** | High | API | `GET /api/admin/logs` | Assert access boundary rules when non-admin / default users invoke data endpoints. | **[BUG RETRIEVED]** Expected HTTP 403 Forbidden; system currently logs a 200 (*Marked XFAIL*). |
| **TC-OPS-003** | High | API | `GET /api/admin/logs` | Enforce perimeter security controls against completely unauthenticated guest queries. | HTTP 401 Unauthorized block enforced. |

---

## 🗄️ 5. Full-Stack Data Tier Persistence Assertions

| Test ID | Priority | Layer | Target Asset Table | Scenario Description | Expected Result |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **TC-DB-001** | High | Database | `users` | Perform query assertions on `users` table fields following a successful UI signup operation. | Database contains record matching identical signup metadata attributes. |
| **TC-DB-002** | Critical | Database | `orders` / `order_items` | Verify record state synchronization across transactional line items following full checkout actions. | Multi-table structural values match checkout properties cleanly. |
| **TC-DB-003** | Critical | Database | `products` | Capture item stock capacity records before and after order placement processes. | Inventory count reduces exactly by the purchased order quantity. |
| **TC-DB-004** | High | Database | `audit_logs` | Query operational diagnostic trails instantly following a finalized e-commerce checkout. | Database logs contextual tracing transaction elements with a success level. |
