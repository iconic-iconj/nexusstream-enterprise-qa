import pytest
from playwright.sync_api import Page, expect

pytestmark = [pytest.mark.ui, pytest.mark.smoke]


def test_homepage_shop_navigation(pom: Any, page: Page) -> None:
    """Verify that clicking the shop button on the home page correctly opens the marketplace."""
    pom.home.open_home()
    pom.home.open_shop()

    expect(page).to_have_url(f"{pom.home.base_url}/shop")
    expect(pom.store.by_test_id("dashboard")).to_be_visible()
    expect(pom.store.product_cards.first).to_be_visible()


def test_storefront_displays_product_information(pom: Any) -> None:
    """Verify that catalog grid items expose all standard structural elements cleanly."""
    pom.store.open_shop()
    card = pom.store.product_cards.first

    expect(card).to_be_visible()
    # Verifies card header layouts render correctly
    expect(card.get_by_role("heading", level=3)).to_be_visible()
    expect(card.get_by_role("button", name="Add to Cart")).to_be_visible()
    expect(card.locator('text=$')).to_be_visible()


def test_storefront_search_finds_existing_product(pom: Any) -> None:
    """Verify that input parameters on the search field correctly filter the product catalog grid."""
    pom.store.open_shop()
    
    # Grab the specific name text from the first available product container card
    first_card_heading = pom.store.product_cards.first.get_by_role("heading", level=3)
    product_name = first_card_heading.inner_text().strip()

    pom.store.search(product_name)

    # Search result isolation checks
    expect(pom.store.product_cards).to_have_count(1)
    expect(first_card_heading).to_have_text(product_name)


def test_user_can_add_product_to_cart(pom: Any, register_and_login: Any) -> None:
    """Verify that authenticated users can successfully stage an item inside the cart session."""
    register_and_login("Cart Tester")
    pom.store.open_shop()

    card = pom.store.first_in_stock_product()
    product_id = pom.store.product_id(card)

    pom.store.add_product_to_cart(product_id)

    # Dynamic counter incremental state assertions
    expect(pom.store.by_test_id("cart-count")).to_have_text("1")
    
    # Enters the cart review step view context seamlessly
    pom.store.open_cart()
    expect(pom.checkout.by_test_id("checkout-step-1-next")).to_be_visible()
