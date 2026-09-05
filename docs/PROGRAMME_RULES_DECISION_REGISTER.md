# Programme Rules Decision Register

Do not encode unresolved values as permanent database constraints or production calculations. Update this register after Programme Board decisions.

| ID | Subject | Conflicting/unknown position | Temporary prototype treatment | Required approver | Status |
|---|---|---|---|---|---|
| PR-001 | Learning Cycle mapping | “Cycle” could mean Level or weekly Sprint | One Learning Cycle = one official Level; Sprints are subordinate | Programme Board | Working decision |
| PR-002 | Core-course credits | Source material indicates both 20 and 25 total core credits | Keep values configurable; do not enforce totals | Programme Board / academic authority | Open |
| PR-003 | Project Lab credits | Source material indicates both 5 and 10 credits | Do not enforce a permanent total | Programme Board / academic authority | Open |
| PR-004 | Programme total | Component summaries do not consistently reconcile to 80 credits | Display proposal carefully; require approved master | Programme Board | Open |
| PR-005 | Academic aggregation | Component weights are known, but course/Level/semester aggregation is unclear | Display transparent illustrative calculation only | Academic Board / Programme Board | Open |
| PR-006 | Gamification maximum | Published Level maxima and stated 20,000-point maximum do not reconcile | Use Level-specific prototype maxima; label provisional | Programme Board | Open |
| PR-007 | Progression score | Academic percentage, points and Level Gate could each be interpreted as the gate | Use separate configurable `levelGateScore` | Programme Board | Open |
| PR-008 | Progression bands | Snake/Conditional/Ladder/Distinction bands require ratification | Display provisional 0–49/50–69/70–89/90–100 bands | Programme Board | Open |
| PR-009 | Recovery and retries | Duration, retry maximum and conditional progression are undefined | Demonstrate basic recovery/revision states only | Programme Board / student support | Open |
| PR-010 | Certification requirement | Course Plan says any two; rubric distributes 21 across Levels | Track all; treat any two completed as current academic interpretation | Programme Board | Open |
| PR-011 | Certification gates | External certifications may be described as Level conditions | Do not block academic progression solely on external completion | Programme Board | Open |
| PR-012 | Timing bonuses/penalties | Early/late scoring is not formally approved | Keep disabled; timestamps provide chronology only | Programme Board | Open |
| PR-013 | Attendance terminology | Rubric includes delivery/attendance while operational rule excludes attendance | Use “Sprint and Milestone Delivery”; DUK@360 remains authoritative | Programme Board / DUK@360 owner | Working decision |
| PR-014 | Faculty vs mentor authority | Coordination roster is an industry-mentor proposal; official evaluator ownership is unclear | Mentors recommend; authorised academic faculty publish | Programme Board | Open |
| PR-015 | AI/ML specialist | Coordination roster has no dedicated modelling specialist | Show explicit gap for L2, L7, L13 and L18 | Programme Board / Course Head | Open |
| PR-016 | Security specialist | L14 security and penetration-testing expertise is incomplete | Show explicit specialist gap | Programme Board / Course Head | Open |
| PR-017 | Staff capacity | Several coordinators span many Levels and responsibilities | Treat assignments as proposed until weekly capacity is confirmed | Course Head / line managers | Open |
| PR-018 | Placement/support remit | HR ownership of placement and recovery/counselling needs confirmation | Present as proposed operational support | Programme Board | Open |
| PR-019 | Mobile pathway | Mobile mentor is assigned but product expectations are not final | Keep as optional/specialist pathway | Programme Board | Open |
| PR-020 | Coordination plan status | Version 4 roster and allocations are not ratified | Label proposal pending Programme Board approval | Programme Board | Open |

## Decision update procedure

For each approved decision:

1. Record the decision date and approving body.
2. Add the approved value/rule and source reference.
3. Identify affected screens, data entities and calculations.
4. Add acceptance examples.
5. Update prototype configuration and tests.
6. Preserve the previous value in the audit/history section.

## Scheduled review

Trigger: **after the next Programme Board review of the coordination plan**.

Review scope:

- Coordination roster and Level ownership
- AI/ML and security gaps
- Faculty/mentor evaluation boundary
- Credit totals and assessment aggregation
- Gamification maximum and progression rules
- Certification requirements
- Recovery/retry rules
- Attendance wording and deadline penalties

