# NexusStream QA — Weeks 6–8 API Automation

API-only automation using Python, HTTPX and Pytest, aligned to the supplied roadmap. No Playwright or frontend fixtures are included.

Read `docs/week-6-8-api-automation.md` for setup, execution, reporting, roadmap mapping and known limitations.

Quick start from the existing QA project root:

```bash
uv add --dev pytest httpx pytest-html
uv sync
uv run pytest
uv run pytest --junitxml=artifacts/junit.xml --html=artifacts/report.html --self-contained-html
```

The suite assumes the NexusStream application is already running at `BASE_URL` (default `http://localhost:3000`). Tests have not been executed against your local environment; verify behavior and record actual results before claiming they pass.
