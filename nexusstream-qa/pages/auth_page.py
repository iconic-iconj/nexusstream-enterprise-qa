from playwright.sync_api import expect
from .base_page import BasePage


class AuthPage(BasePage):
    def open_login(self) -> None:
        self.open("/login")

    def register(self, name: str, email: str, password: str) -> None:
        self.by_test_id("auth-toggle").click()
        self.by_test_id("auth-name-input").fill(name)
        self.by_test_id("email-input").fill(email)
        self.by_test_id("password-input").fill(password)
        self.by_test_id("login-btn").click()
        expect(self.by_test_id("login-error")).to_contain_text("created. Please login.")

    def login(self, email: str, password: str) -> None:
        self.by_test_id("email-input").fill(email)
        self.by_test_id("password-input").fill(password)
        self.by_test_id("login-btn").click()
