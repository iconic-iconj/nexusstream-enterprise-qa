# api_schemas.py
def is_success_response(p) -> bool: 
    return isinstance(p, dict) and p.get("success") is True

def is_user_response(p) -> bool:
    return is_success_response(p) and isinstance(p.get("user"), dict)

def is_product_list_response(p) -> bool:
    """Validates that the response contains a root 'data' list from the backend."""
    return isinstance(p, dict) and isinstance(p.get("data"), list)