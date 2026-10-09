# API Test Cases for NexusStream

## Test Case Overview
This document lists the core API checks for the actual NexusStream implementation.

## Authentication

### TC-API-01: Register with valid data
- Method: `POST`
- Endpoint: `/api/auth/register`
- Input: valid email, password length >= 6, name
- Expected: HTTP `200`, success flag true, user is created

### TC-API-02: Register with invalid email
- Method: `POST`
- Endpoint: `/api/auth/register`
- Input: malformed email
- Expected: HTTP `400`, validation error message

### TC-API-03: Register with short password
- Method: `POST`
- Endpoint: `/api/auth/register`
- Input: password shorter than 6 chars
- Expected: HTTP `400`, validation error message

### TC-API-04: Login with correct credentials
- Method: `POST`
- Endpoint: `/api/auth/login`
- Input: existing user email and password
- Expected: HTTP `200`, returns token and user object

### TC-API-05: Login with wrong password
- Method: `POST`
- Endpoint: `/api/auth/login`
- Input: valid email, wrong password
- Expected: HTTP `401`, invalid credentials

## Products

### TC-API-06: Get products list
- Method: `GET`
- Endpoint: `/api/products`
- Expected: HTTP `200`, data array returned

### TC-API-07: Filter products by category
- Method: `GET`
- Endpoint: `/api/products?category=Digital`
- Expected: HTTP `200`, only matching category returned

## Orders

### TC-API-08: Create valid order
- Method: `POST`
- Endpoint: `/api/orders`
- Authorization: valid token
- Input: valid order items and total price
- Expected: HTTP `200`, order created and orderId returned

### TC-API-09: Create order with insufficient stock
- Method: `POST`
- Endpoint: `/api/orders`
- Input: quantity exceeds current stock
- Expected: HTTP `409`, insufficient stock error

### TC-API-10: Create order without auth token
- Method: `POST`
- Endpoint: `/api/orders`
- Expected: HTTP `401`, unauthorized

## Admin and system

### TC-API-11: Get health status
- Method: `GET`
- Endpoint: `/api/health`
- Expected: HTTP `200`, operational status payload

### TC-API-12: Get policy info
- Method: `GET`
- Endpoint: `/api/policy`
- Expected: HTTP `200`, refund policy string

### TC-API-13: Get admin logs with auth
- Method: `GET`
- Endpoint: `/api/admin/logs`
- Authorization: valid token
- Expected: HTTP `200`, data array of log entries

### TC-API-14: Get admin logs without auth
- Method: `GET`
- Endpoint: `/api/admin/logs`
- Expected: HTTP `401`, unauthorized
