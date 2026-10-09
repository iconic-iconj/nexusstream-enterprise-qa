# NexusStream Test Plan

## 1. Project and portfolio context

This project is the main application under test in the NexusStream QA portfolio. The goal is to show a realistic progression from manual QA into automation, API verification, and later AI quality engineering.

The application under test is a small e-commerce and digital-products storefront with:
- login and registration
- protected pages
- catalog display and search/filter
- cart management
- checkout flow
- stock validation
- order creation
- admin audit log access
- policy endpoint
- AI assistant called "Nexus Agent"

This plan is aligned to the job-focused roadmap and to the features that actually exist in the codebase.

---

## 2. Job-focused roadmap

### Phase 0 — Environment setup
- Install Python, uv, Git, VS Code, Pytest, Postman, PostgreSQL, and Node.js.
- Configure the repository and local app environment.
- Deliverable: working environment and repository.

### Phase 1 — Software QA fundamentals
- Learn SDLC/STLC, functional testing, smoke testing, regression testing, exploratory testing, negative testing, boundary values, test case design, severity vs priority, and defect reporting.
- Document defects in GitHub Issues or Jira.
- Deliverable: test plan, a meaningful set of Phase 1 test cases, bug reports, and risk assessment.

### Phase 2 — API and database testing
- Learn REST, HTTP methods, JSON, cookies, auth, headers, SQL basics, joins, aggregates, and transactions.
- Use PostgreSQL and SQL queries to validate recorded data.
- Deliverable: Postman collection, SQL checks, and API/database defect evidence.

### Phase 3 — Python and Pytest automation
- Automate key API scenarios with Python and Pytest.
- Deliverable: reusable API automation suite.

### Phase 4 — Playwright and end-to-end testing
- Automate registration, login, search, cart, checkout, and protected routes.
- Deliverable: maintainable UI automation suite.

### Phase 5 — Reliable automation and CI/CD
- Add reusable fixtures, test isolation, GitHub Actions, and failure reporting.
- Deliverable: CI pipeline and automation evidence.

### Phase 6 — AI quality engineering
- Evaluate the Nexus Agent for policy grounding, prompt-injection resistance, safe refusals, answer quality, and structured output behavior.
- Deliverable: AI quality evaluation suite and repeatable evidence.

---

## 3. Scope

### In scope
- Authentication and session handling
- Product catalog display and filtering
- Search within the catalog
- Cart logic and quantity enforcement
- Checkout flow and payment validation
- Order creation and stock validation
- Admin audit log access
- API validation for implemented endpoints
- AI assistant behavior and policy adherence
- CI/CD readiness and evidence collection for automation runs

### Out of scope
- Unsupported business workflows not implemented in the app
- Unrelated enterprise features not present in the repository
- Large production-grade systems that are not represented in the codebase
- Deep production-scale AI system architecture beyond this portfolio app

---

## 4. Application-under-test summary

The app includes a basic but realistic workflow suitable for QA and automation work:

- `/` landing page
- `/shop` product catalog
- `/login` auth flow
- `/checkout` protected checkout wizard
- `/admin` protected admin portal
- backend API for auth, products, orders, health, policy, and logs
- SQLite default data store with PostgreSQL support via Docker
- a simple policy-based AI assistant that uses a policy endpoint and Gemini API

This means the Phase 1 and later testing work should focus on app behaviors that are actually implemented.

---

## 5. Test objectives

This project aims to validate whether:
- core user journeys work correctly
- business rules are enforced
- invalid input is handled safely
- authentication and authorization work correctly
- stock and totals remain consistent
- checkout creates valid orders
- admin-only content remains protected
- AI responses are grounded in policy and reject unsafe requests
- automation is runnable in a CI environment with evidence

---

## 6. Test types

The test effort will include:
- Functional testing
- Positive testing
- Negative testing
- Boundary testing
- Smoke testing
- Regression testing
- Exploratory testing
- API validation
- Database verification
- Authorization testing
- AI evaluation testing
- CI validation testing

---

## 7. Risk-based execution

Priority will be based on business impact and likelihood of failure.

Highest priority areas:
- authentication and access control
- checkout and order creation
- stock validation
- admin access controls
- API correctness
- AI policy grounding and prompt-injection protection
- PR-based CI execution and failure visibility

---

## 8. Deliverables

By the end of the portfolio progression, the project should produce:
- environment setup notes
- requirements document
- test plan
- test scenarios
- test case CSV
- defect reports
- SQL validation queries
- API automation suite
- UI automation suite
- CI workflow and evidence
- AI evaluation set and results

---

## 9. Entry and exit criteria

### Entry criteria
- app is running locally
- required environment variables are configured
- database or SQLite state is available
- project repository is ready for test execution

### Exit criteria
- critical app flows are validated
- high-priority defects are logged with evidence
- key automation and evaluation work is documented
- the project is ready for the next phase of portfolio work

---

## 10. Traceability

Each requirement should map to meaningful test cases in this project.

Example mapping:

```text
REQ-AUTH-001 -> TC-P1-001, TC-P1-002, TC-P1-003, TC-P1-004
REQ-CHECK-002 -> TC-P1-025, TC-P1-029, TC-P1-037
REQ-AI-001 -> TC-AI-001, TC-AI-002, TC-AI-003
REQ-CI-001 -> TC-CI-001, TC-CI-002
```