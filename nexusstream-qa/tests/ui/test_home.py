from typing import Any
import pytest
from playwright.sync_api import expect

pytestmark = [pytest.mark.ui, pytest.mark.smoke]


def test_homepage_displays_quality_engineering_content(pom: Any) -> None:
    pom.home.open_home()
    expect(pom.home.by_test_id("editorial-split")).to_be_visible()
    expect(pom.home.by_test_id("api-health-status")).to_be_visible()
    expect(pom.home.by_test_id("qa-pillars-section")).to_be_visible()
    expect(pom.home.by_test_id("testing-capabilities-section")).to_be_visible()


def test_homepage_health_status_becomes_operational(pom: Any) -> None:
    pom.home.open_home()
    status = pom.home.by_test_id("api-health-status")
    expect(status).to_have_attribute("data-status", "online", timeout=10000)


def test_homepage_loads_live_product_catalog(pom: Any) -> None:
    pom.home.open_home()
    expect(pom.home.by_test_id("product-grid")).to_be_visible(timeout=15000)
    expect(pom.store.product_cards.first).to_be_visible()
    expect(pom.home.by_test_id("product-count")).to_contain_text("Showing")
