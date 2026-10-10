
from schemas.api_schemas import is_success_response

def test_health_endpoint_returns_success(api):
    """Verify system health status responds with a successful status code."""
    response = api.get("/api/health")
    assert response.status_code == 200
    assert is_success_response(response.json())
