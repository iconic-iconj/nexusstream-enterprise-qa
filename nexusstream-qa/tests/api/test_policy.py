
from schemas.api_schemas import is_success_response

def test_policy_endpoint_returns_valid_structure(api):
    """Verify policy status returns successfully with expected string schema."""
    response = api.get("/api/policy")
    assert response.status_code == 200
    
    body = response.json()
    assert is_success_response(body)
    assert isinstance(body.get("policy"), str)
