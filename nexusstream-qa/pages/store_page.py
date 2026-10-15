from __future__ import annotations

from playwright.sync_api import Locator, expect
from .base_page import BasePage


class StorePage(BasePage):
    @property
    def product_cards(self) -> Locator:
        """Locates the product card grid wrappers."""
        return self.page.locator('[data-test="product-card"], [data-testid="product-card"]')

    def open_shop(self) -> None:
        """Navigates to the catalog store route page."""
        self.open("/shop")
        expect(self.by_test_id("dashboard")).to_be_visible()
        expect(self.product_cards.first).to_be_visible()

    def search(self, value: str) -> None:
        """Filters the display grid layout using the text search field input."""
        search_input = self.by_test_id("shop-search")
        expect(search_input).to_be_visible(timeout=5000)
        search_input.fill(value)

    def add_product_to_cart(self, product_id: str) -> None:
        """Clicks the dynamic 'Add to Cart' button linked to a product ID."""
        self.by_test_id(f"add-to-cart-{product_id}").click()

    def open_cart(self) -> None:
        """Triggers the cart link overlay from the header component."""
        cart = self.by_test_id("cart-button")
        expect(cart).to_be_visible(timeout=5000)
        cart.click()

    def product_id(self, card: Locator) -> str:
        """Extracts the unique structural product ID from a catalog card element."""
        product_id = card.get_attribute("data-product-id")
        if not product_id:
            image_id = card.locator('[data-testid^="product-image-"]').get_attribute("data-testid")
            product_id = image_id.removeprefix("product-image-") if image_id else None
        assert product_id and product_id.isdigit(), "Product card does not expose a valid numeric ID."
        return product_id

    def first_in_stock_product(self) -> Locator:
        """Locates the first available container item that is not out of stock."""
        for index in range(self.product_cards.count()):
            card = self.product_cards.nth(index)
            if "out of stock" not in card.inner_text().lower():
                return card
        raise AssertionError("No active in-stock products found inside the catalog grid layout.")
