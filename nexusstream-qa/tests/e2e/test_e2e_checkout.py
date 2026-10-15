import pytest
from playwright.sync_api import Page, expect
from typing import Any

pytestmark = [pytest.mark.ui, pytest.mark.e2e]


def test_registered_user_completes_checkout(pom: Any, page: Page, register_and_login: Any) -> None:
    """Verify clean end-to-end purchasing workflow from item selection to order generation."""
    register_and_login("E2E Shopper")
    expect(page).to_have_url(f"{pom.store.base_url}/shop")

    # Step 1: Catalog Processing & Cart Ingestion
    pom.store.open_shop()
    card = pom.store.first_in_stock_product()
    product_id = pom.store.product_id(card)
    
    pom.store.add_product_to_cart(product_id)
    
    # Verify counter changes dynamically matching items list count
    expect(pom.store.by_test_id("cart-count")).to_have_text("1")
    
    # Step 2: Transition into checkout view overlay
    pom.store.open_cart()
    
    # Step 3: Sequential Checkout Funnel Submission
    pom.checkout.continue_from_cart()
    pom.checkout.enter_shipping_address("123 Test Street, Abuja, Nigeria")
    
    pom.checkout.enter_test_payment(
        name="E2E Shopper",
        number="4242424242424242",
        expiry="12/30",
        cvc="123"
    )

    # Step 4: Intercept and Verify API Transaction Status
    with page.expect_response(
        lambda response: response.request.method == "POST" and "/api/orders" in response.url,
        timeout=30000
    ) as response_info:
        pom.checkout.submit_order()

    order_response = response_info.value
    assert order_response.status == 200, f"Order placement failed: {order_response.text()}"
    
    # Assert transaction completed state UI view renders successfully
    pom.checkout.expect_order_confirmed()
