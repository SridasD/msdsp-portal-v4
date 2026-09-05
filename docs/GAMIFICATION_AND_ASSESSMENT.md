# Gamification and Assessment

## Design principle

Academic evaluation, gamification and progression are separate records with different purposes.

| Record | Purpose | Authority |
|---|---|---|
| Academic result | Credit-bearing evaluation | Course Plan and authorised academic faculty |
| Gamification points | Motivation and visible professional growth | Provisional gamification configuration |
| Level Gate score | Readiness/progression decision | Approved evidence and Course Head decision |
| Attendance | Institutional attendance record | DUK@360 only |

## Academic assessment model

The prototype displays the Course Plan component model as the academic reference:

| Component | Weight |
|---|---:|
| Live Project Work | 50% |
| Product Milestones | 20% |
| Documentation and Process | 10% |
| Continuous Evaluation | 10% |
| Theory Examination | 10% |

```text
Weighted contribution = Component score × Component weight ÷ 100
Academic result = Sum of weighted contributions
```

Production use requires confirmation of the aggregation level: course, Level, semester or assignment contribution. Course-specific project/theory splits must be configuration, not UI constants.

## Pedagogical mapping

### Bloom’s Revised Taxonomy

Assignments should visibly target higher-order cognition:

- **Analyse** — inspect data, requirements, failures, dependencies and system behaviour.
- **Evaluate** — justify trade-offs, review evidence and defend professional decisions.
- **Create** — produce working product increments and professional artifacts.

### Kolb’s Experiential Learning Cycle

| Stage | Portal interpretation |
|---|---|
| Concrete Experience | Execute the project task or simulation |
| Reflective Observation | Record outcomes, failures, feedback and learning |
| Abstract Conceptualisation | Refine models, architecture, principles or standards |
| Active Experimentation | Rework, test, deploy and demonstrate the improved solution |

## Authentic assessment artifacts

Prefer workplace evidence over generic multiple-choice testing:

- Product requirements documents and client briefs
- Stakeholder maps and research summaries
- Architecture decision records
- API/OpenAPI specifications
- Git repositories, commits and reviewed pull requests
- Database schemas and migrations
- Automated test and quality reports
- CI/CD configurations
- Deployment and operational runbooks
- Incident or escalation notes
- Client/stakeholder memos and presentations
- Sprint retrospectives and reflective decisions

## Gamification foundation

The gamification layer follows Self-Determination Theory:

| Need | Portal mechanism |
|---|---|
| Autonomy | Personal planning, choice of evidence approach and transparent next actions |
| Competence | Rubric feedback, evidence-backed badges, skill tree and revision loops |
| Relatedness | Team delivery, peer review, mentor checkpoints and cohort contribution |

Octalysis-informed mechanics are used selectively: development and accomplishment, meaningful choice, feedback, social collaboration, scarcity through controlled review windows, and uncertainty through authentic problem solving. Avoid rewards unrelated to learning or professional competence.

## Points architecture

Recommended separation:

- **Effort XP** — reflection, peer review and professional contribution. Attendance must not be used as an XP trigger inside MSDSP.
- **Mastery Points** — rubric-scored technical execution supported by reviewed evidence.
- **Level Gate score** — configurable readiness indicator used for a governed progression recommendation.

Badges must represent verified competence and link to their evidence trail. Online-course or certification completion must show provider, status, evidence and verification state.

## Provisional progression bands

| Score | Band | Expected action |
|---:|---|---|
| 0–49% | Snake Zone | Recovery required |
| 50–69% | Conditional Pass | Remedial work and targeted evidence required |
| 70–89% | Ladder Pass | Progress to the next Level |
| 90–100% | Distinction | Progress with distinction |

These bands are prototype configuration until the Programme Board confirms which score determines them, override authority, retry limits and recovery rules.

## Industry-standard rubric

| Tier | Observable standard |
|---|---|
| Needs Revision | Artifact is incomplete, unreliable, irreproducible or unsupported by required evidence |
| Meets Industry Standard | Artifact satisfies the brief, works reliably, is auditable and is supported by defensible evidence |
| Exceeds Expectations | Artifact demonstrates independent validation, risk awareness, professional judgement and justified improvement beyond the brief |

## Feedback cadence

1. Immediate simulation/tool feedback where technically valid.
2. Sprint checkpoint feedback from the Student-Team Mentor.
3. Specialist artifact feedback from the Domain Mentor.
4. Evidence-linked revision and resubmission.
5. Faculty evaluation and student-visible explanation.
6. Level retrospective and progression decision.

## Certification handling

- Track all proposed Level-linked certifications.
- Statuses: Not started, In progress, Attempted, Completed and Verification pending.
- Preserve the working academic interpretation of any two completed certifications.
- Do not make every proposed certification a hard academic gate.
- Do not block academic progression solely on an external provider’s timing.
- Treat certification points as provisional until approved.

