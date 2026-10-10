# NexusStream QA CI Pipeline

## 1. Overview

NexusStream uses GitHub Actions to build the application, start the service, and execute automated API and UI tests.

The workflow is defined in `.github/workflows/ci.yml`. It coordinates two projects:

- `nexusstream-app` — the application under test.
- `nexusstream-qa` — the Python-based automated testing project.

The pipeline uses Python, `uv`, Node.js, npm, Pytest, and Playwright. It runs on GitHub-hosted Ubuntu runners and uploads test results and application logs as workflow artifacts.

## 2. CI Objectives

The pipeline is designed to:

- Install application and QA dependencies.
- Build the application before testing.
- Start the application in the CI environment.
- Verify application health through `/api/health`.
- Run API smoke tests before the full QA suite.
- Execute API and browser-based UI tests.
- Preserve test reports and application logs for troubleshooting.

The objective is to detect application regressions and provide diagnostic information when a CI check fails.

## 3. Repository Structure

```text
Nexusstream-Enterprise-qa/
├── .github/
│   └── workflows/
│       └── ci.yml
├── nexusstream-app/
│   ├── package.json
│   ├── package-lock.json
│   └── ...
├── nexusstream-qa/
│   ├── pyproject.toml
│   ├── uv.lock
|   |__ pages
    |
|   |__docs/
|   |__performance
|   |__reports
│   ├── tests/
│   │   ├── api/
│   │   └── ui/
        |__e2e
|   |
│   └── reports/
└── README.md
```

The workflow expects the application and QA project to be located at these paths. Reports are written to `nexusstream-qa/reports/`.

## 4. Workflow Triggers and Permissions

The workflow runs when:

- A pull request targets `main` or `master`.
- A commit is pushed to `main` or `master`.
- A user manually starts the workflow through GitHub Actions.

The workflow also configures:

```yaml
permissions:
  contents: read
```

This grants the workflow read access to repository contents without granting unnecessary repository write permissions.

Concurrency is configured using the Git reference:

```yaml
concurrency:
  group: nexusstream-qa-${{ github.ref }}
  cancel-in-progress: true
```

A newer run for the same reference can cancel an older in-progress run. This reduces unnecessary duplicate CI execution.

## 5. CI Environment and Dependencies

Both jobs use `ubuntu-latest`.

### Python environment

The workflow installs Python 3.11, configures `uv`, and installs the QA project's dependencies:

```bash
uv sync --all-extras
```

The command runs from `nexusstream-qa`, where the Python project configuration is maintained.

### Playwright browser

The workflow installs Chromium and its required system dependencies:

```bash
uv run python -m playwright install --with-deps chromium
```

This prepares the browser environment for the Playwright UI tests.

### Node.js environment

The workflow installs Node.js 22 and enables npm dependency caching using:

`nexusstream-app/package-lock.json`

Application dependencies are installed with:

```bash
npm ci
```

Using `npm ci` makes the installation follow the committed lockfile rather than resolving a new dependency tree.

## 6. Application Build and Startup

Both jobs independently install application dependencies and build the application.

The build command is:

```bash
npm run build
```

The application is then started using:

```bash
nohup npm run dev -- --host 0.0.0.0 \
  > /tmp/nexusstream-app.log 2>&1 &

echo $! > /tmp/nexusstream-app.pid
```

The process runs in the background. Its process ID is saved for cleanup, and its standard output and error output are redirected to `/tmp/nexusstream-app.log`.

The workflow expects the application to serve the health endpoint at:

`http://localhost:3000/api/health`

### Health-check behavior

The workflow polls the endpoint up to 60 times, sleeping for two seconds between unsuccessful attempts.

If the endpoint responds successfully, the health-check step passes.

If the application does not become healthy before the retry limit is reached, the step prints the application log and exits with a failure status.

This prevents the test stages from proceeding when application startup has failed.

## 7. Job 1: API Smoke Tests

**Job ID:** `smoke`

**Display name:** API Smoke Tests

The smoke job provides an initial API quality gate before the broader test suite runs.

Its main steps are:

1. Check out the repository.
2. Set up Python and `uv`.
3. Install QA dependencies.
4. Install Playwright Chromium.
5. Set up Node.js and install application dependencies.
6. Build and start the application.
7. Wait for the health endpoint.
8. Verify that the Playwright pytest plugin can be imported and inspect the UI test fixtures.
9. Execute the API smoke suite.
10. Upload smoke test artifacts.

### Smoke test command

```bash
uv run pytest tests/api -q --maxfail=1 \
  --junitxml=reports/smoke-api-results.xml
```

The command runs the tests under `tests/api` in quiet mode and stops after the first test failure.

**Important:** This command runs the entire `tests/api` directory. It functions as a smoke stage, but it is not a separately selected subset unless the tests or configuration define that subset.

The smoke job does not run the browser UI suite.

### Smoke artifacts

The workflow uploads:

- `nexusstream-qa/reports/*.xml`
- `/tmp/nexusstream-app.log`

The artifact is named `smoke-test-results`.

The upload step uses `if: always()`, so GitHub Actions attempts to upload available files even when an earlier step fails.

## 8. Job 2: Full QA Suite

**Job ID:** `qa`

**Display name:** Full QA Suite

The full QA job is configured with:

```yaml
needs: smoke
```

This means the job runs only after the smoke job succeeds. If the smoke job fails or is cancelled, the dependent QA job will not run.

The full QA job provisions its own environment. It checks out the repository, installs Python and Node.js dependencies, installs Chromium, builds the application, starts the service, and waits for the health endpoint.

It then verifies the Playwright plugin and runs the API and UI test suites separately.

### API test suite

```bash
uv run pytest tests/api -v \
  --junitxml=reports/api-results.xml \
  --html=reports/api-report.html \
  --self-contained-html
```

This executes the API tests in verbose mode and generates:

- `api-results.xml` — JUnit XML test results.
- `api-report.html` — a standalone HTML report.

The HTML report options require `pytest-html` to be installed in the QA environment.

### UI test suite

```bash
uv run pytest tests/ui -v \
  --junitxml=reports/ui-results.xml \
  --html=reports/ui-report.html \
  --self-contained-html
```

This executes the UI tests using Pytest and Playwright and generates:

- `ui-results.xml` — JUnit XML test results.
- `ui-report.html` — a standalone HTML report.

The tests exercise the browser-based behavior implemented in the repository. Actual feature coverage depends on the test cases present in `tests/ui`.

### Test execution order

The full QA job runs the API suite before the UI suite. Since these commands are separate workflow steps, an API test failure normally prevents the UI step from running.

## 9. Playwright Fixture Verification

Both jobs execute:

```bash
uv run python -c \
  "import pytest_playwright; print('pytest-playwright is installed')"

uv run pytest --fixtures tests/ui/test_auth_ui.py
```

The first command verifies that the `pytest_playwright` Python module can be imported.

The second asks Pytest to list the fixtures available for the specified test module, including fixtures provided by registered plugins.

These checks help diagnose missing Playwright dependencies and fixture configuration problems before the main UI suite runs.

They are setup diagnostics, not substitutes for executing the UI tests.

## 10. Reports and Diagnostic Artifacts

The full QA job uploads artifacts under the name `full-qa-results`.

The configured artifact paths are:

```text
nexusstream-qa/reports/*.xml
nexusstream-qa/reports/*.html
/tmp/nexusstream-app.log
```

The reports provide two complementary views of test execution:

| Artifact | Purpose |
|---|---|
| JUnit XML | Structured test results for CI processing |
| HTML reports | Human-readable test execution summaries |
| Application log | Diagnostic output for startup and runtime failures |

Both artifact-upload steps use `if: always()` and `if-no-files-found: warn`.

Consequently, the workflow attempts to preserve available diagnostics even after a failure. Missing files generate a warning rather than automatically failing the artifact-upload step.

## 11. Application Cleanup

The full QA job includes a final cleanup step:

```bash
if [ -f /tmp/nexusstream-app.pid ]; then
  kill "$(cat /tmp/nexusstream-app.pid)" || true
fi
```

The step uses `if: always()` so cleanup is attempted regardless of whether the earlier QA steps pass or fail.

The command attempts to terminate the process identified by the saved PID. The `|| true` prevents a termination failure from failing the cleanup step.

The smoke job does not have a corresponding explicit stop step. Its runner is temporary, so the runner environment is discarded after the job completes.

## 12. Quality Gate and Failure Behavior

The pipeline applies its checks in the following order:

1. Install dependencies.
2. Build the application.
3. Start the application.
4. Confirm the health endpoint responds.
5. Verify Playwright plugin setup.
6. Run the API suite in the smoke job.
7. Run the API and UI suites in the dependent QA job.
8. Upload available reports and logs.

A failure in a required step causes that job to fail. The dependency between the jobs ensures that the full QA suite is not run after a failed smoke job.

A successful workflow indicates that the configured build, startup checks, and executed tests passed. It does not prove that every application feature is defect-free or that unimplemented test categories have been validated.

## 13. Current Scope

The workflow explicitly implements:

- GitHub Actions automation.
- Python and Node.js environment setup.
- Application dependency installation and build.
- Background application startup.
- HTTP health-check polling.
- Pytest API execution.
- Playwright UI test execution.
- JUnit XML and HTML report generation.
- Artifact upload and diagnostic log preservation.
- Application process cleanup in the full QA job.

The workflow does not explicitly define separate CI jobs for performance testing, security scanning, database verification, or AI/LLM evaluation. Those activities should only be described as CI capabilities if corresponding commands and configuration are added to the workflow.

## 14. Summary

NexusStream's GitHub Actions pipeline builds and starts the application, checks service health, executes API smoke tests, and then runs the broader API and Playwright UI suites. It preserves test reports and application logs as artifacts to support failure investigation.

The two-job design provides an initial API gate followed by broader functional validation, with the full QA job dependent on successful completion of the smoke job.