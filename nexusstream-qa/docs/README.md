# NexusStream QA Documentation Pack

This package contains unified, purpose-based QA documents. It is not divided into weeks.

## Contents
- `docs/test-plan.md`
- `docs/requirements-traceability.csv`
- `docs/risk-matrix.md`
- `docs/test-scenarios.md`
- `docs/test-cases.csv`
- `docs/test-execution-report.md`
- `docs/bug-reports.md`
- `docs/defect-regression-matrix.csv`
- `docs/evidence/` (empty folder placeholder)

## Important
- The three supplied defects are documented using the reproduction evidence provided by the user.
- Re-run the tests against the current build before describing the defects as current.
- Do not mark planned tests as passed.
- Confirm API contracts, database schema, active URLs, and implemented features before execution.
- The `ret test_status` CSV header is intentionally normalized below to `retest_status` for use in spreadsheet tools.
