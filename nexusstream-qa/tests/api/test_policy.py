def test_policy_endpoint_returns_success(api):
    response = api.get("/api/policy")
    assert response.status_code == 200
    assert response.json()["success"] is True


def test_policy_endpoint_returns_expected_structure(api):
    response = api.get("/api/policy")
    assert response.status_code == 200
    payload = response.json()
    assert "policy" in payload
    assert isinstance(payload["policy"], str)
