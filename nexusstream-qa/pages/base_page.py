from __future__ import annotations

import os
from playwright.sync_api import Locator, Page


class BasePage:
    def __init__(self, page: Page, base_url: str | None = None) -> None:
        self.page = page
        self.base_url = (base_url or os.getenv("BASE_URL", "http://localhost:3000")).rstrip("/")

    def open(self, path: str = "/") -> None:
        self.page.goto(f"{self.base_url}/{path.lstrip('/')}")

    def by_test_id(self, name: str) -> Locator:
        return self.page.locator(f'[data-testid="{name}"], [data-test="{name}"]')
