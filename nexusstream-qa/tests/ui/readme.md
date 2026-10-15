# NexusStream Enterprise QA — Weeks 9–12 UI and E2E Tests

This is a focused Playwright addition for the existing `nexusstream-qa` project. It preserves the Weeks 6–8 API test fixtures in `tests/conftest.py` and adds browser fixtures alongside them. It does not replace the API tests or duplicate SQL verification.

## Where reports go

Create `artifacts/` at the **root of `nexusstream-qa`**, beside `tests/`, `pages/`, `pytest.ini`, `pyproject.toml`, and `uv.lock`. It does not belong in `nexusstream-app`; screenshots, traces, videos, and test reports are QA outputs.

```text
NexusStream-Enterprise-QA/
├── nexusstream-app/          # application source; leave unchanged
└── nexusstream-qa/           # QA project root
    ├── artifacts/            # generated test evidence/reports
    ├── docs/
    ├── pages/
    ├── tests/
    │   ├── api/              # existing Weeks 6–8 API suite; keep it
    │   └── ui/               # new Weeks 9–12 tests
    ├── conftest.py           # combined API + Playwright fixtures
    ├── pytest.ini
    ├── pyproject.toml
    └── uv.lock
```

## Merge carefully

1. Copy the new `pages/` files into the existing QA project's `pages/` directory. Review and replace only the corresponding page objects; retain any unrelated page classes you still use elsewhere.
2. Merge `tests/ui/` into your existing `tests/` directory.
3. **Do not delete `tests/api/`.** The supplied `tests/conftest.py` in this package is the combined version: it preserves the API fixtures from the Weeks 6–8 suite and adds only the Playwright fixtures needed for UI tests. Compare it with your local conftest before replacing it, because your local version may contain additional fixtures.
4. Merge the `pytest.ini` marker entries into your current config if it contains other project settings.
5. Copy `docs/ui-test-traceability.csv` into your existing docs and map the rows marked “map to the matching existing test-plan case” to the exact IDs in your canonical `test-cases.csv`. Do not create duplicate test-case IDs.

## Install

Run from the `nexusstream-qa` project root. Keep your existing `pyproject.toml` and `uv.lock`; use `uv add` so dependency versions are recorded consistently.

```bash
uv add --dev pytest-playwright pytest-html
uv run playwright install chromium
uv sync
```

Start the application using your existing app startup instructions. `BASE_URL` defaults to `http://localhost:3000`.

## Run

```bash
mkdir -p artifacts
uv run pytest tests/ui -m ui
uv run pytest tests/ui/test_home_storefront.py tests/ui/test_authentication.py
uv run pytest tests/ui/test_e2e_checkout.py --tracing retain-on-failure --screenshot only-on-failure --video retain-on-failure
uv run pytest --junitxml=artifacts/junit.xml --html=artifacts/report.html --self-contained-html
```

The final command runs both API and UI tests if both folders are under `tests/`. For a UI-only HTML report, use:

```bash
uv run pytest tests/ui --junitxml=artifacts/ui-junit.xml --html=artifacts/ui-report.html --self-contained-html
```

## Scope by roadmap

- **Week 9:** homepage/storefront navigation, catalog content, search, registration/login, invalid email and short-password validation.
- **Week 10:** small Page Object Model, shared browser fixture, unique user setup and separation of page actions from test assertions.
- **Week 11:** add-to-cart, cart count/content and missing shipping-data validation.
- **Week 12:** complete checkout, verify the `POST /api/orders` response and verify the order confirmation UI.

## Grounded assumptions and limitations

- The tests use the selectors and checkout sequence present in the code you shared: `hero-shop-button`, `auth-toggle`, `shop-search`, `product-card`, `add-to-cart-{id}`, `cart-button`, `checkout-step-1-next`, `checkout-address`, `checkout-step-2-next`, payment field selectors, `checkout-complete`, and `order-success`.
- The full checkout test expects `POST /api/orders` to return HTTP 200 with `{ "success": true, "orderId": ... }`, matching the API contract used in your existing tests. If the app's actual response differs, update the assertion to the observed contract rather than weakening it blindly.
- The product card source uses `data-test="product-card"`, `data-product-id`, and child selectors for product name, price, category, and stock. Product IDs and product names are discovered at runtime; no fixed product ID is assumed.
- The page object does not query SQLite. Database persistence remains in your Week 4 SQL/integration evidence, not hidden inside a browser page object.
- The supplied application snippets do not establish a stable selector for changing cart quantity or reading the cart total. Those checks should be added after confirming the actual DOM and adding/using stable `data-test` attributes. This package does not invent those selectors.
- Run these tests against your actual app before treating them as passing. Browser automation is not considered verified merely because test collection succeeds.
