import os
import sqlite3
import time
from pathlib import Path

from playwright.sync_api import expect

from pages.auth_page import AuthPage
from pages.checkout_page import CheckoutPage
from pages.home_page import HomePage
from pages.store_page import StorePage


def test_storefront_e2e_from_home_to_checkout(page, base_url):
    home_page = HomePage(page, base_url)
    auth_page = AuthPage(page, base_url)
    store_page = StorePage(page, base_url)
    checkout_page = CheckoutPage(page, base_url)

    home_page.open_home()
    home_page.open_login()

    email = f"ui.{__import__('uuid').uuid4().hex[:8]}@example.com"
    auth_page.register("UI Shopper", email, "Password123!")
    auth_page.login(email, "Password123!")
    expect(page).to_have_url(f"{base_url}/shop")

    store_page.search("blade")
    store_page.expect_product_visible("Quantum Blade X1")
    store_page.add_product_to_cart(1)
    store_page.open_cart()

    expect(page).to_have_url(f"{base_url}/checkout")
    checkout_page.fill_step_one()
    checkout_page.fill_shipping_address("123 Market Street, Austin, TX")
    checkout_page.fill_payment("UI Shopper", "4242424242424242", "12/30", "123")
    checkout_page.expect_order_confirmed()
