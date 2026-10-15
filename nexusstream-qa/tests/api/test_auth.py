import uuid
import pytest


def test_register_valid_user(register_user_api):
    """Verify that a unique user can be successfully registered."""
    response = register_user_api()
    
    assert response.status_code == 200, response.text
    body = response.json()
    assert body.get("success") is True or body.get("message") == "User created"


@pytest.mark.xfail(reason="BUG: Backend lacks validation; accepts structurally invalid email strings", strict=True)
def test_registration_rejects_invalid_emails(api, test_data, register_user_api):
    """Verify registration validation blocks poorly formatted email strings."""
    for email in test_data["users"]["invalid_emails"]:
        response = register_user_api(email=email)
        assert response.status_code == 400


def test_registration_rejects_missing_password(api, test_data):
    """Verify registration fails when mandatory password criteria are absent."""
    payload = dict(test_data["users"]["missing_password"])
    payload["email"] = f"missing.pass.{uuid.uuid4().hex}@example.com"
    
    response = api.post("/api/auth/register", json=payload)
    assert response.status_code == 400


def test_login_rejects_invalid_credentials(api):
    """Verify that unauthorized logins are gracefully blocked with status 401."""
    payload = {"email": f"unknown.{uuid.uuid4().hex}@example.com", "password": "WrongPassword123!"}
    
    response = api.post("/api/auth/login", json=payload)
    assert response.status_code == 401
