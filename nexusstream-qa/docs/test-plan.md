# Test Plan — NexusStream

## 1. Document Information

| Field | Value |
|---|---|
| Project | NexusStream |
| Application | React storefront and Express API |
| Database | SQLite or PostgreSQL, according to the active configuration |
| Test owner | QA Engineer |
| Test status | Active test baseline; see the execution report for actual results |
| Source of truth for detailed cases | `test-cases.csv` |
| Source of truth for requirements | `requirements-traceability.csv` |
| Defect register | `bug-reports.md` |

## 2. Purpose

Define a repeatable, risk-based approach for verifying NexusStream's customer journeys, API behavior, authorization controls, order processing, inventory integrity, and supported AI functionality.

This plan describes the intended testing approach. It does not claim that every planned test has been executed or that the application is ready for release.

## 3. Objectives

- Verify registration, login, catalog browsing, cart, checkout, and order behavior.
- Check authentication and server-side role-based authorization.
- Verify that API actions and persisted database state agree.
- Detect incorrect input validation, order totals, inventory changes, and repeated-submission behavior.
- Record reproducible defects with evidence and traceability.
- Maintain regression coverage for confirmed defects after fixes.
- Evaluate AI behavior only when a testable AI feature and its expected contract are available.

## 4. Application Under Test

NexusStream is an e-commerce application with a React/Vite frontend, an Express backend, and a persistent database. The known API surface includes authentication, user profile, products, orders, mock payments, health, policy, and administrative logs.

The exact active URLs, database engine, schema, response contracts, and available features must be verified against the current checkout and environment before execution.

## 5. Scope

### In scope

- User registration, duplicate registration, login, invalid credentials, and session behavior.
- Protected profile and order endpoints.
- Product catalog response structure and product fields.
- Cart behavior and price/quantity calculations where implemented.
- Order creation, stock limits, inventory updates, persistence, and idempotency where supported.
- Mock payment success, failure, and timeout behavior where implemented.
- Administrative log access for unauthenticated users, regular users, and administrators.
- Health endpoint and relevant error responses.
- SQL checks for order, order-item, stock, and idempotency consistency.
- UI navigation, registration validation, product search, cart, and checkout where implemented.
- AI correctness, grounding, prompt-injection resistance, data protection, and tool authorization only when an AI feature is available and its contract is defined.

### Out of scope unless separately approved

- Production penetration testing or testing against systems without authorization.
- Full-scale load and performance testing.
- Payment-provider certification or real payment processing.
- Comprehensive browser/device compatibility testing.
- AI model benchmarking where no AI model or endpoint is available.

## 6. Test Approach

1. Confirm the running application, active API base URL, database engine/path, and test data.
2. Verify service health and basic catalog behavior.
3. Execute authentication and authorization checks.
4. Execute order and inventory scenarios using controlled stock baselines.
5. Compare API results with persisted database state where relevant.
6. Run UI checks for implemented user journeys.
7. Record actual outcomes, evidence, and defects.
8. Retest fixes and run related regression tests.
9. Report untested critical scenarios and residual risks explicitly.

Use manual testing to clarify behavior when necessary. Use Postman for exploratory/manual API checks, HTTPX/Pytest for repeatable API regression, Playwright for browser journeys, and read-only SQL queries for persistence verification.

## 7. Test Levels and Types

- **Functional:** registration, login, catalog, cart, checkout, orders, and administration.
- **Negative:** malformed input, invalid credentials, missing authentication, invalid quantities, and payment failures.
- **Boundary:** stock limit, quantity limit, and documented password/input constraints.
- **Security:** authentication enforcement, role-based authorization, and unauthorized data exposure.
- **Integration:** API responses reconciled with database state.
- **Regression:** tests that prevent confirmed defects from returning.
- **Exploratory:** investigation of unclear or unexpected behavior.
- **AI quality:** conditional tests against a defined AI feature and evaluation contract.

## 8. Environment and Configuration

Record actual values for every execution. The URLs below are examples from the project notes and must not be assumed to be simultaneously active.

| Item | Value to record |
|---|---|
| Frontend URL | Actual running URL; for example, `http://localhost:5173` |
| API base URL | Actual running URL; confirm port and proxy configuration |
| CI application URL | Actual CI URL; `http://localhost:3000` may be used in the existing setup |
| Health endpoint | `GET /api/health`, if available |
| Database engine | SQLite or PostgreSQL |
| Database path/name | Actual test database, never an assumed production database |
| Git commit/build | Exact commit SHA or build identifier |
| Python version | Actual test-runner version |
| Node version | Actual application runtime version |
| Test tools | Postman, HTTPX, Pytest, Playwright, SQL client, GitHub Actions as applicable |

## 9. Test Data and Isolation

- Use synthetic accounts and unique emails for registration tests.
- Use separate regular-user and administrator identities.
- Do not assume that registering a normal user creates an administrator.
- Use a dedicated local/test database and record how it is seeded or reset.
- Capture product ID, unit price, and initial stock before order tests.
- Restore or isolate state-changing test data when possible.
- Use idempotency keys only where the API supports them.
- Do not use real customer information, production credentials, real payment details, or unsanitized secrets in evidence.
- Never include password hashes, bearer tokens, cookies, or secret environment values in committed reports.

## 10. Entry Criteria

- The application and relevant dependencies can be started, or a blocker is documented.
- The active API URL and database configuration are known.
- Test data and accounts are available or their absence is recorded.
- The expected behavior is sufficiently defined to assess the result.
- The tester can preserve evidence and identify the tested build.

## 11. Exit Criteria

- Critical-risk scenarios have been executed or explicitly recorded as blocked/deferred.
- Failures have reproducible steps and supporting evidence where available.
- Confirmed defects have unique IDs, severity, priority, and regression links.
- Fixes are not considered verified until relevant tests are rerun.
- Actual test counts and the execution environment are recorded.
- Unresolved critical defects and untested critical scenarios are disclosed.
- Release readiness is assessed using evidence, not simply the existence of a test plan or automation suite.

## 12. Result Definitions

| Status | Definition |
|---|---|
| Pass | Actual behavior meets the documented expected result and required checks were completed |
| Fail | Actual behavior violates the expected result |
| Blocked | Test could not be completed because a prerequisite or safe execution condition was unavailable |
| Skipped | Test was deliberately not executed; reason must be recorded |
| Not Run | No execution has been recorded |
| Not Applicable | The feature or condition is not applicable to this build; rationale must be recorded |
| XFAIL / Expected Failure | Framework-marked expected failure; use only for a confirmed, documented defect and review unexpected passes |

A test failure alone does not prove an application defect. Investigate whether the cause is the application, test code/data, or environment.

## 13. Defect Management

Every defect must include a unique ID, concise title, affected component, environment, reproduction steps, expected result, actual result, evidence, severity, priority, status, linked requirement/test case, and resolution criteria.

Use `bug-reports.md` as the defect register. Update a defect only when new evidence is available. Do not claim a fix is complete until retesting verifies it.

## 14. Reporting

The execution report must include the tested build, date, environment, test command/suite, counts by status, defect summary, evidence location, blocked scenarios, residual risks, and next actions. Counts must be calculated from actual run output. Do not count planned tests as executed.

## 15. AI Quality Testing

AI test cases are conditional on an implemented AI feature. Before execution, define the feature, input/output contract, permitted actions, source context, data boundaries, and pass/fail criteria. Start with a small fixed regression dataset covering correctness, grounding, abstention when appropriate, prompt injection, sensitive-data protection, and tool-use authorization. Do not rely solely on another model to judge outputs.

## 16. Change Control

When the API contract, requirements, database schema, or UI changes:
- Update the relevant requirement and test case.
- Preserve historical execution evidence.
- Add or update regression coverage.
- Record any test made obsolete and explain why.
- Keep IDs stable unless a case is genuinely replaced or split.
