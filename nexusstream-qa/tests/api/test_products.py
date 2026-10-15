import pytest


def test_get_products_returns_list_response(api):
    """Verify that fetching the product catalog returns a successful list structure."""
    response = api.get("/api/products")
    assert response.status_code == 200, response.text
    
    body = response.json()
    assert isinstance(body.get("data"), list), "Expected product catalog data field to be a list"


def test_create_product_requires_authentication(api, test_data):
    """Verify that unauthenticated users are blocked from publishing products."""
    response = api.post("/api/products", json=test_data["valid_product"])
    assert response.status_code == 401, response.text


@pytest.mark.parametrize(
    "case",
    # Using python's json.load structures natively inside the parameters
    # via a helper loop or directly calling data elements
    pytest.importorskip("json").loads(
        open("test-data/api_cases.json", encoding="utf-8").read()
    )["invalid_products"],
    ids=lambda case: case["name"].lower().replace(" ", "-")
)
def test_create_product_rejects_invalid_price(user_api, case):
    """Verify backend business constraints and rejection of invalid product pricing."""
    response = user_api.post("/api/products", json=case["payload"])

    assert response.status_code == 400, f"{case['name']}: {response.text}"
    assert response.json().get("success") is False


def test_authenticated_user_can_create_product(created_product):
    """Verify that a registered user can successfully create a new catalog item."""
    # Leverages your conftest.py created_product fixture instantly removing 6 lines of setup
    assert isinstance(created_product.get("id"), int), "Expected newly created product ID to be an integer"
