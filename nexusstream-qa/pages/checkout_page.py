import sqlite3
from pathlib import Path

from playwright.sync_api import Page, expect

from .base_page import BasePage


class CheckoutPage(BasePage):
    def __init__(self, page: Page, base_url: str):
        super().__init__(page, base_url)

    def fill_step_one(self):
        self.page.get_by_test_id("checkout-step-1-next").click()

    def fill_shipping_address(self, address: str):
        self.page.get_by_test_id("checkout-address").fill(address)
        self.page.get_by_test_id("checkout-step-2-next").click()

    def fill_payment(self, name: str, number: str, expiry: str, cvc: str):
        self.page.get_by_test_id("checkout-card-name").fill(name)
        self.page.get_by_test_id("checkout-card-number").fill(number)
        self.page.get_by_test_id("checkout-expiry").fill(expiry)
        self.page.get_by_test_id("checkout-cvc").fill(cvc)
        self.page.get_by_test_id("checkout-complete").click()

    def expect_order_confirmed(self):
        expect(self.page.get_by_test_id("order-success")).to_be_visible()

    def latest_order_for_email(self, email: str):
        db_path = Path(__file__).resolve().parents[2] / "nexusstream-app" / "nexusstream.db"
        with sqlite3.connect(db_path) as conn:
            row = conn.execute(
                """
                SELECT o.id, o.user_id, o.total_price
                FROM orders o
                JOIN users u ON u.id = o.user_id
                WHERE u.email = ?
                ORDER BY o.id DESC
                LIMIT 1
                """,
                (email,),
            ).fetchone()

            if row is None:
                return None

            item = conn.execute(
                "SELECT product_id, quantity, price FROM order_items WHERE order_id = ?",
                (row[0],),
            ).fetchone()

            return {
                "order_id": row[0],
                "user_id": row[1],
                "total_price": float(row[2]),
                "product_id": item[0] if item else None,
                "quantity": item[1] if item else None,
                "item_price": float(item[2]) if item else None,
            }
