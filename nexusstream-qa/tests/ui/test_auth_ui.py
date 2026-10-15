from typing import Any
import pytest
from playwright.sync_api import Page, expect
import uuid

pytestmark = [pytest.mark.ui, pytest.mark.smoke]


def test_user_can_register_and_login(pom: Any, page: Page, register_and_login: Any) -> None:
    register_and_login("UI Tester")
    expect(page).to_have_url(f"{pom.auth.base_url}/shop")
    expect(pom.store.by_test_id("shop-search")).to_be_visible()


def test_registration_rejects_invalid_email(pom: Any, page: Page) -> None:
    pom.auth.open_login()
    pom.auth.by_test_id("auth-toggle").click()
    email_input = pom.auth.by_test_id("email-input")
    email_input.fill("not-an-email")
    pom.auth.by_test_id("auth-name-input").fill("Invalid Email Tester")
    pom.auth.by_test_id("password-input").fill("Password123!")
    pom.auth.by_test_id("login-btn").click()
    assert email_input.evaluate("(el) => el.validity.typeMismatch") is True
    expect(page).to_have_url(f"{pom.auth.base_url}/login")


def test_registration_rejects_short_password(pom: Any, test_data: dict[str, Any]) -> None:
    pom.auth.open_login()
    pom.auth.by_test_id("auth-toggle").click()
    pom.auth.by_test_id("auth-name-input").fill("Short Password Tester")
    
    
    pom.auth.by_test_id("email-input").fill(f"ui-short-pass.{uuid.uuid4().hex}@example.com")
    pom.auth.by_test_id("password-input").fill("123")
    pom.auth.by_test_id("login-btn").click()

   
    error_banner = pom.auth.by_test_id("login-error")
    expect(error_banner).to_be_visible()
    expect(error_banner).to_contain_text("password", ignore_case=True)
