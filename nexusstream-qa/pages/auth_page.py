from playwright.sync_api import Page, expect

from .base_page import BasePage


class AuthPage(BasePage):
    def __init__(self, page: Page, base_url: str | None = None):
        super().__init__(page, base_url)

    def switch_to_register(self):
        self.page.get_by_test_id("auth-toggle").click()

    def register(self, name: str, email: str, password: str):
        self.switch_to_register()
        self.page.get_by_test_id("auth-name-input").fill(name)
        self.page.get_by_test_id("email-input").fill(email)
        self.page.get_by_test_id("password-input").fill(password)
        self.page.get_by_test_id("login-btn").click()
        expect(self.page.get_by_text("Acccount created. Please login.")).to_be_visible()

    def login(self, email: str, password: str):
        self.page.get_by_test_id("email-input").fill(email)
        self.page.get_by_test_id("password-input").fill(password)
        self.page.get_by_test_id("login-btn").click()
