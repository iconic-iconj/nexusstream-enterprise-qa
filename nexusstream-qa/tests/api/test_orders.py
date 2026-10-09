import json
from pathlib import Path

import pytest

DATA_DIR = Path(__file__).resolve().parents[2] / "test-data"


def make_login(api, email="qa.order@example.com", password="Password123!"):
    api.post("/api/auth/register", json={"name": "Order User", "email": email, "password": password})
    login = api.post("/api/auth/login", json={"email": email, "password": password})
    return login.json()["token"]


def test_create_order_requires_authentication(api):
    payload = {"items": [{"id": 3, "quantity": 1, "price": 49.99}], "totalPrice": 49.99}
    response = api.post("/api/orders", json=payload)
    assert response.status_code in {401, 403}


def test_create_order_with_valid_data(api):
    email = "qa.order.valid@example.com"
    token = make_login(api, email=email)
    payload = {"items": [{"id": 3, "quantity": 1, "price": 49.99}], "totalPrice": 49.99}
    response = api.post("/api/orders", json=payload, headers={"Authorization": f"Bearer {token}"})
    assert response.status_code == 200
    body = response.json()
    assert body["success"] is True
    assert "orderId" in body


def test_create_order_rejects_insufficient_stock(api):
    email = "qa.order.stock@example.com"
    token = make_login(api, email=email)
    payload = {"items": [{"id": 1, "quantity": 999, "price": 2499.99}], "totalPrice": 2499.99}
    response = api.post("/api/orders", json=payload, headers={"Authorization": f"Bearer {token}"})
    assert response.status_code == 409
    assert response.json()["success"] is False
