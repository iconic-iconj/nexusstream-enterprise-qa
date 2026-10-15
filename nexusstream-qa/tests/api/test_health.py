
def test_health_endpoint_returns_operational_status(api):
    """Verify that the API health monitoring endpoint is operational."""
    response = api.get("/api/health")

    assert response.status_code == 200, response.text
    body = response.json()
    assert body.get("status") == "operational"
    assert isinstance(body.get("timestamp"), str) and body["timestamp"]
