# Phase 4 — Playwright and end-to-end testing

## Goal
Build browser automation coverage for the actual NexusStream app using Playwright and keep the suite maintainable and job-ready for QA Automation Engineer, Automation Tester, and Junior SDET roles.

## Scope
The Phase 4 suite covers the real user journeys supported by the application:
- registration flow
- login flow
- product search and filtering
- add to cart flow
- checkout and order confirmation
- admin access gating
- browser-level validation for UI behavior

## Core skills exercised
- Playwright locators and selectors
- explicit and implicit waits
- assertions against UI state
- authentication/session handling
- form inputs and validation
- screenshots and trace debugging
- maintainable test structure

## Strategy
- Keep tests small and focused on the main user journey.
- Use app-supported paths and UI elements only.
- Prefer real user inputs and visible states over complex mocked behavior.
- Keep assertions tied to observable UI outputs.

## Execution
Run the browser suite:

```bash
uv run pytest tests/ui/ -q
```

Run the performance smoke check:

```bash
uv run pytest tests/performance/ -q
```

Install the browser runtime once:

```bash
uv run python -m playwright install chromium
```
