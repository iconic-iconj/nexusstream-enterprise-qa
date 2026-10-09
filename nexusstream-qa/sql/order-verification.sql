-- Phase 2: API and database verification for NexusStream
-- Validate that API behavior creates the expected records in the database.

SELECT *
FROM users
ORDER BY id DESC;

SELECT *
FROM products
ORDER BY id ASC;

SELECT *
FROM orders
ORDER BY created_at DESC;

SELECT *
FROM order_items
ORDER BY id DESC;

SELECT *
FROM audit_logs
ORDER BY timestamp DESC
LIMIT 50;

-- Latest order tied to a user
SELECT u.id AS user_id,
       u.name,
       u.email,
       o.id AS order_id,
       o.total_price,
       o.status,
       o.created_at
FROM orders o
LEFT JOIN users u ON u.id = o.user_id
ORDER BY o.created_at DESC
LIMIT 10;

-- Order items joined to product names
SELECT o.id AS order_id,
       oi.id AS order_item_id,
       oi.product_id,
       p.name AS product_name,
       oi.quantity,
       oi.price
FROM orders o
LEFT JOIN order_items oi ON oi.order_id = o.id
LEFT JOIN products p ON p.id = oi.product_id
ORDER BY o.created_at DESC;

-- Stock validation after order placement
SELECT p.id,
       p.name,
       p.category,
       p.stock
FROM products p
ORDER BY p.id;

-- Recent system events
SELECT level,
       message,
       timestamp
FROM audit_logs
ORDER BY timestamp DESC
LIMIT 20;

-- Quick business rule check for negative stock
SELECT p.id,
       p.name,
       p.stock,
       CASE
         WHEN p.stock < 0 THEN 'STOCK_ERROR'
         ELSE 'OK'
       END AS stock_status
FROM products p
WHERE p.stock < 0;
