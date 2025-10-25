# API CRM Node.js + PostgreSQL

This document describes **what the system does**, not how to code it. It consolidates the behavior currently implemented across the Firebase collections and client logic, and expresses it as clear business rules. Use it as the single source of truth when you rebuild the backend.

---

## 1) Core Concepts & Entities

**Customers**
- A customer belongs to an **Area** and travels on a **Route** inside that Area.
- Each customer has a **status** (`active`, `inactive`, `banned`, `suspected`), contact details, and a **reliability score** (explained later).
- Customer names must be **unique**. You cannot delete a customer if there are **any invoices** for them.

**Locations**
- **Areas** group customers at a high level.
- **Routes** are sub‑groupings within an Area. You cannot delete an Area that still has Routes or Customers. You cannot delete a Route that still has Customers.

**Invoices**
- An invoice belongs to a customer and has: issue date, **due date**, **total amount**, and **outstanding balance**.
- A human‑readable **invoice number** is generated sequentially (e.g., `IN000123`). The exact number matters for ordering and searching but the business is tolerant to gaps.
- The **status** of an invoice is always derived from its money and time situation:
  - `Paid` — outstanding balance is **zero or less**.
  - `Overdue` — outstanding is **greater than zero** *and* today is **after** the due date.
  - `Open` — otherwise.

**Payments & Instruments**
- **Cash payments** relate to a **single invoice** and reduce that invoice’s outstanding directly.
- **Cheques** can cover **multiple invoices**. A single cheque has one face value and is **allocated** across invoices.
- A cheque can later be **Cashed** or **Bounced**. If it bounces, all its allocations are **undone**.

**Returns**
- A return represents goods coming back after an invoice was issued. Returns **reduce both** the invoice’s total amount **and** its outstanding balance.

**Banks**
- Cheques reference a bank by a **bank code**. You cannot delete a bank that is still referenced by any cheque.

**Users & Roles**
- The app keeps a management list of users and roles (`Administrator`, `Editor`, `Contributor`). Authentication is external to this logic; roles control permissions.

**Activity Logs**
- Every important action writes a log entry: who did it, what module, what action, whether it succeeded, and a short description. Logs are append‑only and shown newest first.

**Settings**
- A single settings record drives global behavior: `appName`, a monthly `salesTarget`, a default **due‑date offset** in days (typically 30), and a **banking date threshold** used around cheque handling.

---

## 2) Lifecycles & State Rules

### 2.1 Customer Lifecycle
- **Create** a customer with a unique name, select Area and Route, and set initial status (default `active`).
- **Update** may change name (must stay unique), contact info, or status. Moving between Areas/Routes is allowed and cascades to reporting views.
- **Delete** is **blocked** if any invoices exist for that customer.

### 2.2 Invoice Lifecycle
1. **Create** — When an invoice is created:
   - The system generates the next **sequential invoice number**.
   - **Due date** is set to *invoice date + due‑date offset* from settings.
   - **Outstanding balance** starts equal to **total amount**.
   - Initial status is derived from the rules in §1 (normally `Open`).
2. **Mutations that change money or time automatically re‑derive the status**:
   - Cash payment posted → outstanding goes down; if it reaches 0 → `Paid`.
   - Cheque allocations posted → outstanding goes down; status may switch to `Paid`.
   - Cheque bounced → previous allocations are reversed; outstanding goes **up**; status may flip back to `Open` or `Overdue` (depending on the due date).
   - Return posted → both **total** and **outstanding** go down; status may switch to `Paid`.
   - Return deleted → the effects are **reversed**; status may revert to `Open`/`Overdue`.
3. **Deletion** — An invoice cannot be deleted if there are **any** related cash payments, cheque allocations, or returns.

### 2.3 Cash Payment Rules
- A cash payment is tied to **one invoice**.
- On **create**, it reduces that invoice’s outstanding by the payment amount.
- On **edit**, only the **difference** between the new and old amount is applied.
- On **delete**, the original amount is added back.
- Amounts must be **positive**. On create, they may not exceed the invoice’s current outstanding (minor rounding tolerance is acceptable). On edit, exceeding can be permitted as long as the net outstanding never becomes negative after all adjustments.

### 2.4 Cheque Rules & Allocation Logic
- A cheque has: customer, cheque number, bank code, payment date, banking date, status, and a **face value (amount)**.
- **Validation** at creation:
  - Payment date cannot be **in the future**.
  - The cheque amount cannot exceed the **sum of outstanding** across the selected invoices (small rounding tolerance allowed).
- **Allocation** at creation:
  - The cheque’s amount is applied **greedily in the order of the provided invoice list**.
  - For each invoice, allocate up to its current outstanding; move to the next until the cheque is fully allocated or invoices run out.
  - Each allocation reduces the target invoice’s outstanding and may change its status to `Paid`.
- **Status changes**:
  - Marking a cheque as **Cashed** has no additional numeric effect; it confirms success.
  - Marking a cheque as **Bounced** immediately **reverses all prior allocations** for that cheque:
    - Every affected invoice’s outstanding increases by the exact allocation amount.
    - Each invoice re‑evaluates status (`Paid` → may become `Open`/`Overdue`).
- **Editing** a cheque re‑calculates allocations:
  - If the **amount increases** or new invoices are added, allocate the **additional** amount using the same greedy method.
  - If invoices are **removed** or amount **decreases**, de‑allocate from the **end of the allocation list** to bring totals back in line.
- **Deletion** of a cheque reverses all allocations first, then removes the cheque.

### 2.5 Returns (Goods Returned)
- A return is always linked to a specific invoice and customer.
- On **create**, both the invoice’s **total amount** and **outstanding balance** are reduced by the return amount.
- On **delete**, both values are increased back by that same amount.
- Return amounts must be **positive** and cannot exceed the invoice’s **current outstanding** at creation time.

### 2.6 Invoice Status Derivation (Always Derived, Never Manual)
- After **any** of the actions above, derive the status using these rules:
  1) If outstanding ≤ 0 → `Paid`.
  2) Else if today > due date → `Overdue`.
  3) Else → `Open`.

---

## 3) Integrity, Counters, and Defaults

**Uniqueness**
- Customer names are unique.
- Invoice numbers are unique and **sequential** within the global invoice namespace.

**Counters**
- The system maintains a **monotonic counter** for invoices. When creating a new invoice, it increments the counter and formats the number (prefix `IN`, fixed width). Business logic only relies on **ordering**, not perfectly contiguous numbering.

**Due Date Default**
- The standard practice is **invoice date + N days** (N comes from settings; default is 30). All overdue checks reference today’s date vs. this due date.

**Bank Deletion Protection**
- A bank cannot be removed while any cheque still references its code.

**Area/Route Deletion Protection**
- Areas and Routes cannot be removed while still referenced by Routes/Customers respectively.

---

## 4) Validation Expectations (Mirrors Frontend)
- **Positive money**: all money fields must be greater than zero.
- **Dates**: cheque payment dates are not allowed in the future. Other dates use common sense (e.g., return date should not precede invoice date).
- **Foreign keys**: referenced records must exist (customer, invoice, bank, area, route).
- **Over‑application guards**:
  - Cash payments should not make an invoice’s outstanding **negative**.
  - Cheque total should not exceed the **combined outstanding** of the selected invoices at the time of allocation.
  - Returns should not exceed the invoice’s **current outstanding**.

---

## 5) Activity Logging (Auditing)
- For each create/update/delete (and significant status changes like cheque **Bounced**), write a log that includes:
  - Timestamp, the user (or `System`), whether it’s a system action, the module name, the action, success/failure, and a short human description.
- Where practical, capture a summary of the **before/after** values for key fields to aid troubleshooting.

---

## 6) Reliability Scoring (Customer “Rating”)
- The system keeps a customer **reliability score** from 0 to 100, mapped to a **tier** and **stars**.
- The score blends three ideas:
  1) **On‑time payment ratio (≈40%)** — invoices paid on or before due date.
  2) **Cheque health (≈30%)** — bounced cheques reduce the score (each bounce incurs a significant penalty, never below zero).
  3) **Purchase volume (≈30%)** — the customer’s total purchases vs. the fleet average for normalization.
- Scoring updates whenever invoices or cheques change for that customer, or on a periodic sweep.
- Tiers (illustrative): `Elite (≥90)`, `Solid (≥75)`, `Fair (≥50)`, `Risky (≥25)`, `Critical (<25)`.

---

## 7) Practical Scenarios & Expected Outcomes

**Scenario A — Simple Cash Payment**
- An invoice for 10,000 is created (outstanding = 10,000). A cash payment of 10,000 posts the same day. The invoice immediately becomes `Paid`.

**Scenario B — Partial Payment then Overdue**
- Invoice total 10,000, due in 30 days. A cash payment of 4,000 posts. Outstanding is 6,000, status remains `Open`. On day 31, if unpaid, status flips to `Overdue`.

**Scenario C — Cheque Across Multiple Invoices**
- Customer has three invoices outstanding: 5,000; 3,000; 4,000. A cheque for 9,000 is applied to these three **in that order**. Allocations become 5,000, 3,000, and 1,000. The first two invoices become `Paid`; the third remains `Open` with 3,000 outstanding.

**Scenario D — Bounced Cheque**
- Using Scenario C, if the cheque later **bounces**, the 9,000 previously allocated is **returned** to the respective invoices. Their statuses re‑derive: the first two likely revert to `Open` or `Overdue` depending on due dates.

**Scenario E — Returns**
- Invoice total 10,000, outstanding 10,000. A return of 2,000 arrives. Total becomes 8,000 and outstanding 8,000. If a prior payment had already reduced outstanding to 1,500, a return of 2,000 would drop outstanding to 0 and the invoice becomes `Paid` (the extra 500 is **not** turned into a credit note by this system; returns are capped so outstanding does not go negative).

**Scenario F — Editing a Cash Payment**
- A cash payment recorded as 3,000 is corrected to 2,200. The invoice’s outstanding **increases** by 800 and status re‑derives accordingly.

**Scenario G — Editing a Cheque**
- A cheque of 7,000 allocated to invoices A and B is increased to 8,500 and invoice C is added. The additional 1,500 is allocated starting with A→B→C using the greedy order. If instead the cheque is reduced to 5,500, the system **unwinds** allocations from the end until the totals match the new face value.

---

## 8) Reporting & Targets
- The app shows monthly sales vs. a **monthly target** from Settings. When the target is updated, the system stores the **month** alongside the value to indicate which month that target applies to.
- Lists are often sorted by the **numeric part** of the invoice number (e.g., `IN000123` → 123) or by dates.
- Reliability tiers and overdue counts feature prominently in customer summaries.

---

## 9) Migration Considerations (from Firebase)
- Keep the **original Firestore IDs** temporarily for traceability during migration and reconciliation.
- Initialize the invoice counter from the **largest existing** invoice number.
- Rebuild cheque allocations from their stored per‑invoice amounts. If legacy data lacks a breakdown, allocate to the **first** linked invoice for parity with current behavior (only as a fallback).
- After importing data, run a **full reconciliation** that recomputes every invoice’s outstanding and status from first principles:
  - Start from invoice total.
  - Subtract all cash payments.
  - Subtract all **non‑bounced** cheque allocations.
  - Subtract all returns.
  - Derive status using §2.6.

---

## 10) Guardrails & Non‑Goals
- The system **does not** create overpayments or credits from returns or payments; amounts are capped to prevent negative outstanding balances.
- Deleting reference data (Bank, Area, Route) is **not allowed** while in use; users must first move or delete dependent records.
- Invoice status is **never manually set**; it always follows the numbers and dates.

---

### One‑Page Summary (for quick onboarding)
- Create invoice → due date = issue date + default days → outstanding = total.
- Apply cash/cheque/return → adjust outstanding (and sometimes total) → re‑derive status.
- Cheques allocate greedily across invoices; **bounce** = undo those allocations.
- Returns lower **both** total and outstanding; never create negatives.
- Names (customers) and numbers (invoices) are unique; deletions are blocked if referenced.
- Logs track every significant action for audit and support.
- Reliability score reflects on‑time payment, cheque health, and purchase volume; it updates when money moves.