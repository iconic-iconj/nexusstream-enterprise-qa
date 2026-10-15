
from .base_page import BasePage


class HomePage(BasePage):
    def open_home(self) -> None:
        self.open("/")

    def open_shop(self) -> None:
        self.by_test_id("hero-shop-button").click()

    def open_login(self) -> None:
        self.by_test_id("hero-login-button").click()
