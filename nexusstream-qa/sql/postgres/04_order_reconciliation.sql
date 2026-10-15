-- Inspect persisted order and line items. Use an isolated test database.
SELECT o.id AS order_id, o.user_id, o.total_price, o.status,
       oi.product_id, oi.quantity, oi.price AS item_price,
       oi.quantity * oi.price AS line_total
FROM orders o JOIN order_items oi ON oi.order_id = o.id
ORDER BY o.id DESC;

-- Expected: zero rows if total_price must equal item subtotal and there are no tax/discount adjustments.
SELECT o.id AS order_id, o.total_price AS stored_total,
       SUM(oi.quantity * oi.price) AS calculated_total
FROM orders o JOIN order_items oi ON oi.order_id = o.id
GROUP BY o.id, o.total_price
HAVING ABS(o.total_price - SUM(oi.quantity * oi.price)) > 0.01;
