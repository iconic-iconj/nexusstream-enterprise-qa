# NexusStream Enterprise QA

**Quality Engineering Portfolio | Python · Pytest · Playwright · HTTPX · REST APIs · SQL · CI/CD · AI Quality Evaluation**

NexusStream Enterprise QA is an end-to-end quality engineering project built around a working e-commerce application. It demonstrates how to plan, execute, automate, and report software testing across the user interface, backend APIs, database, security controls, and AI-powered functionality. The project combines a React and Express application with a Python-based testing framework to simulate practical QA work: validating business requirements, identifying high-risk failures, automating critical user journeys, verifying persisted data, and integrating automated checks into CI. Rather than focusing on test execution alone, this project emphasizes **business risk, reliable automation, evidence-based defect reporting, and confidence in software releases.**

## Project at a glance

| Area | Technology / Approach |
|---|---|
| Application under test | React, Vite, Express |
| Database | SQLite |
| UI automation | Playwright |
| API automation | Python, HTTPX |
| Test framework | Pytest |
| Database validation | SQL |
| API exploration | Postman |
| CI/CD | GitHub Actions |
| Test reporting | Pytest reports and collected test artifacts |
| AI quality | Groundedness, policy adherence, safety, and adversarial testing |
| Test strategy | Risk-based testing, regression, integration, and end-to-end validation |

## What I test

### Authentication and authorization
- Registration and login validation.
- Positive, negative, and boundary-value scenarios.
- Authenticated versus unauthenticated API access.
- Role-based access restrictions for administrative endpoints.
- Session and authorization behavior.

### Product catalog, cart, and checkout
- Product listing and search behavior.
- Cart and checkout workflows.
- Input validation and error handling.
- Order creation and business-rule enforcement.
- Inventory and order data integrity.

### API and backend validation
- HTTP status codes and response structure.
- Request validation and malformed inputs.
- Positive, negative, and edge-case API scenarios.
- Authentication, authorization, and access-control checks.
- Integration between API behavior and persisted application data.

### Database and data integrity
- SQL verification of users, orders, and inventory.
- Confirmation that API operations produce the expected database changes.
- Detection of inconsistencies between application responses and persisted records.
- Validation of order and inventory business rules.

### Security and AI quality
- Unauthorized access to protected resources.
- Security-focused regression testing.
- AI response groundedness and policy adherence.
- Prompt-injection and adversarial test scenarios.
- Repeatable checks for AI behavior and response quality.

## Automation and engineering practices

The project demonstrates a reusable approach to testing rather than relying entirely on isolated test scripts.
- **Pytest fixtures** for shared setup, reusable test dependencies, and cleanup.
- **HTTPX API tests** for backend behavior and response validation.
- **Playwright browser automation** for critical storefront and checkout journeys.
- **Page Object Model** where it improves UI test maintainability.
- **Reusable validation helpers** to reduce duplicated assertions.
- **Risk-based prioritization** to focus on critical business and security paths.
- **Regression testing** to help detect previously identified failures.
- **GitHub Actions** to run automated checks and make failures visible.
- **Test reports and artifacts** to support debugging and evidence-based reporting.

## Defect discovery and risk-based testing

Testing is prioritized according to potential customer impact, security exposure, data integrity, and business consequences. During testing, the following defects were identified and documented:

| Defect | Observed behavior | Severity / Priority |
|---|---|---|
| DEF-001 | A regular user could access the admin audit-log endpoint. | Critical / P0 |
| DEF-002 | An unauthenticated request could create an order. | Critical / P0 |
| DEF-003 | Registration accepted malformed email addresses. | High / P1 |

These findings demonstrate why testing must go beyond happy-path functionality. An application can appear to work correctly while still exposing administrative data, allowing unauthorized operations, or accepting invalid input. The defects are recorded as findings from the tested application, not claims that the underlying vulnerabilities have already been fixed.

## Repository structure

```text
NexusStream-Enterprise-QA/
├── nexusstream-app/
│   └── React, Vite, Express application
└── nexusstream-qa/
    ├── tests/
    │   ├── api/
    │   └── ui/
    ├── pages/
    ├── schemas/
    ├── data/
    ├── docs/
    ├── sql/
    ├── conftest.py
    └── pyproject.toml
└── README.md
```

*Directory names may vary slightly as the project evolves.*

## Documentation and QA artifacts

The QA documentation is organized by purpose, so reviewers can find specific deliverables without navigating a week-by-week learning plan.
- **Test plan** — scope, objectives, approach, and testing priorities.
- **Risk matrix** — business risks, likelihood, impact, and priority.
- **Test scenarios** — high-level workflows and conditions to validate.
- **Test cases** — structured test data, steps, expected results, and outcomes.
- **Requirements traceability** — mapping between requirements and tests.
- **Defect reports** — reproducible findings, impact, severity, and supporting evidence.
- **Regression mapping** — links between defects and tests intended to prevent recurrence.
- **Test execution report** — execution results, failures, and outstanding risks.
- **SQL and API evidence** — supporting checks for backend behavior and data integrity.

## Run locally

### 1. Start the application
Prerequisites: Node.js and npm.

```bash
cd nexusstream-app
npm install
npm run dev
```

Confirm the application is running at the local address configured by the project.

### 2. Install and run the QA suite
Prerequisites: Python and `uv`.

```bash
cd nexusstream-qa
uv sync
uv run pytest -v
```

Run a specific test directory:

```bash
uv run pytest tests/api -v
uv run pytest tests/ui -v
```

The UI tests require the application to be running at the configured base URL. Review the project configuration and environment variables before running the suite.

## What this project demonstrates

NexusStream Enterprise QA provides practical evidence of my ability to:
- Translate application requirements into structured test scenarios and cases.
- Identify and prioritize defects based on business and security risk.
- Automate API and browser tests with Python, Pytest, HTTPX, and Playwright.
- Validate backend behavior and database persistence.
- Investigate failures and document reproducible defects.
- Organize regression coverage around critical user journeys.
- Integrate automated testing into a CI workflow.
- Apply quality evaluation techniques to AI-powered functionality.

## Project objective

My goal with NexusStream is to demonstrate a practical, maintainable approach to quality engineering across modern applications—from functional validation and API automation to data integrity, access control, CI/CD, and AI quality evaluation. **The focus is not simply on writing more tests. It is on finding meaningful failures, explaining their impact, and building repeatable checks that improve confidence in software releases.**
