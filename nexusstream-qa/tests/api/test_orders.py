import uuid
import pytest


@pytest.mark.known_bug
@pytest.mark.xfail(strict=False, reason="Defect: /api/orders endpoint accepts anonymous requests without a valid token")
def test_create_order_requires_authentication(api, created_product):
    """Verify that unauthenticated users are blocked from creating orders."""
    payload = {
        "items": [{"id": created_product["id"], "price": created_product["price"], "quantity": 1}],
        "totalPrice": created_product["price"]
    }
    response = api.post("/api/orders", json=payload)
    assert response.status_code == 401, response.text


def test_create_order_rejects_insufficient_stock(user_api, created_product):
    """Verify order rejection when requested quantity exceeds stock limitations."""
    # created_product['stock'] comes dynamically from your valid_product template (value: 5)
    invalid_quantity = created_product["stock"] + 1
    payload = {
        "items": [{"id": created_product["id"], "price": created_product["price"], "quantity": invalid_quantity}],
        "totalPrice": created_product["price"] * invalid_quantity
    }
    
    response = user_api.post("/api/orders", json=payload)
    assert response.status_code == 409, response.text
    
    body = response.json()
    assert body.get("success") is False
    assert body.get("error") == "Insufficient stock"


def test_idempotency_key_returns_same_order_id(user_api, created_product):
    """Verify that duplicate submissions with the same idempotency key return the original order."""
    key = f"pytest-idempotency-{uuid.uuid4().hex}"
    payload = {
        "items": [{"id": created_product["id"], "price": created_product["price"], "quantity": 1}],
        "totalPrice": created_product["price"]
    }

    first = user_api.post("/api/orders", json=payload, headers={"Idempotency-Key": key})
    assert first.status_code == 200, first.text
    first_id = first.json().get("orderId")
    assert first_id, "Response missing orderId"

    second = user_api.post("/api/orders", json=payload, headers={"Idempotency-Key": key})
    assert second.status_code == 200, second.text
    assert second.json().get("orderId") == first_id


def test_successful_order_decrements_inventory(user_api, created_product):
    """Verify happy-path order placement and accurate stock decrement tracking."""
    quantity = 2
    payload = {
        "items": [{"id": created_product["id"], "price": created_product["price"], "quantity": quantity}],
        "totalPrice": created_product["price"] * quantity
    }
    
    order_res = user_api.post("/api/orders", json=payload)
    assert order_res.status_code == 200, order_res.text
    assert "orderId" in order_res.json()

    products_res = user_api.get("/api/products")
    assert products_res.status_code == 200, products_res.text
    
    # Clean dictionary matching over the catalog payload
    products = products_res.json().get("data", [])
    persisted_product = next((item for item in products if item.get("id") == created_product["id"]), None)
    
    assert persisted_product, f"Product {created_product['id']} missing from catalog after placement"
    assert persisted_product.get("stock") == created_product["stock"] - quantity
