# Risk Matrix — NexusStream

## 1. Purpose

Prioritize testing according to potential business impact, likelihood, and the need for evidence. Initial likelihood ratings are provisional and must be revised as testing and defect verification progress.

Risk priority is not the same as defect severity. A risk is a possible adverse outcome; a defect is a reproducible failure against an agreed requirement or contract.

## 2. Rating Definitions

### Likelihood
- **High:** likely to occur or already observed repeatedly in the tested context.
- **Medium:** plausible, but evidence is incomplete or occurrence is conditional.
- **Low:** unlikely in the current context based on available evidence.
- **Unknown:** insufficient evidence to rate.

### Impact
- **Critical:** potential unauthorized privileged-data access, unauthorized transactions, or serious integrity/security impact.
- **High:** material order, inventory, payment, authentication, or customer-trust impact.
- **Medium:** meaningful feature degradation with a workaround.
- **Low:** limited inconvenience or presentation issue.

## 3. Risk Register

| Risk ID | Risk | Likelihood | Impact | Risk level | Test priority | Linked requirements | Notes |
|---|---|---|---|---|---|---|---|
| RISK-001 | Regular user accesses administrative logs | High (observed in supplied evidence) | Critical | Critical | P0 | REQ-13 | Linked to confirmed DEF-001; retest after server-side role enforcement |
| RISK-002 | Anonymous user creates an order | High (observed in supplied evidence) | Critical | Critical | P0 | REQ-05; REQ-09; REQ-18 | Linked to confirmed DEF-002 |
| RISK-003 | Malformed email is accepted at registration | High (observed in supplied evidence) | High | High | P1 | REQ-01; REQ-17 | Linked to confirmed DEF-003 |
| RISK-004 | Order exceeds available stock | Medium | High | High | P0 | REQ-11 | Execute API and database checks with a recorded stock baseline |
| RISK-005 | Order total differs from trusted item prices | Medium | Critical | High pending validation | P0 | REQ-10; REQ-20 | Investigation only until reproduced and assessed against the intended contract |
| RISK-006 | Login or registration fails for valid users | Medium | High | High | P1 | REQ-01; REQ-03 | Test positive flows with unique data |
| RISK-007 | Session and role checks differ between endpoints | Medium | Critical | High pending validation | P0 | REQ-05; REQ-13; REQ-18 | Check API enforcement, not just frontend navigation |
| RISK-008 | Cart quantities or totals are incorrect | Medium | High | High | P1 | REQ-08; REQ-20 | Verify actual UI controls and pricing rules |
| RISK-009 | Payment failure or timeout leaves inconsistent order state | Medium | High | High | P0 | REQ-12 | Compare response, order state, and payment state where available |
| RISK-010 | Catalog response is malformed or incomplete | Low | Medium | Medium | P2 | REQ-06; REQ-07 | Confirm field-level contract |
| RISK-011 | Duplicate submission creates duplicate orders or stock deductions | Unknown | High | Unassessed | P1 | REQ-19 | Verify idempotency support and contract |
| RISK-012 | AI response is inaccurate, ungrounded, or unsafe | Unknown | High | Unassessed | P1 when implemented | REQ-16 | Conditional on a testable AI feature |

## 4. Priority Definitions

- **P0:** test first; a failure may compromise authorization, transaction integrity, or core order processing.
- **P1:** important functional, authentication, payment, or conditional AI behavior.
- **P2:** lower-risk catalog and presentation behavior.

## 5. Review Rules

1. Update likelihood and risk level when new evidence appears.
2. A designed test is not proof that a risk has occurred.
3. Confirmed defects must be recorded in `bug-reports.md`.
4. Do not lower a risk solely because a test was added; consider its execution result and retest evidence.
5. Unresolved critical defects require review before any release-readiness recommendation.
