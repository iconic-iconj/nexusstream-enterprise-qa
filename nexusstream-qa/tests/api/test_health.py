import pytest

from schemas.api_schemas import is_health_response


def test_health_endpoint_returns_success(api):
    response = api.get("/api/health")
    assert response.status_code == 200
    assert response.json()["success"] is True
