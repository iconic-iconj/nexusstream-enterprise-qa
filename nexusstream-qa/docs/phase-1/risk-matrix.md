
# NexusStream Risk Matrix

## 1. Risk Model
Testing priority is evaluated using the standard industry risk formula:

> **Risk = Probability × Impact**

### Probability
| Rating | Meaning | Description |
| :---: | :--- | :--- |
| **1** | Rare | Highly unlikely to occur during normal use. |
| **2** | Unlikely | Not expected to occur, but possible under specific conditions. |
| **3** | Possible | Might occur occasionally. |
| **4** | Likely | Expected to occur frequently. |
| **5** | Very likely | Almost certain to occur. |

### Impact
| Rating | Meaning | Description |
| :---: | :--- | :--- |
| **1** | Minimal | Negligible impact on the user or system. |
| **2** | Low | Minor inconvenience; workaround available. |
| **3** | Moderate | Noticeable degradation of service; partial feature failure. |
| **4** | High | Significant business impact; major feature failure. |
| **5** | Critical | Catastrophic failure; data loss, security breach, or system crash. |

---

## 2. Risk Register

| Risk ID | Area | Risk Description | Probability | Impact | Priority |
| :--- | :--- | :--- | :---: | :---: | :--- |
| **RISK-001** | Authentication | Users cannot authenticate with valid credentials | 3 | 5 | **Critical** |
| **RISK-002** | Authentication | Invalid credentials create an authenticated session | 2 | 5 | **Critical** |
| **RISK-003** | Session | Logged-out users retain access to protected resources | 3 | 5 | **Critical** |
| **RISK-004** | Authorization | Customer accesses admin functionality | 2 | 5 | **Critical** |
| **RISK-005** | Authorization | User accesses another user's data | 3 | 5 | **Critical** |
| **RISK-006** | Cart | Incorrect quantity calculations affect checkout | 3 | 5 | **Critical** |
| **RISK-007** | Cart | Cart total is calculated incorrectly | 3 | 5 | **Critical** |
| **RISK-008** | Checkout | Valid checkout fails | 3 | 5 | **Critical** |
| **RISK-009** | Checkout | Failed payment creates completed order | 2 | 5 | **Critical** |
| **RISK-010** | Checkout | Duplicate checkout creates duplicate order | 3 | 5 | **Critical** |
| **RISK-011** | Orders | Order contains incorrect products or quantities | 3 | 5 | **Critical** |
| **RISK-012** | Orders | Order total does not match checkout | 3 | 5 | **Critical** |
| **RISK-013** | Products | Unavailable product can be purchased | 2 | 5 | **Critical** |
| **RISK-014** | API | Unauthorized API request succeeds | 2 | 5 | **Critical** |
| **RISK-015** | API | API exposes unauthorized user data | 2 | 5 | **Critical** |
| **RISK-016** | Search | Search returns incorrect results | 3 | 3 | Medium |
| **RISK-017** | Registration | Duplicate account can be created | 3 | 4 | High |
| **RISK-018** | Registration | Invalid input is accepted | 3 | 3 | Medium |
| **RISK-019** | Product | Incorrect product price is displayed | 2 | 4 | High |
| **RISK-020** | Product | UI product data differs from API | 3 | 4 | High |

---

## 3. Risk-Based Test Priority

### 🔴 Critical
*Execute first. These areas pose the highest risk to business operations and security:*
* Authentication & Authorization
* Session security
* Checkout & Payment
* Order creation & Order ownership
* Cart totals
* API authorization
* Data integrity

### 🟠 High
*Execute after critical coverage is established:*
* Registration validation
* Product pricing & availability
* Search
* Order details
* Cart persistence
* API response validation

### 🟡 Medium
*Execute after critical and high-risk coverage is complete:*
* Search edge cases
* UI validation
* Non-critical product behavior
* Lower-impact input variations

### 🟢 Low
*Execute when time and resources permit.*

---

## 4. Risk-Based Execution Principle

**Core Principle:** Testing effort should be strictly proportional to business risk. 
A critical checkout failure receives significantly more testing effort and variation than a low-impact visual defect.

Risk analysis is a living process and should be revisited when:
* Requirements change.
* New functionality is introduced.
* Defects reveal unexpected risks.
* Architecture changes.
* Production incidents occur.
```