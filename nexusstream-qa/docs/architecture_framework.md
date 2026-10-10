# NexusStream QA — Automation Architecture

## 1. Overview

The `nexusstream-qa` project contains automated tests for validating the NexusStream application. It uses Python and Pytest for test execution, with Playwright for browser automation and HTTP-based tests for API validation.

The goal is to check whether the application behaves as expected, identify regressions, and make failures easier to investigate.

The architecture separates test cases from reusable setup and page interactions so that tests remain readable and easier to maintain as the project grows.

## 2. Project Structure

The QA project is organized around the following areas:

```text
nexusstream-qa/
├── conftest.py
├── pyproject.toml
├── pages/
│   ├── base_page.py
│   ├── home_page.py
│   ├── auth_page.py
│   ├── store_page.py
│   └── checkout_page.py
├── clients/
│   └── api_client.py
├── schemas/
│   └── api_schemas.py
├── tests/
│   ├── api/
│   ├── ui/
│   ├── e2e/
│   └── performance/
├── test_data/
├── sql/
└── reports/
```

This is the intended logical layout. Individual paths should be kept in sync with the actual repository; a directory should only be documented as implemented if it exists and is used.

## 3. Core Design

### 3.1 Shared fixtures

Pytest fixtures provide reusable test setup and dependencies.

Depending on the test, these can include:

- The application base URL.
- An HTTP client for API requests.
- A Playwright browser page.
- Page objects for common user interactions.
- Authentication headers for authorized requests.
- Test data and database access where configured.

Centralizing shared setup reduces duplication and gives tests a consistent way to access the application.

### 3.2 Page Object Model

The Page Object Model keeps browser interactions in dedicated Python classes rather than repeating selectors and interaction logic throughout the test suite.

The main responsibilities are:

| Component | Responsibility |
|---|---|
| `BasePage` | Shared navigation and locator helpers |
| `HomePage` | Landing page and navigation interactions |
| `AuthPage` | Registration and login |
| `StorePage` | Product search and cart interactions |
| `CheckoutPage` | Checkout steps and order confirmation |

This separation helps keep tests focused on the behavior being verified. When a locator or interaction changes, the corresponding page object can be updated without unnecessarily rewriting every test that uses it.

### 3.3 Locator handling

The application may use both `data-test` and `data-testid` attributes. If both conventions are supported by the test framework, a shared locator helper can handle them centrally.

For example:

```python
def test_attribute_locator(page, name: str):
    return page.locator(
        f'[data-testid="{name}"], [data-test="{name}"]'
    )
```

This example illustrates the approach; it should only be included as an implementation claim if the repository actually contains and uses an equivalent helper.

For user-facing elements, Playwright's role-based locators, such as `get_by_role()` and `get_by_label()`, are preferable when they provide reliable and accessible selectors.

### 3.4 API client and response validation

An API client can centralize request handling, base URL configuration, headers, and common response processing.

Reusable schema or validation helpers can then check response structures and required fields.

Examples of useful validation functions include:

- Success response validation.
- User response validation.
- Product list validation.

These functions should reflect the application's actual API contract. Centralized helpers are useful when they reduce duplication and make failures easier to understand; they should not replace assertions about specific business rules.

## 4. Test Layers

### 4.1 API tests

API tests exercise the backend directly over HTTP. They can validate status codes, response payloads, authentication requirements, and business rules.

The project’s documented test areas include authentication, product retrieval, order creation, stock validation, and admin authorization.

The exact coverage and current pass/fail status should be taken from the implemented tests and their latest execution results.

### 4.2 UI tests

UI tests use Playwright to interact with the application through a browser.

Typical user journeys include:

- Registering and logging in.
- Navigating the storefront.
- Searching for products.
- Adding products to the cart.
- Completing checkout.
- Verifying order confirmation.

These tests help detect problems that may not be visible through API checks alone, including navigation issues, broken interactions, and incorrect user-facing behavior.

### 4.3 End-to-end and database validation

Where implemented, end-to-end tests can verify that a user action produces the expected backend result.

For example, a checkout test can submit an order through the UI and then verify that the order was persisted with the expected product, quantity, and total.

Database assertions should use the configured database and a reliable way to identify the specific test transaction. A successful confirmation message alone does not prove that the correct records were persisted.

### 4.4 Performance testing

Performance checks are useful for evaluating response times, throughput, and error rates under simulated load.

If the repository contains a k6 script, it can be maintained separately from the functional test suite and executed as its own validation step.

Performance testing should have explicit workload assumptions and thresholds. The existence of a script does not, by itself, mean performance testing runs automatically in CI.

## 5. Test Execution Flow

The general execution model is:

```text
Test begins
    |
    v
Pytest loads fixtures and configuration
    |
    v
Test sends an API request or performs browser actions
    |
    v
Application behavior is observed
    |
    v
Assertions validate the expected result
    |
    v
Test results and available reports are recorded
```

API and UI tests use different interaction methods, but both should produce clear assertions and actionable failure messages.

Where database or performance checks are implemented, they follow their own setup and execution requirements.

## 6. Configuration and Test Data

The project configuration belongs in `pyproject.toml`, together with the dependencies and Pytest settings managed by the project.

Environment-specific values, such as the application URL and database connection string, should be configurable rather than hard-coded throughout the test cases.

Test data should be predictable and isolated where practical. For example, registration tests can generate unique email addresses to avoid conflicts with records left by earlier runs.

If shared test data files or SQL verification queries are used, keep them separate from test logic and document how they are loaded and maintained.

## 7. Reporting and Continuous Integration

The GitHub Actions workflow defined in `.github/workflows/ci.yml` provides the execution environment for the configured automated checks.

The current workflow:

1. Installs Python and Node.js dependencies.
2. Builds and starts the application.
3. Waits for the application health endpoint.
4. Runs the API suite in the smoke job.
5. Runs the API and UI suites in the dependent full QA job.
6. Uploads available XML and HTML reports and application logs.

The workflow also checks that the Playwright pytest plugin is installed and lists available fixtures before the main test execution.

This makes the test process repeatable and helps preserve evidence when a run fails.

## 8. Maintainability Principles

The project follows a few practical principles:

- **Keep tests focused:** Each test should have a clear purpose and expected outcome.
- **Reuse setup carefully:** Use fixtures and helpers where they reduce duplication.
- **Separate interaction from assertions:** Page objects handle browser interactions; tests verify business outcomes.
- **Validate contracts and behavior:** Check response structure as well as status codes and business rules.
- **Keep failures traceable:** Report the failing operation and the expected versus actual result.
- **Avoid unnecessary abstraction:** Add new layers only when they make the suite easier to understand or maintain.
- **Keep documentation accurate:** Update the documented architecture when files, fixtures, or test execution change.

## 9. Summary

NexusStream QA is organized around Pytest, API testing, Playwright browser automation, reusable fixtures, and page objects.

The aim is to make application checks repeatable, keep test logic maintainable, and provide useful evidence when a regression occurs. Additional layers, such as database verification and performance testing, should be documented as active capabilities only when their implementation and execution are confirmed.