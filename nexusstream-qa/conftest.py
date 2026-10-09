import os

import pytest
from playwright.sync_api import sync_playwright

from clients.api_client import APIClient


@pytest.fixture(scope="session")
def base_url():
    return os.getenv("BASE_URL", "http://localhost:3000")


@pytest.fixture
def api(base_url):
    client = APIClient(base_url)
    yield client
    client.close()


@pytest.fixture(scope="session")
def browser():
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        yield browser
        browser.close()


@pytest.fixture
def page(browser):
    context = browser.new_context(viewport={"width": 1440, "height": 1200})
    page = context.new_page()
    yield page
    context.close()
