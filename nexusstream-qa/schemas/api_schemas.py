def is_success_response(payload):
    return isinstance(payload, dict) and payload.get("success") is True


def is_error_response(payload):
    return isinstance(payload, dict) and payload.get("success") is False


def is_health_response(payload):
    return (
        isinstance(payload, dict)
        and payload.get("success") is True
        and isinstance(payload.get("status"), str)
        and isinstance(payload.get("timestamp"), str)
    )


def is_product_list_response(payload):
    return isinstance(payload, dict) and isinstance(payload.get("data"), list)


def is_user_response(payload):
    return (
        isinstance(payload, dict)
        and payload.get("success") is True
        and isinstance(payload.get("user"), dict)
    )
