import uuid


def register_login(api, name, email, password="Password123!"):
    api.post("/api/auth/register", json={"name": name, "email": email, "password": password})
    login = api.post("/api/auth/login", json={"email": email, "password": password})
    return login.json()["token"]


def test_admin_logs_require_authorization(api):
    response = api.get("/api/admin/logs")
    assert response.status_code in {401, 403}


def test_admin_can_access_logs(api):
    email = f"admin.logs.{uuid.uuid4().hex[:8]}@example.com"
    token = register_login(api, "Admin User", email)
    response = api.get("/api/admin/logs", headers={"Authorization": f"Bearer {token}"})
    assert response.status_code == 200
    body = response.json()
    assert body["success"] is True
    assert isinstance(body["data"], list)
