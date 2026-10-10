import uuid
from playwright.sync_api import expect

def test_user_can_register_and_login(pom, page, base_url):
    """Verify a user can smoothly sign up and log into the application dashboard."""
   
    pom.auth.open("/login")
    email = f"ui.{uuid.uuid4().hex[:8]}@example.com"
    
    pom.auth.register("UI Tester", email, "Password123!")
    pom.auth.login(email, "Password123!")

    expect(page).to_have_url(f"{base_url}/shop")
    expect(page.get_by_test_id("shop-search")).to_be_visible()
