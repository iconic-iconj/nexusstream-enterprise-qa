from typing import Any
import pytest
from playwright.sync_api import Page, expect
# Leverages your exact conftest.py dynamic email matching strategy natively
import uuid

pytestmark = [pytest.mark.ui, pytest.mark.smoke]


def test_user_can_register_and_login(pom: Any, page: Page, register_and_login: Any) -> None:
    """Verify standard happy-path user sign-up and subsequent marketplace portal routing."""
    # Leverages the conftest fixture to handle full UI workflow, returning the unique email
    register_and_login("UI Tester")

    expect(page).to_have_url(f"{pom.auth.base_url}/shop")
    expect(pom.store.by_test_id("shop-search")).to_be_visible()


def test_registration_rejects_invalid_email(pom: Any, page: Page) -> None:
    """Verify that browser context triggers HTML5 structural validation on bad email inputs."""
    pom.auth.open_login()
    pom.auth.by_test_id("auth-toggle").click()

    email_input = pom.auth.by_test_id("email-input")
    email_input.fill("not-an-email")
    pom.auth.by_test_id("auth-name-input").fill("Invalid Email Tester")
    pom.auth.by_test_id("password-input").fill("Password123!")
    pom.auth.by_test_id("login-btn").click()

    # Dynamic structural assessment for HTML5 pattern mismatch rules
    assert email_input.evaluate("(el) => el.validity.typeMismatch") is True
    expect(page).to_have_url(f"{pom.auth.base_url}/login")


def test_registration_rejects_short_password(pom: Any, test_data: dict[str, Any]) -> None:
    """Verify system-level enforcement and error messaging for insecure password lengths."""
    pom.auth.open_login()
    pom.auth.by_test_id("auth-toggle").click()

    # Reuses the structure definition mapping directly out of test_data from conftest
    pom.auth.by_test_id("auth-name-input").fill("Short Password Tester")
    
    
    pom.auth.by_test_id("email-input").fill(f"ui-short-pass.{uuid.uuid4().hex}@example.com")
    pom.auth.by_test_id("password-input").fill("123")
    pom.auth.by_test_id("login-btn").click()

    # Structural error payload banner checking
    error_banner = pom.auth.by_test_id("login-error")
    expect(error_banner).to_be_visible()
    expect(error_banner).to_contain_text("password", ignore_case=True)
