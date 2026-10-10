# conftest.py
import os
import uuid
import pytest
from playwright.sync_api import sync_playwright
from clients.api_client import APIClient
from pages.auth_page import AuthPage
from pages.home_page import HomePage
from pages.store_page import StorePage
from pages.checkout_page import CheckoutPage

@pytest.fixture(scope="session")
def base_url():
    return os.getenv("BASE_URL", "http://localhost:3000")

@pytest.fixture
def api(base_url):
    client = APIClient(base_url)
    yield client
    client.close()
    
@pytest.fixture
def auth_page(page, base_url):
    return AuthPage(page, base_url)


@pytest.fixture
def home_page(page, base_url): 
    return HomePage(page, base_url)

@pytest.fixture
def store_page(page, base_url): 
    return StorePage(page, base_url)

@pytest.fixture
def checkout_page(page, base_url): 
    return CheckoutPage(page, base_url)


def _get_auth_headers(api, prefix):
    email = f"{prefix}.{uuid.uuid4().hex[:8]}@example.com"
    api.post("/api/auth/register", json={"name": f"{prefix} User", "email": email, "password": "Password123!"})
    login = api.post("/api/auth/login", json={"email": email, "password": "Password123!"})
    return {"Authorization": f"Bearer {login.json()['token']}"}

@pytest.fixture
def admin_headers(api): return _get_auth_headers(api, "admin")

@pytest.fixture
def user_headers(api): return _get_auth_headers(api, "user")

# --- LEAN PLAYWRIGHT FIXTURES ---
@pytest.fixture(scope="session")
def browser():
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        yield browser
        browser.close()

@pytest.fixture
def page(browser):
    context = browser.new_context(viewport={"width": 1440, "height": 1200})
    page = context.new_page()
    yield page
    context.close()
