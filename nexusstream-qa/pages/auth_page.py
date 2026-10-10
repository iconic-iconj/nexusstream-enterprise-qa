# pages/auth_page.py
from playwright.sync_api import expect
from .base_page import BasePage

class AuthPage(BasePage):
    # __init__ removed because it perfectly inherits from BasePage out-of-the-box

    def register(self, name: str, email: str, password: str):
        self.get_by_test("auth-toggle").click()
        self.get_by_test("auth-name-input").fill(name)
        self.get_by_test("email-input").fill(email)
        self.get_by_test("password-input").fill(password)
        self.get_by_test("login-btn").click()
        expect(self.page.get_by_text("Acccount created. Please login.")).to_be_visible()

    def login(self, email: str, password: str):
        self.get_by_test("email-input").fill(email)
        self.get_by_test("password-input").fill(password)
        self.get_by_test("login-btn").click()
