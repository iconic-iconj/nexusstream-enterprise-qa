# test_admin.py
import pytest

def test_admin_logs_deny_unauthenticated(api):
    assert api.get("/api/admin/logs").status_code == 401

@pytest.mark.xfail(reason="BUG: Regular users can illegally access admin logs")
def test_admin_logs_deny_regular_user(api, user_headers):
    assert api.get("/api/admin/logs", headers=user_headers).status_code == 403

def test_admin_can_access_logs(api, admin_headers):
    res = api.get("/api/admin/logs", headers=admin_headers)
    assert res.status_code == 200
    assert res.json().get("success") is True
