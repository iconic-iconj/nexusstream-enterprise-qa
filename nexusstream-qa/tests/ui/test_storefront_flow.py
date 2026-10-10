# test_storefront_e2e.py
import uuid
from playwright.sync_api import expect

def test_storefront_e2e_from_home_to_checkout(pom, page, base_url):
    """Verify full end-to-end e-commerce flow from home landing through cart purchase."""
    pom.home.open_home()
    pom.home.open_login()

    email = f"ui.{uuid.uuid4().hex[:8]}@example.com"
    pom.auth.register("UI Shopper", email, "Password123!")
    pom.auth.login(email, "Password123!")
    expect(page).to_have_url(f"{base_url}/shop")

  
    pom.store.search("blade")
    pom.store.expect_product_visible("Quantum Blade X1")
    pom.store.add_product_to_cart(1)
    pom.store.open_cart()
    expect(page).to_have_url(f"{base_url}/checkout")

  
    pom.checkout.fill_step_one()
    pom.checkout.fill_shipping_address("123 Market Street, Austin, TX")
    pom.checkout.fill_payment("UI Shopper", "4242424242424242", "12/30", "123")
    pom.checkout.expect_order_confirmed()
