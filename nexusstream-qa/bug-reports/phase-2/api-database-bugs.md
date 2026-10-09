# Phase 2 API and Database Bug Log

## Purpose
This file tracks API and database defects identified during Phase 2 testing. It is intended to capture reproducible evidence and expected behavior.

## Bug Template
- ID:
- Title:
- Severity:
- Endpoint or SQL area:
- Preconditions:
- Steps to reproduce:
- Expected result:
- Actual result:
- Evidence:
- Status:

## Example entries

### BUG-P2-001: order created without expected stock decrement
- Severity: Critical
- Endpoint: `POST /api/orders`
- Preconditions: product stock is known and user is authenticated
- Steps:
  1. Create a valid order for a product with quantity 1.
  2. Query stock immediately after response.
- Expected: stock decreases by the purchased quantity.
- Actual: stock remains unchanged or mismatches order quantity.
- Evidence: query result shows product stock value did not change.
- Status: Open

### BUG-P2-002: unauthorized admin log access
- Severity: High
- Endpoint: `GET /api/admin/logs`
- Preconditions: no bearer token or valid session cookie
- Steps:
  1. Send request without auth header.
- Expected: HTTP 401 unauthorized.
- Actual: request may be accepted or returns unexpected payload.
- Evidence: API response status and body captured in Postman.
- Status: Open
