# NexusStream QA Portfolio

This repository contains QA and quality engineering work for the NexusStream application. It is aligned to the real storefront and API that exist in the app under test, rather than a generic sample project.

## Project focus
The app under test is the `nexusstream-app` storefront and API project. The QA coverage reflects the behaviors that are actually implemented in the codebase:
- authentication and registration
- product catalog and search
- cart and checkout flow
- stock validation and order placement
- admin log access
- policy endpoint
- mock payment scenarios
- end-to-end browser automation with Playwright

## Portfolio structure

```text
nexusstream-qa/
├── docs/
│   ├── phase-0/
│   ├── phase-1/
│   ├── phase-2/
│   ├── phase-3/
│   └── phase-4/
├── tests/
│   ├── api/
│   ├── ui/
│   └── performance/
├── clients/
│   ├── __init__.py
│   └── api_client.py
├── schemas/
│   ├── __init__.py
│   └── api_schemas.py
├── fixtures/
│   └── __init__.py
├── sql/
│   └── order-verification.sql
├── pyproject.toml
├── .env.example
├── .gitignore
├── README.md
├── conftest.py
└── reports/
```

## Roadmap alignment

### Phase 0 — Environment setup
- local app setup and tooling readiness
- environment validation

### Phase 1 — Software QA fundamentals
- requirements and test case design
- smoke and regression planning
- defect reporting basics

### Phase 2 — API and database testing
- HTTP method and status code checks
- Postman-style API validation
- SQL verification for orders and inventory
- API and database defect documentation

### Phase 3 — Python and Pytest API automation
- HTTPX-based API requests
- reusable client and fixtures
- automated checks for health, auth, products, orders, and admin flows

### Phase 4 — Playwright and end-to-end testing
Weeks 9–12 focus on browser automation skills that matter for QA automation and SDET roles:
- locators and assertions
- waits and retry logic
- authentication flows and cookies
- form interactions and UI state validation
- screenshots, traces, and browser debugging
- automated registration, login, search, cart, checkout, and order confirmation
- maintainable end-to-end coverage with a clear test structure

## Phase 3 status
The API suite is intentionally small and app-aligned. It tests the routes that are actually implemented in the app without inventing unsupported requirements.

Run the API suite:

```bash
uv run pytest tests/api/ -q
```

## Phase 4 status
The browser suite covers the real user journey for the NexusStream storefront.

Install the browser engine once:

```bash
uv run python -m playwright install chromium
```

Run the Playwright UI tests:

```bash
uv run pytest tests/ui/ -q
```

Run the performance check:

```bash
uv run pytest tests/performance/ -q
```

## Notes
This portfolio is designed to show a realistic QA progression from manual validation into API automation and then browser automation, while keeping the scope tightly grounded in the actual application behavior.
