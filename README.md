# NexusStream — QA Automation & Software Quality Engineering

I built this repository to demonstrate how I approach software quality across a full-stack application. It combines a React storefront and Node.js backend with a Python-based test automation suite covering API behavior, browser workflows, access control, and database integrity.

My focus is on validating real application behavior, identifying defects, and making regression testing repeatable through automation and CI.

**Core technologies:** Python · Pytest · Playwright · HTTPX · REST APIs · SQL · GitHub Actions · k6

[View Repository](https://github.com/iconic-iconj/nexusstream-enterprise-qa)

## What I Test

### API & Backend Testing
- Validate REST API responses, HTTP status codes, request data, and error handling.
- Test authentication and authorization boundaries, including access to protected resources.
- Check API response structures against reusable validation rules.
- Cover positive and negative scenarios to verify expected behavior and failure handling.

### UI & End-to-End Testing
- Automate browser workflows using Playwright and Pytest.
- Use the Page Object Model to keep page interactions separate from test assertions.
- Test registration, login, storefront navigation, cart operations, and checkout flows where implemented.
- Verify that user actions produce the expected application behavior.

### Database & Data Integrity
- Validate persisted application state for workflows covered by the test suite.
- Use database checks to investigate whether transactional operations produce the expected records.
- Check order details and related data where database verification is implemented.

### AI Application Testing
- Test the LLM-powered customer-support assistant integrated into the application.
- Evaluate generated responses against expected behavior and relevant application context.
- Identify response-quality issues that require further investigation and validation.

### Performance Testing
- Use k6 to exercise application endpoints under simulated load.
- Examine response latency and error rates to identify potential performance bottlenecks.
- Keep performance checks separate from functional regression tests.

## Framework Design

I organized the test suite to support reuse, clear test intent, and maintainable automation.

- **Page Object Model:** Centralizes browser interactions and page-specific locators.
- **Reusable fixtures:** Manages test setup and shared dependencies through Pytest.
- **API test utilities:** Reduces duplication in request handling and response validation.
- **Test organization:** Separates API, UI, and end-to-end scenarios.
- **CI integration:** Uses GitHub Actions to run automated checks and retain test reports.
- **Failure tracking:** Uses expected-failure markers for documented defects when the observed behavior and expected resolution are clearly understood.

## Technology Stack

| Area | Technologies |
|---|---|
| Programming | Python, JavaScript |
| Test automation | Pytest, Playwright |
| API testing | HTTPX, REST APIs, JSON validation |
| Application | React, Node.js, Express.js |
| Data validation | SQL, SQLite |
| CI/CD | Git, GitHub Actions |
| Performance | Grafana k6 |
| AI quality | LLM response evaluation, expected-behavior validation |

## Run the Project Locally

### 1. Start the application

Open a terminal from the repository root:

```bash
cd nexusstream-app
npm install
npm run dev
```

The application is expected to run at `http://localhost:3000`, based on the current project configuration.

Keep this terminal running.

### 2. Set up the QA environment

Open a second terminal:

```bash
cd nexusstream-qa
uv sync --all-extras
uv run python -m playwright install chromium
```

This installs the Python dependencies declared by the QA project and the Chromium browser used by Playwright.

### 3. Run API tests

```bash
uv run pytest tests/api/ -v
```

### 4. Run UI tests

```bash
uv run pytest tests/ui/ -v
```

### 5. Run the complete test suite

```bash
uv run pytest -v
```

### 6. Run performance tests

Install k6 separately if it is not already available, then run the project test from the repository root:

```bash
k6 run nexusstream-qa/performance/k6-load-test.js
```

Check the actual file location and application configuration if your local setup differs.

## CI/CD

GitHub Actions is configured to run automated tests when changes are pushed to, or proposed for, the configured branches.

The workflow includes dependency installation, Playwright browser setup, application startup, API smoke tests, and broader API and UI test execution.

Test reports are uploaded as workflow artifacts to support failure investigation and review.

## Current Test Results

In a reported test run, the suite recorded:

- **17 passed**
- **1 expected failure (`xfail`)**

The expected-failure test documents an authorization issue involving a regular user's attempted access to administrative logs.

These figures represent that particular test run, not a claim of complete application coverage. The results may change as the application and test suite evolve.

## Engineering Approach

I prioritize tests that provide meaningful confidence in application behavior rather than automating every possible interaction.

My approach includes:

- Testing both successful operations and failure conditions.
- Validating access controls and important business workflows.
- Checking persisted state when API or UI assertions alone are insufficient.
- Reusing test utilities where they improve consistency and maintainability.
- Investigating failures before deciding whether they indicate a product defect, a test issue, or an environment problem.
- Using CI results to make regression checks repeatable.

## Planned Improvements

- Expand LLM evaluation with structured test cases for correctness, relevance, unsupported claims, and response consistency.
- Add more systematic coverage for prompt injection and unsafe instruction handling.
- Improve API contract coverage and database integrity checks.
- Establish repeatable performance baselines and thresholds based on measured behavior.
- Expand test reporting and defect traceability.

## About This Project

NexusStream is an independent software quality engineering portfolio project. I use it to demonstrate practical skills in Python test automation, API testing, browser automation, backend validation, CI/CD, and AI application quality.

**Target roles:** QA Automation Engineer · Python Test Automation Engineer · API Test Engineer · Software QA Engineer · SDET · AI Quality Engineer