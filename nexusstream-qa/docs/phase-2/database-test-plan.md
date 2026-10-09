# Database Testing Plan

## Objective
Validate that the API behavior reflects correct persistence in the database, especially for registration, order creation, inventory changes, and audit logging.

## Database objects in scope
- `users`
- `products`
- `orders`
- `order_items`
- `audit_logs`
- `idempotency_keys`

## Verification focus
1. User creation writes a database row.
2. Login checks the stored hashed password.
3. Orders create a new `orders` record and corresponding `order_items` rows.
4. Product stock is reduced after a valid order.
5. Audit logs capture login, registration, order, and system events.
6. Repeated orders with the same idempotency key do not create duplicates.

## Validation approach
- Use SQL queries to inspect the final state after API requests.
- Compare database state to expected business rules.
- Reproduce defects by running the same operations and checking records.

## Example checks
- Count users before and after registration.
- Check the latest product stock levels.
- Join orders to users and order_items to confirm associated records.
- Inspect audit logs for user activity and order events.

## Key risks
- stock not decremented after order creation
- duplicate order entries from retried requests
- missing audit records for key lifecycle events
- incorrect user/role association in order records
