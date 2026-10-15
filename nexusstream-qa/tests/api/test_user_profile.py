

def test_user_endpoint_requires_authentication(api):
    """Verify that unauthenticated requests to the profile endpoint are blocked."""
    response = api.get("/api/user")
    assert response.status_code == 401, response.text


def test_authenticated_user_can_access_own_profile(user_api):
    """Verify that an authenticated user can successfully fetch their own profile details."""
    response = user_api.get("/api/user")

    assert response.status_code == 200, response.text
    body = response.json()
    
    assert body.get("success") is True
    assert "user" in body, "Profile response missing user object data block"
    assert isinstance(body["user"].get("email"), str), "User object profile email is missing or invalid string format"
