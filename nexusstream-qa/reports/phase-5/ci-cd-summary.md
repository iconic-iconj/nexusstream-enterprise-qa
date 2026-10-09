# Phase 5 / Phase 6 Summary

## Objective
Introduce repeatable automation and CI/CD fundamentals so test execution can happen automatically on pull requests and code changes.

## Included in this setup
- GitHub Actions workflow for automated Python test execution
- dependency installation with `uv`
- Playwright browser setup for browser tests
- start of the local app before test execution
- artifact upload for test reports and application logs
- structured folder layout for reproducible automation

## Why this matters
This demonstrates the ability to:
- run the app in CI
- install and configure dependencies
- execute automated checks without manual intervention
- preserve evidence of pass/fail results for review
- present a more professional QA automation workflow for SDET/QA Automation interviews

## Expected pipeline behavior
On pull request or push to main/master:
1. checkout repository
2. install Python dependencies
3. install Playwright browser
4. install and build the app
5. start the app in the background
6. run API and UI tests
7. upload artifacts and logs

## Evidence produced
- JUnit XML results for API and UI suites
- CI logs for execution traceability
- failure evidence that can be reviewed in GitHub Actions

## Recommended next refinements
- split jobs by test type (api vs ui)
- add a matrix for Python versions
- add a dedicated smoke test gate before full suite
- publish a nicer HTML report with `pytest-html` or Allure
- add Docker-based reproducible setup for local and CI parity
