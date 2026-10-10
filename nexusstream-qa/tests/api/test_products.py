# test_products.py
from schemas.api_schemas import is_product_list_response

def test_get_products_returns_valid_structure(api):
    """Verify that fetching products succeeds and matches the backend data schema."""
    response = api.get("/api/products")
    assert response.status_code == 200
    assert is_product_list_response(response.json())


def test_create_product_requires_authentication(api):
    """Verify that unauthenticated product creation is strictly blocked."""
    payload = {"name": "Test Item", "price": 10.0, "category": "Digital", "stock": 5}
    assert api.post("/api/products", json=payload).status_code in {401, 403}
