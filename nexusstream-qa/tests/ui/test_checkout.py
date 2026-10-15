from typing import Any
import pytest
from playwright.sync_api import Page, expect

pytestmark = [pytest.mark.ui, pytest.mark.smoke]


def test_checkout_requires_shipping_address(pom: Any, register_and_login: Any) -> None:
    """Verify that shipping form progression remains strictly gated by address entry validations."""
    register_and_login("Checkout Validation")

    # Product staging cycle
    pom.store.open_shop()
    card = pom.store.first_in_stock_product()
    product_id = pom.store.product_id(card)
    
    pom.store.add_product_to_cart(product_id)
    pom.store.open_cart()

    # Step 1: Advance from cart overview
    pom.checkout.continue_from_cart()

    # Form field element assignment
    address_input = pom.checkout.by_test_id("checkout-address")
    shipping_next_btn = pom.checkout.by_test_id("checkout-step-2-next")

    # Step 2: Validate initial field block states
    expect(address_input).to_be_visible()
    expect(shipping_next_btn).to_be_disabled()

    # Verify whitespace padding string constraints trigger field isolation
    address_input.fill("   ")
    expect(shipping_next_btn).to_be_disabled()

    # Verify input formatting unlocks structural navigation button
    address_input.fill("123 Test Street, Abuja")
    expect(shipping_next_btn).to_be_enabled()
