# Test Scenarios — NexusStream

## 1. Purpose

This document defines high-level testing scenarios. Detailed preconditions, data, steps, expected results, execution status, evidence, and defect references belong in `test-cases.csv`.

## 2. Authentication and Registration

| Scenario ID | Scenario | Coverage | Related requirements | Test cases |
|---|---|---|---|---|
| AUTH-01 | Register with valid details | Positive | REQ-01 | TC-001 |
| AUTH-02 | Reject duplicate email registration | Negative / integrity | REQ-02 | TC-002 |
| AUTH-03 | Log in with valid credentials | Positive | REQ-03 | TC-003 |
| AUTH-04 | Reject invalid credentials | Negative | REQ-04 | TC-004 |
| AUTH-05 | Verify session persistence and logout | Functional / security | REQ-03 | Add a case after confirming session contract |
| AUTH-06 | Reject unauthenticated protected requests | Security | REQ-05 | TC-005; TC-013 |
| AUTH-07 | Reject malformed email registration | Negative / boundary | REQ-17 | TC-019 |
| AUTH-08 | Validate documented password boundaries | Boundary | REQ-01 | TC-020 |

## 3. Product Catalog

| Scenario ID | Scenario | Coverage | Related requirements | Test cases |
|---|---|---|---|---|
| SHOP-01 | Retrieve product catalog | Positive / contract | REQ-06 | TC-008 |
| SHOP-02 | Validate required product fields and types | Contract | REQ-06 | TC-009 |
| SHOP-03 | Verify product/category filtering when implemented | Functional | REQ-07 | TC-009 or a dedicated case if needed |
| SHOP-04 | Handle empty or unavailable catalog responses | Negative / resilience | REQ-06 | Add after confirming expected error contract |
| SHOP-05 | Browse storefront and search for an available product | UI | REQ-06 | Link to the existing UI automation test |

## 4. Cart and Checkout

| Scenario ID | Scenario | Coverage | Related requirements | Test cases |
|---|---|---|---|---|
| CART-01 | Add an available product to the cart | Positive / UI | REQ-08 | TC-010 |
| CART-02 | Change quantity and recalculate totals | Functional / calculation | REQ-08; REQ-20 | TC-011 |
| CART-03 | Reject or safely handle invalid quantities | Negative / boundary | REQ-08 | TC-012 |
| CART-04 | Remove a product and recalculate cart totals | Functional / UI | REQ-08 | Add if not already covered by an existing case |
| ORDER-01 | Reject checkout/order creation without authentication | Security | REQ-05; REQ-09; REQ-18 | TC-013 |
| ORDER-02 | Create a valid order | Positive / integration | REQ-10; REQ-20 | TC-014; TC-028 |
| ORDER-03 | Reject an order above available stock | Boundary / integrity | REQ-11 | TC-015; TC-029 |
| ORDER-04 | Verify successful inventory decrement | Integration | REQ-11 | TC-016; TC-028 |
| ORDER-05 | Verify repeated submission/idempotency behavior | Negative / integration | REQ-19 | TC-030 |
| ORDER-06 | Handle payment failure and timeout | Negative / integration | REQ-12 | TC-017; TC-018 |
| ORDER-07 | Verify end-to-end registration/login and checkout | UI / end-to-end | REQ-03; REQ-10 | Link to the existing UI E2E test |

## 5. Authorization and Security

| Scenario ID | Scenario | Coverage | Related requirements | Test cases |
|---|---|---|---|---|
| SEC-01 | Reject unauthenticated access to protected profile | Authentication | REQ-05 | TC-005 |
| SEC-02 | Reject regular-user access to administrative logs | Authorization | REQ-13 | TC-006 |
| SEC-03 | Allow a real authorized administrator to access logs | Authorization positive | REQ-13 | TC-007 |
| SEC-04 | Ensure unauthorized responses do not disclose privileged data | Security / data exposure | REQ-13; REQ-14 | TC-006; TC-021 |
| SEC-05 | Verify role checks are enforced server-side | Security | REQ-13 | TC-006; TC-007 |
| SEC-06 | Verify invalid or expired token behavior | Authentication | REQ-05 | Add after confirming token contract |

## 6. Database and API Integration

| Scenario ID | Scenario | Coverage | Related requirements | Test cases |
|---|---|---|---|---|
| DB-01 | Verify successful order persistence | Integration | REQ-10 | TC-028 |
| DB-02 | Reconcile order total against item prices and quantities | Data integrity | REQ-10; REQ-20 | TC-028; INT-06 |
| DB-03 | Verify inventory changes exactly as expected | Data integrity | REQ-11 | TC-016; TC-028 |
| DB-04 | Verify rejected over-stock order has no invalid side effects | Negative / integrity | REQ-11 | TC-029 |
| DB-05 | Verify required audit event behavior | Integration | REQ-14 | TC-021 |
| DB-06 | Verify idempotency mapping and one-time stock change | Integration | REQ-19 | TC-030 |

## 7. Operations

| Scenario ID | Scenario | Coverage | Related requirements | Test cases |
|---|---|---|---|---|
| OPS-01 | Validate health endpoint response | Smoke / contract | REQ-15 | TC-027 |
| OPS-02 | Verify behavior when a dependency is unavailable | Resilience | Confirm relevant requirement first | Add after defining expected behavior |

## 8. AI Quality — Conditional

These scenarios are not applicable until an AI feature, interface, and expected behavior are defined.

| Scenario ID | Scenario | Coverage | Related requirements | Test cases |
|---|---|---|---|---|
| AI-01 | Evaluate factual correctness against known facts | Quality | REQ-16 | TC-022 |
| AI-02 | Evaluate grounding in supplied/retrieved context | Quality | REQ-16 | TC-023 |
| AI-03 | Verify abstention for unanswerable questions where required | Quality / safety | REQ-16 | TC-023 |
| AI-04 | Test prompt-injection attempts | Security | REQ-16 | TC-024 |
| AI-05 | Test sensitive-data disclosure boundaries | Security / privacy | REQ-16 | TC-025 |
| AI-06 | Verify policy and refusal behavior | Safety | REQ-16 | Add or link to TC-024/TC-025 as the contract requires |
| AI-07 | Verify tool-use authorization and action results | Integration / security | REQ-16 | TC-026 |

## 9. Execution Rules

- Every detailed test case must link to at least one requirement and scenario.
- Record actual status and evidence only after execution.
- A missing feature is not a pass; mark it Not Applicable or Blocked with a reason.
- Add new cases only when existing cases do not adequately cover the requirement.
- Keep the scenario catalog high-level; avoid duplicating detailed test steps here.
