# Prototype Scope and Limitations

## Included

### Programme and academic context

- Programme → Semester → Learning Cycle/Level → Sprint hierarchy
- Three representative Semester II Learning Cycles in the switcher
- Twenty-Level coordination reference
- Course Details for Course Head and Mentor workspaces
- PO/PSO and assessment-component presentation
- Separate academic and gamification result views

### Student experience

- Realistic Student Dashboard for Anakha Rajesh
- Next best action and current Level position
- Work Board and professional evidence journey
- Evidence and portfolio presentation
- Skills, badges and online-course/certification completion
- Faculty feedback and revision states
- Calendar and academic checkpoints
- Performance/results and progression explanation
- Separate Information Centre for Info, FAQ and abbreviations

### Mentor experience

- Domain Mentor and Student-Team Mentor personas
- Allocations and learner/team views
- Sprint workspace
- Evidence review and revision workflow
- Mentoring records
- Competency calibration
- Escalations
- Recommendation tracker
- Mentor calendar
- Course Details

### Course Head experience

- Governance dashboard
- Course Details
- Programme workflow and Mermaid reference diagrams
- Spreadsheet-grounded Course Coordination
- Learning Cycle planning/Gantt-style views
- Assignment design
- Student monitoring and activity review
- Academic evaluation
- Reports and analytics

### UX and platform

- Desktop and mobile-responsive layouts
- Light, dark and system themes
- Reduced-motion support
- Persistent theme and Learning Cycle preference
- Toasts, popovers, dialogs and interactive prototype controls
- Colour-coded animated Mermaid diagrams
- DUK@360 attendance boundary throughout

## Representative data

The prototype includes named, illustrative student and staff records to exercise realistic states. These are publicly visible prototype records and are not official academic results.

Representative learners:

- Alfin
- Anakha Rajesh
- Annamma
- Annrosna
- Dhanush Girish

Representative evidence states include verified, awaiting review, revision required, provisional and scheduled. Gamification and score values are illustrative.

## Simulated or incomplete

- Authentication and role switching
- Backend persistence
- File upload/storage
- Evidence hashing and malware scanning
- Email/SMS/in-app delivery
- Real academic master data synchronisation
- Certification-provider verification
- DUK@360 integration
- Plagiarism/code-similarity integration
- Audit-log persistence
- Result locking and appeal
- Permission enforcement beyond UI separation

## Intentionally deferred

- Production authentication/password system
- Full badge economy
- Leaderboards based on raw scores
- Complex bonus and penalty engine
- External certification-provider APIs
- Voucher and examination-window management
- Academic ERP/examination integration
- Advanced approval chains
- Production analytics and regulatory reporting

## Known limitations

1. Most prototype content and state are contained in one large client component.
2. Data is centralised only partially; production services/selectors do not yet exist.
3. The Learning Cycle selector demonstrates three Levels, while Course Coordination documents all 20.
4. Interactions provide prototype feedback but do not persist academic records.
5. Calculations are illustrative and not approved for regulatory use.
6. Role switching is intentionally visible for demonstration and must be replaced by server-authorised identity.
7. Public repository data must be replaced or governed before production.
8. Source-document inconsistencies remain unresolved.

## Acceptance boundary

The prototype is successful when stakeholders can understand and validate:

- The programme hierarchy and ownership model
- The Student, Mentor and Course Head journeys
- Evidence-led academic review
- Separation of marks, gamification, progression and attendance
- Course coordination and specialist gaps
- Information architecture, responsive interaction and theme behaviour

It is not evidence that production security, integration, performance, regulatory compliance or data governance requirements have been satisfied.

