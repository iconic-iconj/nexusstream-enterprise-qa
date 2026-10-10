import os
import uuid
import pytest
from clients.api_client import APIClient
import pages

# ==============================================================================
# 1. PLAYWRIGHT CONTEXT CONFIGURATION
# ==============================================================================
@pytest.fixture
def browser_context_args(browser_context_args):
    """Overrides the default playwright context viewport settings."""
    return {**browser_context_args, "viewport": {"width": 1440, "height": 1200}}

@pytest.fixture(scope="session")
def base_url():
    """Returns the base application URL from global environment setup."""
    return os.getenv("BASE_URL", "http://localhost:3000")


# ==============================================================================
# 2. CORE API CLIENTS & HEADERS
# ==============================================================================
@pytest.fixture
def api(base_url):
    """Provides a raw, unauthenticated base API client instance."""
    client = APIClient(base_url)
    yield client
    client.close()  # Safely closes the underlying httpx client connection

@pytest.fixture
def get_auth_headers(api):
    """Factory fixture that registers and logs in a user to generate auth tokens."""
    def _generate(prefix):
        email = f"{prefix}.{uuid.uuid4().hex[:8]}@example.com"
        api.post("/api/auth/register", json={"name": f"{prefix} User", "email": email, "password": "Password123!"})
        login = api.post("/api/auth/login", json={"email": email, "password": "Password123!"})
        return {"Authorization": f"Bearer {login.json()['token']}"}
    return _generate

@pytest.fixture
def admin_headers(get_auth_headers): return get_auth_headers("admin")

@pytest.fixture
def user_headers(get_auth_headers): return get_auth_headers("user")


# ==============================================================================
# 3. LEAN BOILERPLATE-REDUCING FACTORIES (UI & API)
# ==============================================================================
@pytest.fixture
def pom(page, base_url):
    """Consolidates all Page Object Models into a single unified registry namespace."""
    class POMRegistry:
        def __init__(self):
            self.auth = pages.AuthPage(page, base_url)
            self.home = pages.HomePage(page, base_url)
            self.store = pages.StorePage(page, base_url)
            self.checkout = pages.CheckoutPage(page, base_url)
    return POMRegistry()

@pytest.fixture
def user_api(api, user_headers):
    """Returns an API client pre-configured with standard User Bearer tokens."""
    api.client.headers.update(user_headers)  # Accesses the internal httpx client headers
    yield api
    api.client.headers.clear()  # Prevents token leakage to subsequent tests

@pytest.fixture
def admin_api(api, admin_headers):
    """Returns an API client pre-configured with Admin Bearer tokens."""
    api.client.headers.update(admin_headers)  # Accesses the internal httpx client headers
    yield api
    api.client.headers.clear()  # Prevents token leakage to subsequent tests
