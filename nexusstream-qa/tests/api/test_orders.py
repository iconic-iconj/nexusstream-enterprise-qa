# test_orders.py
import json
from pathlib import Path

# Load test data directly at module level
PRODUCTS_DATA = json.loads((Path(__file__).resolve().parents[2] / "test-data" / "products.json").read_text())
VALID_ITEM = PRODUCTS_DATA["valid_order_item"]
OVERSTOCK_ITEM = PRODUCTS_DATA["invalid_stock_order_item"]


def test_create_order_requires_authentication(api):
    """Verify unauthenticated order placement is blocked."""
    payload = {"items": [VALID_ITEM], "totalPrice": VALID_ITEM["price"]}
    assert api.post("/api/orders", json=payload).status_code == 401


def test_order_placement_and_stock_validation(user_api):
    """Verify standard order creation flow and stock limit boundary checks."""
    valid_payload = {"items": [VALID_ITEM], "totalPrice": VALID_ITEM["price"]}
    res = user_api.post("/api/orders", json=valid_payload)
    assert res.status_code == 200
    assert res.json().get("success") is True
    assert "orderId" in res.json()

    
    invalid_payload = {"items": [OVERSTOCK_ITEM], "totalPrice": OVERSTOCK_ITEM["price"]}
    fail_res = user_api.post("/api/orders", json=invalid_payload)
    assert fail_res.status_code == 409
    assert fail_res.json().get("success") is False
