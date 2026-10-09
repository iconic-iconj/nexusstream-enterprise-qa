from playwright.sync_api import Page

from .base_page import BasePage


class HomePage(BasePage):
    def __init__(self, page: Page, base_url: str):
        super().__init__(page, base_url)

    def open_home(self):
        self.open("/")

    def open_shop(self):
        self.page.get_by_test_id("hero-shop-button").click()

    def open_login(self):
        self.page.get_by_test_id("hero-login-button").click()
