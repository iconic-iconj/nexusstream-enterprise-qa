# test_storefront_db.py
import uuid
from playwright.sync_api import expect

def test_storefront_checkout_persists_order_in_database(pom, page, base_url):
    """Verify storefront checkout successfully saves transactional order details inside the database."""
    email = f"e2e.{uuid.uuid4().hex[:8]}@example.com"

  
    pom.home.open_home()
    pom.home.open_login()
    
    pom.auth.register("E2E Shopper", email, "Password123!")
    pom.auth.login(email, "Password123!")
    expect(page).to_have_url(f"{base_url}/shop")

   
    pom.store.search("blade")
    pom.store.expect_product_visible("Quantum Blade X1")
    pom.store.add_product_to_cart(1)
    pom.store.open_cart()
    expect(page).to_have_url(f"{base_url}/checkout")

   
    pom.checkout.fill_step_one()
    pom.checkout.fill_shipping_address("123 Market Street, Austin, TX")
    pom.checkout.fill_payment("E2E Shopper", "4242424242424242", "12/30", "123")
    pom.checkout.expect_order_confirmed()

    
    saved = pom.checkout.latest_order_for_email(email)
    assert saved is not None, f"No database record found for email: {email}"
    assert saved["order_id"] > 0
    assert saved["total_price"] > 0
    assert saved["product_id"] == 1
    assert saved["quantity"] >= 1
