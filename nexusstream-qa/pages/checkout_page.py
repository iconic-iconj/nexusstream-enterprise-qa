from playwright.sync_api import expect
from .base_page import BasePage


class CheckoutPage(BasePage):
    def continue_from_cart(self) -> None:
        self.by_test_id("checkout-step-1-next").click()

    def enter_shipping_address(self, address: str) -> None:
        self.by_test_id("checkout-address").fill(address)
        self.by_test_id("checkout-step-2-next").click()

    def enter_test_payment(self, name: str, number: str, expiry: str, cvc: str) -> None:
        self.by_test_id("checkout-card-name").fill(name)
        self.by_test_id("checkout-card-number").fill(number)
        self.by_test_id("checkout-expiry").fill(expiry)
        self.by_test_id("checkout-cvc").fill(cvc)

    def submit_order(self) -> None:
        self.by_test_id("checkout-complete").click()

    def expect_order_confirmed(self) -> None:
        expect(self.by_test_id("order-success")).to_be_visible()
