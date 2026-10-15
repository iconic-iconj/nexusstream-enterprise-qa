import pytest

@pytest.mark.parametrize("result, expected_status, expected_success, response_field",
    [
        pytest.param("success", 200, True, "transaction_id", id="payment-success"),
        pytest.param("fail", 402, False, "error", id="payment-declined"),
        pytest.param("timeout", 504, False, "error", id="payment-timeout"),
    ],
)
def test_mock_payment_scenarios(api, result, expected_status, expected_success, response_field):
    """Verify system handling of varied downstream payment gateway response statuses."""
    # Provide a 20-second timeout override only for the intentional slow mock scenario
    timeout = 20 if result == "timeout" else None
    response = api.post("/api/mock/payment", json={"result": result}, timeout=timeout)

    assert response.status_code == expected_status, response.text
    body = response.json()
    assert body.get("success") is expected_success
    assert isinstance(body.get(response_field), str) and body[response_field]
