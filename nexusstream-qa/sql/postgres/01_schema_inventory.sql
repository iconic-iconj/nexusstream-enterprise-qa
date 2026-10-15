
SELECT table_name FROM information_schema.tables WHERE table_schema = 'public' ORDER BY table_name;
SELECT table_name, column_name, data_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name IN ('users','products','orders','order_items','audit_logs','idempotency_keys') ORDER BY table_name, ordinal_position;
