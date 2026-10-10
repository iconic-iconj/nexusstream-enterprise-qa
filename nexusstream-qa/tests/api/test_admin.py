
import pytest

def test_admin_logs_deny_unauthenticated(api):
    """Verify unauthenticated access to administrative logs is strictly blocked."""
    assert api.get("/api/admin/logs").status_code == 401

@pytest.mark.xfail(reason="BUG: Regular users can illegally access admin logs")
def test_admin_logs_deny_regular_user(user_api):
    """Verify standard users are forbidden from viewing admin data layers."""
    assert user_api.get("/api/admin/logs").status_code == 403

def test_admin_can_access_logs(admin_api):
    """Verify authenticated administrative roles can successfully pull log entries."""
    res = admin_api.get("/api/admin/logs")
    assert res.status_code == 200
    assert res.json().get("success") is True
