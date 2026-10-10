
from schemas.api_schemas import is_user_response

def test_user_endpoint_enforces_authentication(api):
    """Verify unauthenticated profile access is strictly blocked."""
    assert api.get("/api/user").status_code == 401


def test_user_auth_and_profile_lifecycle(user_api):
    """Verify seamless registration, login, and authenticated profile retrieval."""
    response = user_api.get("/api/user")
    assert response.status_code == 200
    assert is_user_response(response.json())
    assert "@example.com" in response.json()["user"]["email"]
