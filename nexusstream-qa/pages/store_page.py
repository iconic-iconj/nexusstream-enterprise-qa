# pages/store_page.py
from playwright.sync_api import expect
from .base_page import BasePage

class StorePage(BasePage):

    def search(self, value: str):
        self.get_by_test("shop-search").fill(value)

    def filter_by_category(self, category: str):
        self.get_by_test(f"filter-{category.lower()}").click()

    def add_product_to_cart(self, product_id: int):
        self.get_by_test(f"add-to-cart-{product_id}").click()

    def open_cart(self):
        self.get_by_test("cart-button").click()

    def expect_product_visible(self, product_name: str):
        expect(self.page.get_by_text(product_name)).to_be_visible()

    def expect_cart_count(self, expected: int):
        expect(self.get_by_test("cart-count")).to_have_text(str(expected))
