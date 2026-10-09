def test_mock_payment_success_scenario(api):
    response = api.post("/api/mock/payment", json={"result": "success"})
    assert response.status_code == 200
    body = response.json()
    assert body["success"] is True
    assert "transaction_id" in body


def test_mock_payment_failure_scenario(api):
    response = api.post("/api/mock/payment", json={"result": "fail"})
    assert response.status_code == 402
    assert response.json()["success"] is False


def test_mock_payment_timeout_scenario(api):
    response = api.post("/api/mock/payment", json={"result": "timeout"})
    assert response.status_code == 504
    assert response.json()["success"] is False
