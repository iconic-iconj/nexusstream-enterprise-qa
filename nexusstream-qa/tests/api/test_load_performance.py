

def test_product_page_loads_under_4_seconds(api):
    """Verify the product list endpoint response latency is under 4 seconds."""
    res = api.get("/api/products", timeout=10)
    assert res.status_code == 200
    assert res.elapsed.total_seconds() < 4.0
