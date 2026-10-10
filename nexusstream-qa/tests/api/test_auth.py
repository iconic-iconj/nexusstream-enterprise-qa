# test_auth.py
import uuid
from schemas.api_schemas import is_user_response

def test_user_endpoint_enforces_authentication(api):
    """Verify unauthenticated profile access is strictly blocked."""
    assert api.get("/api/user").status_code == 401


def test_user_auth_and_profile_lifecycle(api):
    """Verify seamless registration, login, and authenticated profile retrieval."""
    unique_email = f"qa.{uuid.uuid4().hex[:8]}@example.com"
    payload = {"name": "QA User", "email": unique_email, "password": "Password123!"}
    assert api.post("/api/auth/register", json=payload).status_code == 200
    
    login_res = api.post("/api/auth/login", json={"email": unique_email, "password": "Password123!"})
    assert login_res.status_code == 200
    token = login_res.json().get("token")
    
    user_res = api.get("/api/user", headers={"Authorization": f"Bearer {token}"})
    assert user_res.status_code == 200
    assert is_user_response(user_res.json())
    assert user_res.json()["user"]["email"] == unique_email
