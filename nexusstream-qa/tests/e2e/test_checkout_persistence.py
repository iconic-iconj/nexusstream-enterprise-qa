import uuid

from playwright.sync_api import expect

from pages.auth_page import AuthPage
from pages.checkout_page import CheckoutPage
from pages.home_page import HomePage
from pages.store_page import StorePage


def test_storefront_checkout_persists_order_in_database(page, base_url):
    home_page = HomePage(page, base_url)
    auth_page = AuthPage(page, base_url)
    store_page = StorePage(page, base_url)
    checkout_page = CheckoutPage(page, base_url)
    email = f"e2e.{uuid.uuid4().hex[:8]}@example.com"

    home_page.open_home()
    home_page.open_login()
    auth_page.register("E2E Shopper", email, "Password123!")
    auth_page.login(email, "Password123!")
    expect(page).to_have_url(f"{base_url}/shop")

    store_page.search("blade")
    store_page.expect_product_visible("Quantum Blade X1")
    store_page.add_product_to_cart(1)
    store_page.open_cart()

    expect(page).to_have_url(f"{base_url}/checkout")
    checkout_page.fill_step_one()
    checkout_page.fill_shipping_address("123 Market Street, Austin, TX")
    checkout_page.fill_payment("E2E Shopper", "4242424242424242", "12/30", "123")
    checkout_page.expect_order_confirmed()

    saved = checkout_page.latest_order_for_email(email)
    assert saved is not None
    assert saved["order_id"] > 0
    assert saved["total_price"] > 0
    assert saved["product_id"] == 1
    assert saved["quantity"] >= 1
