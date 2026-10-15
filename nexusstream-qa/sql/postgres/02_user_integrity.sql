-- Replace the email with a synthetic test account. Never select password hashes.
SELECT id, email, name, role, created_at FROM users WHERE email = 'qa.portfolio.user@example.test';

-- Expected: no rows.
SELECT email, COUNT(*) AS record_count FROM users GROUP BY email HAVING COUNT(*) > 1;
