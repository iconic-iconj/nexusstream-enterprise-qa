# NexusStream QA — Unified Automation Architecture

This document describes the real architecture of the `nexusstream-qa` project itself: the testing framework, fixture design, page object model, validation patterns, and execution strategy used to validate the NexusStream application.

The focus here is the QA layer, not the application codebase. The QA project is designed to test the actual user flows, API behavior, and database state of the system under test.

---

## 1. Project Goal and Scope

`nexusstream-qa` is a Python-based quality engineering project built around pytest and Playwright. It is organized to validate:

- authentication and authorization
- product catalog behavior
- cart and checkout flows
- order creation and persistence
- database integrity checks
- admin access rules
- policy endpoint validation
- browser-based regression scenarios
- basic load/performance checks

The project is intentionally structured around real behaviors in the application, rather than abstract demo-only flows.

---

## 2. Unified Architecture Overview

The testing architecture is layered in a way that keeps responsibilities separated while preserving clear traceability between test logic and system behavior.

```text
[nexusstream-qa]
    |
    |-- conftest.py
    |      └── shared pytest fixtures for base_url, page, API access, user/admin auth
    |
    |-- pages/
    |      ├── base_page.py             -> shared page navigation + locator abstraction
    |      ├── home_page.py             -> home/landing interactions
    |      ├── auth_page.py            -> login/register flows
    |      ├── store_page.py           -> product navigation and cart actions
    |      └── checkout_page.py        -> checkout and verification steps
    |
    |-- schemas/
    |      └── api_schemas.py          -> centralized API response validation rules
    |
    |-- tests/
    |      ├── api/                    -> endpoint-level validation
    |      ├── ui/                     -> browser interaction tests
    |      ├── e2e/                    -> transaction and persistence checks across app layers
    |      └── performance/            -> load and throughput validation (via k6)
    |
    |-- test-data/
    |      └── product/user fixtures
    |
    |-- sql/
    |      └── verification queries for DB checks
    |
    |-- reports/
    |      └── pytest-generated HTML report
    |
    └-- pyproject.toml
          └── pytest config and project dependencies
```

This is the unified architecture of the QA project: shared fixtures, POM pages, schema validation, layered test suites, and database verification.

---

## 3. Core Design Principles

### 3.1 Shared Fixture-Driven Test Setup
The project centralizes test lifecycle setup in `conftest.py`.

This helps avoid repeated initialization logic in each test and creates a consistent test environment.

Key fixtures include:

- `base_url`
- `api` for request-based checks
- `page` for browser automation
- `home_page`, `auth_page`, `store_page`, `checkout_page`
- user/admin auth header fixtures for authenticated scenarios

This ensures the same test strategy is reused across API and UI tests.

### 3.2 Page Object Model for UI Stability
The `pages/` folder contains page-specific abstractions instead of raw selectors inside test cases.

Examples:

- `HomePage` handles landing page behavior
- `AuthPage` encapsulates register/login logic
- `StorePage` handles search, product listing, and add-to-cart actions
- `CheckoutPage` handles shipping, payment, and confirmation assertions

This makes UI tests easier to maintain and reduces duplicate selector logic across many files.

### 3.3 Locator Unification for Real App Markup
The project intentionally handles mixed DOM patterns by normalizing selectors in `BasePage`.

```python
return self.page.locator('[data-testid="name"], [data-test="name"]')
```

This is a practical pattern because the app uses both `data-testid` and `data-test` attributes. The QA layer compensates for inconsistent markup without scattering fragile selector logic throughout the tests.

### 3.4 Centralized API Contract Validation
The `schemas/api_schemas.py` file provides reusable response validation functions instead of repeating inline structural assertions in many tests.

This keeps the tests cleaner and makes API contract checks maintainable.

Examples include:

- `is_success_response()`
- `is_user_response()`
- `is_product_list_response()`

This follows a contract-first validation approach where the response shape is checked centrally.

---

## 4. Test Suite Structure

### 4.1 API Tests (`tests/api/`)
These checks validate direct HTTP behavior against the application.

Typical validation areas:

- auth and registration flows
- profile retrieval
- products retrieval
- admin authorization
- order creation logic
- business rule failures such as insufficient stock
- mock payment behavior
- policy endpoint checks
- load/performance endpoint checks

The API tests are designed to confirm status codes, response structure, and business outcomes.

### 4.2 UI Tests (`tests/ui/`)
These tests exercise browser behavior using Playwright and page objects.

Examples:

- home page navigation
- login/register steps
- search and product discovery
- add-to-cart actions
- final checkout flow

UI tests validate real user journeys, not isolated helper functions.

### 4.3 End-to-End Validation (`tests/e2e/`)
The e2e layer tests cross-boundary behavior beyond the UI alone. It validates whether the frontend actions produce actual persisted backend state.

These tests check that after a user completes a flow:

- an order was created
- order items were recorded
- totals are populated
- stock values change as expected
- data reflects real DB state

This is an important part of the QA architecture because it enforces data integrity, not just UI success.

### 4.4 Performance Validation (`performance/`)
The project includes a k6 load script to test throughput and system stability under simulated load.

This keeps performance testing separate from functional validation while still being part of the same QA project.

---

## 5. Unified Test Execution Model

The framework executes in a practical and reusable lifecycle:

```text
Test starts
   ↓
Fixture bootstraps environment and page/API context
   ↓
Page object or API helper performs action
   ↓
Assertions validate state, response, or database result
   ↓
Report is generated via pytest HTML output
```

This model is intentionally simple but strong:

- API tests validate contracts
- UI tests validate user journeys
- E2E tests validate persistence and business state
- Performance tests evaluate system behavior under load

---

## 6. Shared Project Components

### 6.1 `conftest.py`
This is the heart of the QA framework.

It centralizes:

- environment variables
- base URL setup
- browser launch lifecycle
- per-test page context creation
- reusable user/admin auth helpers

This is the main foundational architecture pattern of the project.

### 6.2 `pages/base_page.py`
This is the base abstraction used by all page objects.

It provides common behaviors such as:

- page opening
- navigation waits
- shared locator matching for `data-test` and `data-testid`

This reduces duplication and ensures the framework remains resilient to simple frontend markup changes.

### 6.3 `schemas/api_schemas.py`
This module enforces a common contract-layer approach.

Rather than each test manually checking payload structure, the schema helpers validate expected response shape in a consistent way.

### 6.4 `test-data/` and `sql/`
The project keeps real test inputs and verification queries separate from test logic.

This helps with traceability and makes it easier to validate actual persisted state.

---

## 7. Why This Architecture Works

This QA project is effective because it balances structure and realism:

- fixtures reduce repetitive setup
- page objects keep browser automation readable
- schemas centralize response validation
- e2e tests verify actual state changes
- the project is aligned to real business flows, not synthetic examples

The architecture is intentionally simple, maintainable, and focused on test confidence.

---

## 8. Practical Summary

The `nexusstream-qa` project is a unified QA architecture built around:

- pytest as the execution engine
- Playwright for browser automation
- page objects for stable UI interactions
- shared fixtures for environment and auth state
- schema-driven API validation
- database checks for end-to-end integrity
- a layered test suite covering API, UI, e2e, and performance

This is the actual engineering structure of the QA repository and represents a strong, portfolio-ready test architecture.
