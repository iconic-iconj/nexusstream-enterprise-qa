# Phase 6 Summary: Reliable Automation and CI/CD

## Objective
Build a dependable automation pipeline that can validate the app on pull requests with clear evidence, staged execution, and reusable setup.

## What is included
- smoke test gate before full suite
- full API and UI automation in GitHub Actions
- Python + uv dependency management
- Playwright installation for browser tests
- JUnit XML results for CI traceability
- HTML reporting via pytest-html
- artifact upload for reports and logs

## Why this is valuable
This shows the ability to:
- run automated validation in CI
- separate quick smoke pass from full regression pass
- preserve evidence for failures and debugging
- present a QA automation workflow that maps well to SDET/QA Automation roles

## Recommended execution flow
1. Smoke job verifies core API health and basic app availability.
2. Full QA job runs when smoke passes.
3. Reports are published as GitHub Actions artifacts.
4. Failures are retained with logs and artifact evidence.

## Evidence produced
- smoke API XML results
- API UI XML results
- HTML reports for human review
- app logs from the running local test target

## Portfolio positioning
This phase demonstrates automation maturity beyond raw test scripting: it shows reproducible execution, CI-based validation, and evidence-driven debugging discipline.
