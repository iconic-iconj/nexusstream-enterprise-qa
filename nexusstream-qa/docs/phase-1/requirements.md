# NexusStream Phase 1 Requirements

## 1. Purpose
This document defines the functional requirements for Phase 1 testing of the NexusStream application used in the QA portfolio project.

The testing focus is limited to the actual features built into the app:
- authentication and session handling
- product catalog display and filtering
- shopping cart behavior
- checkout flow
- stock validation
- order creation
- admin log access
- API responses used by the app

---

## 2. Authentication Requirements

### REQ-AUTH-001 — Registration
The system shall allow a new user to register with a valid name, email, and password.

The system shall:
- require a name, email, and password
- validate email format
- require a password of at least 6 characters
- reject duplicate email registration
- return appropriate success or validation/business errors

### REQ-AUTH-002 — Login
The system shall allow registered users to log in with valid credentials.

The system shall:
- accept valid email and password combinations
- reject invalid credentials
- reject unknown users
- return a clear error for failed authentication
- redirect authenticated users to the application area after success

### REQ-AUTH-003 — Protected Routes and Session
The system shall restrict access to authenticated-only pages.

The system shall:
- redirect unauthenticated users away from `/checkout` and `/admin`
- maintain the session during normal usage
- clear the session on logout
- reject access to protected content after logout

---

## 3. Product Catalog Requirements

### REQ-PROD-001 — Catalog Display
The system shall display the available products in the shop page.

The system shall:
- show each product name, price, category, image, and stock value
- show a product list on page load
- render the correct data from the backend API

### REQ-PROD-002 — Search and Filter
The system shall allow users to search and filter the catalog.

The system shall:
- support search by product name or text match
- support empty search handling
- support no-result states
- support category-based filtering such as Hardware and Digital

---

## 4. Cart Requirements

### REQ-CART-001 — Add and Count Items
The system shall allow users to add products to the cart.

The system shall:
- add available products
- count items correctly
- prevent adding more than the available stock

### REQ-CART-002 — Quantity and Removal
The system shall manage cart quantities correctly.

The system shall:
- increase the quantity when the same product is added repeatedly
- remove items from the cart
- update totals after removal or quantity change

---

## 5. Checkout Requirements

### REQ-CHECK-001 — Checkout Flow
The system shall require a valid cart and customer information before checkout completion.

The system shall:
- block empty-cart checkout
- require a shipping address before payment
- validate card information before confirming the transaction

### REQ-CHECK-002 — Order Creation
Successful checkout shall create an order with the correct user, products, quantities, and total.

### REQ-CHECK-003 — Stock Validation
The system shall reject orders when the requested quantity exceeds stock.

### REQ-CHECK-004 — Payment Handling
The system shall handle successful and unsuccessful payment outcomes.

The system shall:
- confirm success only when the checkout completes correctly
- fail gracefully when payment is rejected or times out
- avoid creating a false success state on failed payment

---

## 6. Admin and Audit Requirements

### REQ-ADMIN-001 — Logged Event Visibility
The system shall present audit log records in the admin portal.

### REQ-ADMIN-002 — Access Control
The system shall restrict admin access to authenticated users and redirect unauthenticated users to login.

---

## 7. API Requirements

### REQ-API-001 — Products API
The system shall return product data through `/api/products` and support filtering by category.

### REQ-API-002 — Auth API
The system shall validate authentication requests at `/api/auth/register` and `/api/auth/login`.

### REQ-API-003 — Order API
The system shall reject invalid order payloads and insufficient-stock requests and create valid orders for authenticated users.

### REQ-API-004 — Utility Endpoints
The system shall provide health and policy responses for `/api/health` and `/api/policy`.

### REQ-API-005 — User Endpoint
The system shall return the authenticated user's basic identity information for valid session requests.

---

## 8. Scope of Phase 1

Phase 1 testing is limited to the actual NexusStream app behaviors implemented in this repository. Features outside the app’s real codebase are intentionally excluded from this phase.