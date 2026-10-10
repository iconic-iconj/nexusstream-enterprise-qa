# pages/checkout_page.py
import sqlite3
from pathlib import Path
from playwright.sync_api import expect
from .base_page import BasePage

class CheckoutPage(BasePage):

    def fill_step_one(self):
        self.get_by_test("checkout-step-1-next").click()

    def fill_shipping_address(self, address: str):
        self.get_by_test("checkout-address").fill(address)
        self.get_by_test("checkout-step-2-next").click()

    def fill_payment(self, name: str, number: str, expiry: str, cvc: str):
        self.get_by_test("checkout-card-name").fill(name)
        self.get_by_test("checkout-card-number").fill(number)
        self.get_by_test("checkout-expiry").fill(expiry)
        self.get_by_test("checkout-cvc").fill(cvc)
        self.get_by_test("checkout-complete").click()

    def expect_order_confirmed(self):
        expect(self.get_by_test("order-success")).to_be_visible()

    def latest_order_for_email(self, email: str):
        db_path = Path(__file__).resolve().parents[2] / "nexusstream-app" / "nexusstream.db"
        with sqlite3.connect(db_path) as conn:
            row = conn.execute(
                "SELECT o.id, o.user_id, o.total_price FROM orders o JOIN users u ON u.id = o.user_id WHERE u.email = ? ORDER BY o.id DESC LIMIT 1",
                (email,)
            ).fetchone()

            if not row: return None

            item = conn.execute("SELECT product_id, quantity, price FROM order_items WHERE order_id = ?", (row[0],)).fetchone()
            total_price = row[2] if row[2] is not None else 0.0
            return {
                "order_id": row[0], "user_id": row[1], "total_price": float(total_price),
                "product_id": item[0] if item else None, "quantity": item[1] if item else None, "item_price": float(item[2]) if item and item[2] is not None else None
            }
