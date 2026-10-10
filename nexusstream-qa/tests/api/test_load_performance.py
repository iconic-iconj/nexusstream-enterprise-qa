import time

def test_product_page_loads_under_4_seconds(api):
    """Verify the product list endpoint response latency is under 4 seconds."""
    start_time = time.perf_counter()
    res = api.get("/api/products", timeout=10)
    duration = time.perf_counter() - start_time
    
    assert res.status_code == 200
    assert duration < 4.0
