from schemas.api_schemas import is_user_response


def unique_email(prefix: str = "qa"):
    import uuid
    return f"{prefix}.{uuid.uuid4().hex[:8]}@example.com"


def test_register_with_valid_data(api):
    payload = {
        "name": "Automation User",
        "email": unique_email("register"),
        "password": "Password123!",
    }
    response = api.post("/api/auth/register", json=payload)
    assert response.status_code == 200
    assert response.json()["success"] is True


def test_register_rejects_duplicate_email(api):
    email = unique_email("duplicate")
    first = api.post("/api/auth/register", json={"name": "User One", "email": email, "password": "Password123!"})
    assert first.status_code == 200

    second = api.post("/api/auth/register", json={"name": "User Two", "email": email, "password": "Password123!"})
    assert second.status_code == 400
    assert second.json()["success"] is False


def test_login_with_valid_credentials(api):
    email = unique_email("login")
    api.post("/api/auth/register", json={"name": "Login User", "email": email, "password": "Password123!"})

    response = api.post("/api/auth/login", json={"email": email, "password": "Password123!"})
    assert response.status_code == 200
    assert response.json()["success"] is True
    assert "token" in response.json()


def test_current_user_requires_authentication(api):
    response = api.get("/api/user")
    assert response.status_code in {401, 403}


def test_current_user_returns_authenticated_user(api):
    email = unique_email("currentuser")
    register = api.post("/api/auth/register", json={"name": "Current User", "email": email, "password": "Password123!"})
    assert register.status_code == 200

    login = api.post("/api/auth/login", json={"email": email, "password": "Password123!"})
    token = login.json()["token"]

    response = api.get("/api/user", headers={"Authorization": f"Bearer {token}"})
    assert response.status_code == 200
    assert is_user_response(response.json())
    assert response.json()["user"]["email"] == email
