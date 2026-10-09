# NexusStream Phase 1 Test Scenarios

These scenarios are tailored to the actual NexusStream application in this portfolio project. They cover the real behaviors implemented by the app and align with the Phase 1 CSV, while also including the AI/LLM and CI/CD expectations that are relevant to the portfolio roadmap.

---

## 1. Authentication and Session

| Scenario ID | Scenario Name | Description |
| :--- | :--- | :--- |
| SC-AUTH-001 | Register with valid details | Verify a new user can register with a valid name, email, and password. |
| SC-AUTH-002 | Reject duplicate registration | Verify the system prevents creating an account with an email already in use. |
| SC-AUTH-003 | Reject invalid email | Verify invalid email formats are rejected. |
| SC-AUTH-004 | Reject short password | Verify password validation blocks weak credentials. |
| SC-AUTH-005 | Login with valid credentials | Verify a registered user can log in successfully. |
| SC-AUTH-006 | Reject invalid credentials | Verify incorrect login details do not create a session. |
| SC-AUTH-007 | Redirect unauthenticated user from protected pages | Verify direct navigation to /checkout or /admin redirects to /login. |
| SC-AUTH-008 | Logout clears auth state | Verify a logged-in user can log out and loses access to protected pages. |

---

## 2. Catalog and Search

| Scenario ID | Scenario Name | Description |
| :--- | :--- | :--- |
| SC-PROD-001 | Display catalog | Verify the shop page shows the available products with names, prices, stock, and categories. |
| SC-PROD-002 | Search by exact product name | Verify the search field filters results by exact or matching product names. |
| SC-PROD-003 | Search by partial name | Verify partial text returns relevant results. |
| SC-PROD-004 | No-match search | Verify a search with no matches shows an empty-state result. |
| SC-PROD-005 | Category filtering | Verify category buttons filter the visible product list correctly. |

---

## 3. Cart and Checkout

| Scenario ID | Scenario Name | Description |
| :--- | :--- | :--- |
| SC-CART-001 | Add product to cart | Verify users can add a product from the shop to the cart. |
| SC-CART-002 | Add multiple products | Verify multiple items can be added and counted in the cart. |
| SC-CART-003 | Increase quantity and prevent stock overflow | Verify quantity logic respects product stock limits. |
| SC-CART-004 | Remove product and recalculate total | Verify item removal updates the cart and total. |
| SC-CHECK-001 | Proceed through checkout steps | Verify the checkout wizard moves from cart review to shipping and payment. |
| SC-CHECK-002 | Require shipping address | Verify the system blocks payment until the shipping address is entered. |
| SC-CHECK-003 | Complete valid checkout | Verify a valid checkout creates a successful order. |
| SC-CHECK-004 | Reject incomplete payment details | Verify card data validation blocks incomplete payment submission. |
| SC-CHECK-005 | Handle failed payment scenario | Verify failed payment attempts do not show success and do not create a completed order. |
| SC-CHECK-006 | Prevent insufficient stock checkout | Verify order creation is blocked when the requested quantity exceeds stock. |

---

## 4. Orders and Admin

| Scenario ID | Scenario Name | Description |
| :--- | :--- | :--- |
| SC-ORDER-001 | Successful order persists | Verify a valid order is stored with correct customer, items, total, and status. |
| SC-ORDER-002 | Idempotent order creation | Verify duplicate checkout requests using the same idempotency key do not create duplicate orders. |
| SC-ADMIN-001 | View admin logs | Verify an authenticated user can access the admin portal and see system logs. |
| SC-ADMIN-002 | Block unauthenticated admin access | Verify public access to the admin page is denied. |

---

## 5. API and Data Validation

| Scenario ID | Scenario Name | Description |
| :--- | :--- | :--- |
| SC-API-001 | Products API returns catalog | Verify GET /api/products returns product data. |
| SC-API-002 | Category API filter works | Verify GET /api/products?category=Hardware returns the expected subset. |
| SC-API-003 | Register API rejects invalid payloads | Verify the registration endpoint validates input errors correctly. |
| SC-API-004 | Login API rejects invalid credentials | Verify the login endpoint returns 401 for bad credentials. |
| SC-API-005 | Order API creates valid orders | Verify POST /api/orders creates an order for valid authenticated requests. |
| SC-API-006 | Order API rejects bad input | Verify invalid order payloads are rejected. |
| SC-API-007 | Order API rejects insufficient stock | Verify order creation fails when stock is not sufficient. |
| SC-API-008 | Health and policy endpoints work | Verify /api/health and /api/policy return success responses. |
| SC-API-009 | Authenticated user endpoint works | Verify /api/user returns user details for a valid session. |

---

## 6. AI Quality and LLM Evaluation

| Scenario ID | Scenario Name | Description |
| :--- | :--- | :--- |
| SC-AI-001 | Nexus Agent answers with grounded policy support | Verify the Nexus Agent responds using the active policy context rather than unsupported assumptions. |
| SC-AI-002 | Nexus Agent refuses out-of-scope requests | Verify the agent declines questions outside NexusStream technical support. |
| SC-AI-003 | Nexus Agent resists prompt injection | Verify malicious instruction attempts do not override policy boundaries. |
| SC-AI-004 | Relevance and readability of agent responses | Verify the answer is useful, clear, and understandable. |
| SC-AI-005 | RAG grounding for policy queries | Verify policy-related answers stay grounded in the configured policy text. |
| SC-AI-006 | Hallucination control on unsupported facts | Verify unsupported facts are not invented. |

---

## 7. CI/CD and Automation Evidence

| Scenario ID | Scenario Name | Description |
| :--- | :--- | :--- |
| SC-CI-001 | CI workflow runs successfully | Verify the repository workflow executes and can complete on a pull request or branch. |
| SC-CI-002 | CI failures surface evidence | Verify failed automation jobs log clear actionable error output. |
| SC-CI-003 | Setup is reproducible | Verify the automation environment can be re-created from the project configuration. |

---

## 8. Scope note

These scenarios reflect the actual functionality in the NexusStream app. Anything outside the app’s real features, such as unrelated enterprise modules or unimplemented workflows, is intentionally excluded from the QA scope. AI and CI/CD checks are included because they are part of the portfolio roadmap and fit the app’s existing AI assistant and automation goals.
