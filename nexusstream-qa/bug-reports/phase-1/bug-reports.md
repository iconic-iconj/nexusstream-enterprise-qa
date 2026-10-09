# NexusStream Phase 1 Bug Reports

## Overview
This file is intended to record the defects identified during Phase 1 QA testing for the NexusStream app.

Use this template for real defect records:

---

## Bug Report Template

**Bug ID:** NEX-001
**Title:** Short description of the defect
**Severity:** Critical / High / Medium / Low
**Priority:** Critical / High / Medium / Low
**Environment:** Local app, browser, OS, DB state
**Date Found:** YYYY-MM-DD
**Reported By:** QA Analyst / Candidate Name

### Summary
A short description of the issue and the impact on the user or business flow.

### Steps to Reproduce
1. Open the application
2. Navigate to the affected page or endpoint
3. Perform the exact action that triggers the issue
4. Record the actual result

### Expected Result
Describe the intended behavior.

### Actual Result
Describe the observed behavior.

### Screenshots / Evidence
Attach screenshots, terminal output, logs, or API response snippets.

### Impact
Explain the business or user impact.

### Status
Open / In Progress / Resolved / Closed

---

## Example bug entries

### NEX-001
**Title:** User can access protected checkout page without login
**Severity:** High
**Priority:** High

**Summary:** A user with no valid session can directly open `/checkout` and access the checkout workflow.

**Steps to Reproduce:**
1. Open the app in a new browser session.
2. Navigate directly to `/checkout`.
3. Observe the result.

**Expected Result:** The user should be redirected to `/login` and prevented from continuing.

**Actual Result:** The checkout page loads without authentication.

**Impact:** This is a security and authorization issue affecting protected functionality.

**Status:** Open

### NEX-002
**Title:** Duplicate registration email is accepted
**Severity:** High
**Priority:** High

**Summary:** The app allows the same email to be registered multiple times.

**Steps to Reproduce:**
1. Register a user with a valid email.
2. Attempt to register again with the same email.
3. Observe the response.

**Expected Result:** The registration should fail with a duplicate email error.

**Actual Result:** The second registration succeeds or behaves inconsistently.

**Impact:** User account integrity and data consistency are affected.

**Status:** Open

---

## Notes for portfolio use
- Keep defect records concise and evidence-based.
- Include actual reproduction steps and screenshots when possible.
- Link defects to the test cases in the Phase 1 CSV where relevant.
- Document only real findings found during testing.
