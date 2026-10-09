# Phase 2 Execution Summary

## Overview
This phase validates the API and database behavior of NexusStream using the real application endpoints and database tables.

## In-scope endpoints
- `GET /api/health`
- `POST /api/auth/register`
- `POST /api/auth/login`
- `GET /api/products`
- `POST /api/orders`
- `GET /api/admin/logs`
- `GET /api/policy`

## Evidence to collect
- Postman request screenshots or exports
- SQL query output before and after API actions
- defect records with response status and expected/actual values

## Typical results
- Valid registration inserts user records
- Login returns JWT and session cookie
- Orders insert `orders` and `order_items` records
- Product stock decreases according to order quantity
- Audit log table captures operational actions

## Phase 2 completion criteria
- All core API endpoints are checked manually
- SQL verification confirms database consistency
- Defects are tracked with evidence
- Portfolio evidence is ready for future automation in Phase 3
