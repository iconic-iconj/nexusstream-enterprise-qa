import pytest

@pytest.mark.parametrize("api_fixture, expected_status",[
        ("api", 401), pytest.param( "user_api", 403, 
            marks=[
                pytest.mark.known_bug, 
                pytest.mark.xfail(strict=False, reason="Defect: /api/admin/logs lacks visible role check")
            ]),]
)
def test_admin_logs_access_restrictions(request, api_fixture, expected_status):
    """Validate that unauthenticated and non-admin users cannot access admin logs."""
    api_client = request.getfixturevalue(api_fixture)
    response = api_client.get("/api/admin/logs")
    assert response.status_code == expected_status, response.text
