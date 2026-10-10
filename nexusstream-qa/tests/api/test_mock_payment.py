# test_payments.py
import pytest

@pytest.mark.parametrize("result, status_code, success", [
    ("success", 200, True),
    ("fail", 402, False),
    ("timeout", 504, False)
])
def test_mock_payment_scenarios(api, result, status_code, success):
    """Verify payment gateway handles various response states accurately."""
    res = api.post("/api/mock/payment", json={"result": result})
    assert res.status_code == status_code
    assert res.json().get("success") is success
