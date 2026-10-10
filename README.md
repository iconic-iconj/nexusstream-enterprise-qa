# NexusStream — Enterprise QA Automation & Test Engineering Portfolio

An enterprise-grade, production-ready test automation framework engineered to validate full-stack behaviors of the NexusStream storefront application. This repository acts as a live, job-focused showcase of advanced software development engineers in test (SDET) methodologies across API, User Interface (UI), Performance, and Data Integrity layers.

## 🚀 Key Framework Capabilities
*   **Full-Stack E2E Synchronization:** Bridges Playwright UI user journeys directly with transactional backend SQLite assertions to guarantee end-to-end data integrity.
*   **Robust Framework Architecture:** Implements the Page Object Model (POM) decoupled completely from configuration logic by delegating page instantiation natively to global Pytest fixture factories (`conftest.py`).
*   **Optimal Schema Defensiveness:** Built a centralized, reusable type-verification engine (`api_schemas.py`) ensuring clean API contract validations without brittle code bloat.
*   **Enterprise Test Optimization:** Implements advanced Pytest configurations including test parametrization, test suite grouping, and automated expected-failure tagging (`@pytest.mark.xfail`) to keep CI/CD pipelines stable during live defect tracking.

---

## 🛠️ Technology Stack & Dependencies

*   **Application Environment:** Node.js (v18+) / React / Express
*   **Automation Core:** Python (v3.10+) / Pytest Engine
*   **UI Execution Drivers:** Playwright Lifecycle Wrapper
*   **Load Architecture:** Grafana k6 System Performance Engine
*   **Data Tier:** Structured SQLite Asset Database

---

## 🚀 Environment Initialization & Rapid Execution

### 1. Application Server Startup
```bash
cd nexusstream-app
npm install
npm run dev
# Application services instantiate at http://localhost:3000
```

### 2. Automation Workspace Configuration
```bash
cd ../nexusstream-qa
uv pip install -r requirements.txt
uv run playwright install chromium
```

### 3. API Regression Execution
Executes lean, schema-validated endpoint regressions testing authentication flows, catalog layouts, and security boundary conditions.
```bash
uv run pytest tests/api/ -v
```

### 4. Headless UI & Database E2E Integration Execution
Drives browser-based checkout funnels alongside direct relational database storage validations.
```bash
uv run pytest tests/ui/ -v
```

### 5. Performance Engineering Execution (k6 Validation)
```bash
k6 run performance/k6-load-test.js
```

---

## 📂 System Topography

*   `nexusstream-app/` — React frontend and Node.js core backend services under test.
*   `nexusstream-qa/` — Pytest-powered test repository workspace.
    *   `pages/` — Page Object Model interface classes managing application layout locators.
    *   `schemas/` — Reusable schema-validation modules evaluating API data contract compliance.
    *   `tests/api/` — Lean integration tests checking security blocks and status codes.
    *   `tests/ui/` — tests checking auth and storefront ensuring user can register/login and purchase products
    * `tests/e2e/` - E2E UI testing flows validating state consistency and cross-tier actions.
    *   `performance/` — k6 performance testing configurations looking at transaction throughput and response latency.

---

## 🔬 Architectural Decisions & Optimization Log

*   **Decoupled Initialization:** Eradicated repetitive inline `__init__` builders and instantiation commands from test structures by engineering global page lifecycle configurations in `conftest.py`.
*   **Network Optimization:** Merged separate, duplicate payload and status code endpoint hits into unified, structural assertion steps—minimizing duplicate traffic and accelerating feedback loops.
*   **Resilient Failure Tracking:** Tagged active application vulnerabilities with `@pytest.mark.xfail` annotations. This logs the structural break inside test outputs without causing artificial blockages in build infrastructure pipelines.