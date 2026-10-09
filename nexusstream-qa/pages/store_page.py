from playwright.sync_api import Page, expect

from .base_page import BasePage


class StorePage(BasePage):
    def __init__(self, page: Page, base_url: str):
        super().__init__(page, base_url)

    def search(self, value: str):
        self.page.get_by_test_id("shop-search").fill(value)

    def filter_by_category(self, category: str):
        self.page.get_by_test_id(f"filter-{category.lower()}").click()

    def add_product_to_cart(self, product_id: int):
        self.page.get_by_test_id(f"add-to-cart-{product_id}").click()

    def open_cart(self):
        self.page.get_by_test_id("cart-button").click()

    def expect_product_visible(self, product_name: str):
        expect(self.page.get_by_text(product_name)).to_be_visible()

    def expect_cart_count(self, expected: int):
        expect(self.page.get_by_test_id("cart-count")).to_have_text(str(expected))
