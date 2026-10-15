from __future__ import annotations

import json
import os
import uuid
from pathlib import Path
from typing import Any, Callable, Iterator

import httpx
import pytest
from playwright.sync_api import Page

from pages import AuthPage, CheckoutPage, HomePage, StorePage

# Global Settings
BASE_URL = os.getenv("BASE_URL", "http://localhost:3000").rstrip("/")
PASSWORD = os.getenv("TEST_USER_PASSWORD", "Password123!")
TIMEOUT = float(os.getenv("HTTP_TIMEOUT", "10"))


@pytest.fixture(scope="session")
def test_data() -> dict[str, Any]:
    path = Path(__file__).parent / "test-data" / "api_cases.json"
    with path.open(encoding="utf-8") as file:
        return json.load(file)


@pytest.fixture
def api() -> Iterator[httpx.Client]:
    """Provides a completely clean, unauthenticated client instance."""
    with httpx.Client(
        base_url=BASE_URL,
        timeout=httpx.Timeout(TIMEOUT),
        headers={"Accept": "application/json"}
    ) as client:
        yield client


@pytest.fixture
def register_user_api(api: httpx.Client, test_data: dict[str, Any]) -> Callable[..., httpx.Response]:
    """Helper factory to register a user via API with minimal boilerplate in tests."""
    def _register(email: str | None = None, name: str = "Registration Test", password: str | None = None) -> httpx.Response:
        payload = {
            "name": name,
            "email": email or f"register.{uuid.uuid4().hex}@example.com",
            "password": password or test_data["users"]["valid_password"]
        }
        return api.post("/api/auth/register", json=payload)
    return _register


@pytest.fixture
def user_api(api: httpx.Client, test_data: dict[str, Any]) -> Iterator[httpx.Client]:
    """Provides an isolated, fully authenticated user client instance."""
    email = f"test.{uuid.uuid4().hex}@example.com"
    credentials = {"name": "Test User", "email": email, "password": PASSWORD}
    
    # Register & Login using the isolated client context
    api.post("/api/auth/register", json=credentials)
    login_res = api.post("/api/auth/login", json={"email": email, "password": PASSWORD})
    
    token = login_res.json().get("token")
    api.headers["Authorization"] = f"Bearer {token}"
    yield api


@pytest.fixture
def created_product(user_api: httpx.Client, test_data: dict[str, Any]) -> dict[str, Any]:
    product = dict(test_data["valid_product"])
    product["name"] = f"{product['name']} {uuid.uuid4().hex[:8]}"
    res = user_api.post("/api/products", json=product)
    return {**product, "id": res.json()["id"]}


@pytest.fixture
def pom(page: Page) -> Any:
    class PageObjects:
        home = HomePage(page, BASE_URL)
        auth = AuthPage(page, BASE_URL)
        store = StorePage(page, BASE_URL)
        checkout = CheckoutPage(page, BASE_URL)
    return PageObjects()


@pytest.fixture
def register_and_login(pom: Any) -> Callable[[str, str | None], str]:
    def _action(name: str, email: str | None = None) -> str:
        user_email = email or f"ui-user.{uuid.uuid4().hex}@example.com"
        pom.auth.open_login()
        pom.auth.register(name, user_email, PASSWORD)
        pom.auth.login(user_email, PASSWORD)
        return user_email
    return _action
