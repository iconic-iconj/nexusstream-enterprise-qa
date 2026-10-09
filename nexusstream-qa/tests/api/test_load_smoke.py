import time

import requests


def test_product_page_loads_under_2_seconds(base_url):
    start = time.perf_counter()
    response = requests.get(f"{base_url}/api/products", timeout=10)
    elapsed = time.perf_counter() - start

    assert response.status_code == 200
    assert elapsed < 2.0
