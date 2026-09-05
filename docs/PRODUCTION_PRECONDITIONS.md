# Production Preconditions

This checklist defines what must be confirmed before the prototype becomes a production academic system.

## 1. Authentication and identity

- Confirm whether DUK@360 or another university identity provider is authoritative.
- Confirm OIDC, OAuth 2.0, SAML or another approved protocol.
- Receive client registration, endpoints and test configuration.
- Define an immutable university user identifier.
- Approve claims for role, programme, enrolment and faculty allocation.
- Define session duration, logout and single-logout behaviour.
- Provide Student, Mentor, Course Head and Administrator test accounts.
- Keep prototype role switching out of production business components.

## 2. Roles and permissions

- Approve the role catalogue and RACI.
- Confirm Course Head publication authority.
- Confirm whether Level Coordinator is a distinct role or responsibility.
- Define Domain Mentor and Student-Team Mentor access scopes.
- Ensure mentors see only formally allocated learners/evidence.
- Define who may adjust marks, deadlines and progression.
- Require server-side authorisation and auditable overrides.

## 3. Attendance boundary

- Attendance remains exclusively in DUK@360.
- MSDSP must not capture, calculate or infer attendance.
- Login time, submission time, activity frequency, time spent and after-hours work are not attendance.
- If displayed later, attendance must be read-only and separately labelled.
- Attendance must not enter academic or gamification calculations without formal approval.

## 4. Academic master data

Approve authoritative sources for:

- Programme and academic year
- Four semesters
- Courses, electives, credits and L–T–P
- Course units
- PO and PSO
- Twenty official Levels/Learning Cycles
- Sprint/calendar structure
- Students, enrolment and teams
- Faculty and mentor assignments
- Certification requirements

## 5. Academic evaluation

- Ratify the authoritative component model and weights.
- Confirm aggregation at course, Level, semester and assignment levels.
- Approve pass/failure thresholds.
- Define faculty adjustment and moderation rules.
- Define review, revision, re-evaluation and appeal workflows.
- Define result-publication authority and locking.
- Provide worked calculation examples and acceptance tests.

## 6. Gamification and progression

- Approve whether points are required in the first production release.
- Define Effort XP and Mastery Points without attendance-based triggers.
- Approve progression bands and the source of `levelGateScore`.
- Define faculty override authority and required rationale.
- Define recovery duration, retries, counselling/support and escalation.
- Approve badge criteria and evidence requirements.
- Resolve certification points and progression dependencies.

## 7. Evidence and storage

- Select the storage provider and regional hosting requirements.
- Approve file types, size limits and malware scanning.
- Define evidence versioning, locking and student deletion rules.
- Define retention, archival, backup and recovery.
- Confirm plagiarism/code-similarity integrations if required.
- Define team-member and reviewer visibility.
- Preserve hashes and provenance for accepted evidence.

## 8. Notifications

Approve channels and events:

- In-app
- University email
- DUK@360 notification
- SMS, if justified

Candidate events: assignment publication, checkpoint reminder, evidence submission, review completion, revision request, result publication and recovery assignment.

## 9. External integrations

For every integration record:

```text
System owner
API availability
Authentication mechanism
Authoritative source
Data exchanged
Direction of flow
Update frequency
Failure and retry behaviour
Audit requirement
```

Potential integrations: DUK@360 SSO/attendance, Student Information System, academic/examination system, evidence storage, email/SMS gateway, certification providers and plagiarism/code-quality services.

## 10. Audit, privacy and security

- Classify student, staff, assessment and evidence data.
- Approve privacy notices and lawful processing.
- Define access boundaries and least-privilege roles.
- Audit Level configuration, allocations, deadline changes, evidence versions, reviews, score changes and publication.
- Record actor, action, timestamp, reason and previous/new values.
- Define log retention, monitoring, incident response and security review.
- Remove public prototype identities and records before production migration.

## Minimum gate before backend development

1. Authentication and immutable identity
2. Roles and authority model
3. Attendance boundary
4. Approved programme/course/Level master data
5. Academic calculation and publication rules
6. Initial gamification/progression scope
7. Evidence lifecycle and storage decision
8. Mentor/faculty allocation rules
9. Integration ownership and contracts
10. Representative approved test data

