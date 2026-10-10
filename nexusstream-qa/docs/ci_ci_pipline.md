# NexusStream QA CI Pipeline

This document describes the real continuous integration setup used in this repository. The pipeline is defined in `.github/workflows/ci.yml` and is designed to validate the `nexusstream-app` application together with the `nexusstream-qa` automation project.

The CI flow is focused on practical quality gates for this project:

- install and build the React + Express app
- start the application locally
- run the Python API test suite
- run the Playwright UI suite
- publish detailed test reports as GitHub Actions artifacts

---

## 1. CI Purpose

The pipeline exists to answer one question before merge:

> Is the app still healthy enough for the automated QA checks to pass in a clean environment?

This project uses CI to validate:

- app startup and health endpoint availability
- auth and user flows
- products and catalog behavior
- admin and protected-route checks
- UI flows using Playwright
- regression risk across the app and the QA project

---

## 2. Repository Architecture in CI

The workflow operates across both major project folders:

```text
repo-root/
├── nexusstream-app/      -> React frontend + Express API server
├── nexusstream-qa/       -> pytest + Playwright automation suite
├── .github/workflows/    -> GitHub Actions CI definition
└── README.md
```

The CI process starts the app from `nexusstream-app`, then runs automated checks from `nexusstream-qa` against `http://localhost:3000`.

---

## 3. Real Workflow Definition

The pipeline is configured in `.github/workflows/ci.yml` and contains two jobs:

- `smoke`
- `qa`

### Job 1: `smoke`
This job validates core app startup and basic API health before running the wider suite.

### Job 2: `qa`
This runs the main functional validation suite after the smoke step completes successfully.

---

## 4. Workflow Logic

### Trigger conditions

```yaml
on:
  pull_request:
    branches: [main, master]
  push:
    branches: [main, master]
```

This means the pipeline runs on merge requests and main branch updates.

### Runner

```yaml
runs-on: ubuntu-latest
```

The CI runs on a clean Ubuntu GitHub-hosted runner.

---

## 5. Dependencies and Setup

Each job installs Python and the project dependencies with `uv`.

```yaml
- name: Set up Python
  uses: actions/setup-python@v5
  with:
    python-version: '3.11'

- name: Install uv
  run: pip install uv

- name: Install dependencies
  run: uv sync --all-extras
```

This matches the project configuration in `nexusstream-qa/pyproject.toml` and ensures the Python environment is consistent with the repo requirements.

The workflow also installs the Chromium browser used by Playwright:

```yaml
- name: Install Playwright browser
  run: uv run python -m playwright install --with-deps chromium
```

---

## 6. App Startup in CI

The workflow starts the application before running tests.

```yaml
- name: Start app
  working-directory: .
  run: |
    cd nexusstream-app
    npm install
    npm run build
    nohup npm run dev >/tmp/nexusstream-app.log 2>&1 &
    sleep 30
    for i in {1..30}; do
      if curl -sSf http://localhost:3000/api/health >/dev/null 2>&1; then
        echo "App healthy"
        break
      fi
      echo "Waiting for app... ($i)"
      sleep 1
    done
```

This is a realistic CI startup sequence because the test suite depends on the live app being reachable on port 3000.

The app is run with the dev server and a health check loop to confirm the backend is accepting requests before the Python tests begin.

---

## 7. Smoke Stage

The smoke job runs a minimal, high-value API suite first:

```yaml
- name: Run smoke suite
  run: |
    mkdir -p reports
    uv run pytest tests/api -q --maxfail=1 --junitxml=reports/smoke-api-results.xml
```

This stage is intentionally lightweight and is meant to fail fast if the app is broken or the API contract is no longer valid.

It acts as a quick quality gate before running the broader browser suite.

---

## 8. Full QA Stage

The `qa` job runs the main validation layers:

```yaml
- name: Run API suite
  run: |
    mkdir -p reports
    uv run pytest tests/api -q --junitxml=reports/api-results.xml --html=reports/api-report.html --self-contained-html

- name: Run UI suite
  run: |
    mkdir -p reports
    uv run pytest tests/ui -q --junitxml=reports/ui-results.xml --html=reports/ui-report.html --self-contained-html
```

This matches the project structure and the actual test types in `nexusstream-qa/tests/`:

- API validation for auth, products, orders, admin checks, policy, etc.
- UI validation for login, storefront flow, checkout and browser interactions

---

## 9. Artifact Publishing

Both jobs upload execution artifacts when the run completes, regardless of pass/fail status.

```yaml
- name: Upload smoke artifacts
  if: always()
  uses: actions/upload-artifact@v4
  with:
    name: smoke-results
    path: |
      nexusstream-qa/reports/*.xml
      nexusstream-qa/reports/*.html
      /tmp/nexusstream-app.log
```

And similarly for the QA run:

```yaml
- name: Upload QA artifacts
  if: always()
  uses: actions/upload-artifact@v4
  with:
    name: qa-results
    path: |
      nexusstream-qa/reports/*.xml
      nexusstream-qa/reports/*.html
      /tmp/nexusstream-app.log
```

This provides:

- JUnit XML reports
- HTML pytest reports
- application log output for debugging failed runs

---

## 10. CI Quality Gate Interpretation

This pipeline is designed as a practical quality gate for the project, not a theoretical DevOps checklist.

A pipeline run is considered healthy only when:

- the app builds and starts successfully
- the health endpoint responds
- the API suite passes
- the UI suite passes in headless browser mode
- HTML and XML reports are generated and stored

If any of these fail, the pipeline stops the validation flow and exposes artifacts for investigation.

---

## 11. Why This Pipeline Fits This Project

This CI setup matches the actual repo structure and project needs:

- the app is a real full-stack product, not a mock project
- QA checks run against the live app over HTTP and browser automation
- startup validation is part of the quality gate
- both API and UI testing are included, because this project validates both layers
- artifacts are preserved for debugging and review

This is a realistic example of a CI pipeline for a QA portfolio project that validates software behavior end-to-end.

---

## 12. Best-Use Summary

For this repository, the strongest CI message is:

> The project automatically starts the application, runs API and UI verification against it, and publishes the results as actionable artifacts for regression detection.

That is the correct CI logic for this project and the most effective version to keep in a portfolio or QA technical document.
