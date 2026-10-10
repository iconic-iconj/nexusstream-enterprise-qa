import os
from playwright.sync_api import Page


class BasePage:
    def __init__(self, page: Page, base_url: str | None = None):
        self.page = page
        self.base_url = base_url or os.getenv("BASE_URL", "http://localhost:3000")

    def open(self, path: str = "/"):
        self.page.goto(f"{self.base_url.rstrip('/')}{path}")

    def wait_for_url(self, path: str, timeout: int = 10000):
        self.page.wait_for_url(f"**{path}", timeout=timeout)

    def get_by_test(self, name: str):
        """Return a locator matching either data-testid or data-test attributes.
        Many app components use `data-test` while others use `data-testid`.
        This helper normalizes test locators for the page objects.
        """
        return self.page.locator(f'[data-testid="{name}"], [data-test="{name}"]')
