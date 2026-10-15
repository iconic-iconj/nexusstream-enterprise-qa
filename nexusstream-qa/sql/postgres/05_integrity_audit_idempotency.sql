-- Potential orphan records (schema may not enforce foreign keys). Expected zero rows.
SELECT oi.id, oi.order_id FROM order_items oi LEFT JOIN orders o ON o.id = oi.order_id WHERE o.id IS NULL;
SELECT oi.id, oi.product_id FROM order_items oi LEFT JOIN products p ON p.id = oi.product_id WHERE p.id IS NULL;
SELECT o.id, o.user_id FROM orders o LEFT JOIN users u ON u.id = o.user_id WHERE u.id IS NULL;

-- Latest audit records; review messages for secrets/PII leakage.
SELECT id, level, message, timestamp FROM audit_logs ORDER BY timestamp DESC LIMIT 100;

-- Idempotency mapping. Expected: one key maps to the intended order.
SELECT key, order_id FROM idempotency_keys ORDER BY key;
