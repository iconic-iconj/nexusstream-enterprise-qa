# Phase 3 Automation Plan

## Goal
Convert the Phase 2 API and database checks into a reusable Python automation suite for the NexusStream app.

## Scope
The initial suite covers the endpoints that actually exist in the app:
- `GET /api/health`
- `POST /api/auth/register`
- `POST /api/auth/login`
- `GET /api/user`
- `POST /api/auth/logout`
- `GET /api/products`
- `POST /api/products`
- `POST /api/orders`
- `GET /api/admin/logs`
- `GET /api/policy`
- `POST /api/mock/payment`

## Test strategy
- Validate successful responses for working flows.
- Validate failure responses for invalid input, unauthorized access, and insufficient stock.
- Use unique email addresses to avoid duplicate-user failures across repeated test runs.
- Keep test data simple and controlled.
- Prefer real app behavior over assumptions.

## Tools
- Python
- Pytest
- HTTPX
- pytest-cov
- GitHub for version control and evidence

## Execution
From the `nexusstream-qa` repo root, run:

```bash
uv run pytest
```

or

```bash
uv run pytest tests/api/
```
