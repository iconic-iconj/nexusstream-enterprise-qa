from playwright.sync_api import Page

from .base_page import BasePage


class HomePage(BasePage):
    def __init__(self, page: Page, base_url: str):
        super().__init__(page, base_url)

    def open_home(self):
        self.open("/")
        # wait for the initial page load/network to settle before interacting
        try:
            self.page.wait_for_load_state("networkidle", timeout=45000)
        except Exception:
            # fallback: a short sleep if networkidle isn't reached
            self.page.wait_for_timeout(1000)

    def open_shop(self):
        self.page.get_by_test_id("hero-shop-button").click()

    def open_login(self):
        # ensure the hero login button is visible before clicking
        self.page.get_by_test_id("hero-login-button").wait_for(state="visible", timeout=45000)
        self.page.get_by_test_id("hero-login-button").click()
