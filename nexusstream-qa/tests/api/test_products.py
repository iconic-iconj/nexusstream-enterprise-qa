from schemas.api_schemas import is_product_list_response


def test_get_products_returns_success(api):
    response = api.get("/api/products")
    assert response.status_code == 200
    assert response.json()["data"]


def test_get_products_requires_authorization_for_create(api):
    payload = {
        "name": "Unauthorized Product",
        "description": "Should fail without auth",
        "price": 10.0,
        "category": "Digital",
        "stock": 5,
        "image_url": "https://example.com/test.jpg",
    }
    response = api.post("/api/products", json=payload)
    assert response.status_code in {401, 403}


def test_get_products_returns_expected_structure(api):
    response = api.get("/api/products")
    assert response.status_code == 200
    assert is_product_list_response(response.json())
