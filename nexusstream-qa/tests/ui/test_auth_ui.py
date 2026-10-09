from playwright.sync_api import expect

from pages.auth_page import AuthPage


def test_user_can_register_and_login(page, base_url):
    auth_page = AuthPage(page, base_url)
    auth_page.open("/login")

    email = f"ui.{__import__('uuid').uuid4().hex[:8]}@example.com"
    auth_page.register("UI Tester", email, "Password123!")
    auth_page.login(email, "Password123!")

    expect(page).to_have_url(f"{base_url}/shop")
    expect(page.get_by_test_id("shop-search")).to_be_visible()
