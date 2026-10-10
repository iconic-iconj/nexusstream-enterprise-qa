# test_auth_ui.py
import uuid
from playwright.sync_api import expect

def test_user_can_register_and_login(auth_page, page, base_url):
    """Verify a user can smoothly sign up and log into the application dashboard."""
    auth_page.open("/login")
    email = f"ui.{uuid.uuid4().hex[:8]}@example.com"
    
    auth_page.register("UI Tester", email, "Password123!")
    auth_page.login(email, "Password123!")

    expect(page).to_have_url(f"{base_url}/shop")
    expect(page.get_by_test_id("shop-search")).to_be_visible()
