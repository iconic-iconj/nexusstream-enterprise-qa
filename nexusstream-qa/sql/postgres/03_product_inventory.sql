-- Product baseline and inventory anomalies
SELECT id, name, price, stock, category FROM products ORDER BY id;

-- Expected: zero rows when negative prices and stock are prohibited.
SELECT id, name, price, stock FROM products WHERE price < 0 OR stock < 0;
