# pages/home_page.py
from .base_page import BasePage

class HomePage(BasePage):

    def open_home(self):
        self.open("/")
        self.page.wait_for_load_state("domcontentloaded")

    def open_shop(self):
        self.get_by_test("hero-shop-button").click()

    def open_login(self):
        self.get_by_test("hero-login-button").click()
