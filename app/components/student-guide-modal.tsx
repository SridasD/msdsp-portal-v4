"use client";

import { useEffect, useId, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { Icon } from "./portal-primitives";

interface StudentGuideModalProps {
  close: () => void;
}

export function StudentGuideModal({ close }: StudentGuideModalProps) {
  const dialogRef = useRef<HTMLDivElement>(null);
  const titleId = useId();
  const descriptionId = useId();
  const [mounted, setMounted] = useState(false);
  const [activeTab, setActiveTab] = useState<"hierarchy" | "acronyms" | "scores" | "workboard">("hierarchy");

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted) return;
    const previousFocus = document.activeElement as HTMLElement | null;
    dialogRef.current?.querySelector<HTMLElement>(".v2-guide-tabs button.active")?.focus();

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") close();
      if (event.key !== "Tab" || !dialogRef.current) return;
      const focusable = Array.from(
        dialogRef.current.querySelectorAll<HTMLElement>(
          "button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex='0']"
        )
      );
      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last?.focus();
      }
      if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first?.focus();
      }
    };

    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", handleKeyDown);
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", handleKeyDown);
      previousFocus?.focus();
    };
  }, [close, mounted]);

  if (!mounted) return null;

  const modalMarkup = (
    <div className="modal-backdrop" onMouseDown={close}>
      <div
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        aria-describedby={descriptionId}
        className="evidence-modal v2-guide-modal"
        onMouseDown={(event) => event.stopPropagation()}
      >
        <button type="button" className="modal-close" aria-label="Close student guide" onClick={close}>
          <svg viewBox="0 0 24 24" aria-hidden="true" fill="none" stroke="currentColor">
            <path d="M18 6L6 18M6 6l12 12" />
          </svg>
        </button>

        <div className="v2-guide-header">
          <span className="eyebrow">STUDENT ONBOARDING & MENTAL MODEL</span>
          <h2 id={titleId}>How Your Learning, Tasks & Scores Work</h2>
          <p id={descriptionId} className="v2-guide-lead">
            Demystifying the academic structure of the M.Sc. Data Science and Product Development portal.
          </p>
        </div>

        {/* Tab switcher */}
        <div className="v2-guide-tabs" role="tablist" aria-label="Guide topics">
          <button
            type="button"
            role="tab"
            aria-selected={activeTab === "hierarchy"}
            className={activeTab === "hierarchy" ? "active" : ""}
            onClick={() => setActiveTab("hierarchy")}
          >
            <Icon name="layers" /> 1. Learning Hierarchy
          </button>
          <button
            type="button"
            role="tab"
            aria-selected={activeTab === "acronyms"}
            className={activeTab === "acronyms" ? "active" : ""}
            onClick={() => setActiveTab("acronyms")}
          >
            <Icon name="file" /> 2. Acronyms (DS, PO, PSO)
          </button>
          <button
            type="button"
            role="tab"
            aria-selected={activeTab === "scores"}
            className={activeTab === "scores" ? "active" : ""}
            onClick={() => setActiveTab("scores")}
          >
            <Icon name="award" /> 3. Scores vs Attendance
          </button>
          <button
            type="button"
            role="tab"
            aria-selected={activeTab === "workboard"}
            className={activeTab === "workboard" ? "active" : ""}
            onClick={() => setActiveTab("workboard")}
          >
            <Icon name="brief" /> 4. Dashboard vs Work Board vs Portfolio
          </button>
        </div>

        {/* Scrollable Modal Body */}
        <div className="v2-guide-body">
          {/* Tab 1: Hierarchy */}
          {activeTab === "hierarchy" && (
            <div className="v2-guide-content" tabIndex={0} role="tabpanel" aria-label="Learning Hierarchy">
              <p className="v2-guide-explainer">
                Work in MSDSP is organized into 5 nested levels of responsibility, from your multi-year degree down to today’s code revisions:
              </p>

              <div className="v2-hierarchy-tree">
                <div className="v2-htree-node h-degree">
                  <div className="v2-htree-badge">DEGREE</div>
                  <div className="v2-htree-info">
                    <b>M.Sc. Data Science & Product Development</b>
                    <span>2 Years · 4 Semesters · 80 Academic Credits</span>
                  </div>
                </div>
                <div className="v2-htree-connector" />

                <div className="v2-htree-node h-semester">
                  <div className="v2-htree-badge">SEMESTER & COURSES</div>
                  <div className="v2-htree-info">
                    <b>Semester II · Full Stack & AI Engineering</b>
                    <span>Enrolled Courses: CS102 (Full Stack), CS103 (Backend), CS105 (DevOps)</span>
                  </div>
                </div>
                <div className="v2-htree-connector" />

                <div className="v2-htree-node h-level">
                  <div className="v2-htree-badge">LEVEL (CYCLE)</div>
                  <div className="v2-htree-info">
                    <b>Level 9 · Full Stack Integration & Testing</b>
                    <span>A 4-week intensive immersion block (Level 9 of 20 total levels across 4 semesters)</span>
                  </div>
                </div>
                <div className="v2-htree-connector" />

                <div className="v2-htree-node h-sprint">
                  <div className="v2-htree-badge">SPRINT (CADENCE)</div>
                  <div className="v2-htree-info">
                    <b>Sprint 04 · Quality Gate & End-to-End Verification</b>
                    <span>Current active sprint (Week 19) · Focus: Automating Playwright test suites</span>
                  </div>
                </div>
                <div className="v2-htree-connector" />

                <div className="v2-htree-node h-assignment">
                  <div className="v2-htree-badge">ASSIGNMENT & WORK ITEM</div>
                  <div className="v2-htree-info">
                    <b>DS-907 · End-to-End Quality Gate Revision</b>
                    <span>Due in 34 hours · Action: Fix token refresh & transaction rollback failures</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Tab 2: Acronyms */}
          {activeTab === "acronyms" && (
            <div className="v2-guide-content" tabIndex={0} role="tabpanel" aria-label="Acronyms Guide">
              <p className="v2-guide-explainer">
                You will see several standard academic and programme acronyms across the portal. Here is what each one stands for:
              </p>

              <div className="v2-acronyms-table">
                <div className="v2-acronym-card">
                  <span className="v2-acronym-badge">DS-xxx</span>
                  <div>
                    <b>Data Science Assignment Code</b>
                    <p>Identifies a specific engineering problem statement and its deliverables. Example:</p>
                    <code>DS-904</code>: Level 9, Assignment 04 (Full-Stack Integration)<br />
                    <code>DS-905</code>: Level 9, Assignment 05 (PostgreSQL & API Contract)<br />
                    <code>DS-907</code>: Level 9, Assignment 07 (E2E Quality Gate)
                  </div>
                </div>

                <div className="v2-acronym-card">
                  <span className="v2-acronym-badge">PO</span>
                  <div>
                    <b>Programme Outcome (PO1–PO8)</b>
                    <p>
                      University-wide graduate attributes defining what you must be able to do by graduation:
                    </p>
                    <code>PO2</code>: Cloud-native full-stack system architecture<br />
                    <code>PO3</code>: Distributed backend & data engineering<br />
                    <code>PO4</code>: DevOps, CI/CD pipelines & test automation
                  </div>
                </div>

                <div className="v2-acronym-card">
                  <span className="v2-acronym-badge">PSO</span>
                  <div>
                    <b>Programme-Specific Outcome (PSO1–PSO4)</b>
                    <p>
                      Specific technical competencies unique to Data Science & Product Development:
                    </p>
                    <code>PSO1</code>: AI-powered product engineering end-to-end<br />
                    <code>PSO4</code>: Secure, quality-assured production systems
                  </div>
                </div>

                <div className="v2-acronym-card">
                  <span className="v2-acronym-badge">CO</span>
                  <div>
                    <b>Course Outcome</b>
                    <p>
                      The specific learning outcome tied to a university subject.
                      Work on <code>DS-907</code> satisfies both <code>CS105 (CO3)</code> and <code>PO4</code>.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Tab 3: Scores */}
          {activeTab === "scores" && (
            <div className="v2-guide-content" tabIndex={0} role="tabpanel" aria-label="Scores and Evaluation">
              <p className="v2-guide-explainer">
                In this portal, you see multiple scores. They serve distinct purposes and are strictly kept separate:
              </p>

              <div className="v2-score-explainer-grid">
                <div className="v2-score-box academic">
                  <div className="v2-score-box-top">
                    <Icon name="award" />
                    <b>Academic Result (82.4%)</b>
                  </div>
                  <p>
                    <strong>What it is:</strong> Your official university marks determined by Course Plan weighting:
                  </p>
                  <ul>
                    <li>Live Project Work: 50%</li>
                    <li>Product Milestones: 20%</li>
                    <li>Technical Viva & Demo: 15%</li>
                    <li>Continuous Evaluation: 15%</li>
                  </ul>
                  <small className="v2-score-tag">Appears on official transcript & GPA</small>
                </div>

                <div className="v2-score-box gate">
                  <div className="v2-score-box-top">
                    <Icon name="target" />
                    <b>Level Gate Points (780 / 1,000 pts)</b>
                  </div>
                  <p>
                    <strong>What it is:</strong> A learning lab progression gamification rubric:
                  </p>
                  <ul>
                    <li>Earned by attaching reviewed evidence</li>
                    <li>780 pts = <em>Ladder Pass</em> (Eligible for review)</li>
                    <li>900+ pts = <em>Distinction</em></li>
                    <li>Unlocks transition from Level 9 to Level 10</li>
                  </ul>
                  <small className="v2-score-tag">Internal lab milestone & gate readiness</small>
                </div>

                <div className="v2-score-box attendance">
                  <div className="v2-score-box-top">
                    <Icon name="shield" />
                    <b>Attendance (DUK@360 ERP)</b>
                  </div>
                  <p>
                    <strong>What it is:</strong> Strictly handled in the external university biometric / ERP portal:
                  </p>
                  <ul>
                    <li>MSDSP portal records engineering evidence only</li>
                    <li>Login time, session duration, and code commits are <strong>never</strong> used as attendance</li>
                    <li>No attendance points exist in this dashboard</li>
                  </ul>
                  <small className="v2-score-tag">Governed strictly outside this portal</small>
                </div>
              </div>
            </div>
          )}

          {/* Tab 4: Dashboard vs Work Board vs Portfolio */}
          {activeTab === "workboard" && (
            <div className="v2-guide-content" tabIndex={0} role="tabpanel" aria-label="Dashboard vs Work Board vs Portfolio">
              <p className="v2-guide-explainer">
                How do your <strong>Dashboard</strong>, <strong>Work Board</strong>, and <strong>Evidence & Portfolio</strong> fit together? They form a complete 3-tier engineering progression loop:
              </p>

              <div className="v2-comparison-grid">
                <div className="v2-comparison-card dashboard">
                  <div className="v2-comp-head">
                    <Icon name="grid" />
                    <div>
                      <b>Dashboard (Overview)</b>
                      <small>Your Strategic Command Center (Cockpit)</small>
                    </div>
                  </div>
                  <p><strong>Answers:</strong> “What should I work on today? How is my team doing? What are my points?”</p>
                  <ul>
                    <li><strong>Sprint & Level status:</strong> Level 9, Sprint 04 timeline & progress.</li>
                    <li><strong>Urgent focus:</strong> Highlights blockers, failing scenarios, and upcoming deadlines.</li>
                    <li><strong>Points & Scores:</strong> 82.4% Academic GPA mark & 780 Quest points ledger.</li>
                    <li><strong>Team Northstar:</strong> Pod members' current status and blockers.</li>
                  </ul>
                  <span className="v2-comp-badge">Tells you WHAT to do next</span>
                </div>

                <div className="v2-comparison-card workboard">
                  <div className="v2-comp-head">
                    <Icon name="brief" />
                    <div>
                      <b>Work Board</b>
                      <small>Your Engineering Execution Workbench (Studio)</small>
                    </div>
                  </div>
                  <p><strong>Answers:</strong> “What are the exact specs? What rubrics will I be graded on? Where do I upload my deliverables?”</p>
                  <ul>
                    <li><strong>Client Brief:</strong> Full technical problem statement, constraints & PO mappings.</li>
                    <li><strong>Rubric Criteria:</strong> Explicit standards (Needs Revision vs Meets Standard vs Exceeds).</li>
                    <li><strong>Artifacts Management:</strong> Attach OpenAPI specs, GitHub PRs, PostgreSQL migrations, Playwright traces.</li>
                    <li><strong>Submit for Review:</strong> Formal submission gate to notify faculty coordinators.</li>
                  </ul>
                  <span className="v2-comp-badge accent">Where you DO and SUBMIT the work</span>
                </div>

                <div className="v2-comparison-card portfolio">
                  <div className="v2-comp-head">
                    <Icon name="file" />
                    <div>
                      <b>Evidence & Portfolio</b>
                      <small>Your Permanent Verified Showcase (Vault)</small>
                    </div>
                  </div>
                  <p><strong>Answers:</strong> “What permanent proof have I accumulated? Which accepted artifacts prove my capabilities to examiners & employers?”</p>
                  <ul>
                    <li><strong>Cumulative Artifacts:</strong> 22 professional engineering assets across all cycles.</li>
                    <li><strong>Outcome Mapping:</strong> Proof mapped to PO1–PO8 & PSO1–PSO4.</li>
                    <li><strong>Verification State:</strong> 18 Ready, 2 In Review, 2 Quality Gaps.</li>
                    <li><strong>Career Showcase:</strong> Audited evidence for viva defence & placement interviews.</li>
                  </ul>
                  <span className="v2-comp-badge violet">Your permanent VERIFIED proof</span>
                </div>
              </div>

              <div className="v2-lifecycle-flow">
                <b>The 4-Step Assignment Cycle:</b>
                <div className="v2-flow-steps">
                  <div className="v2-flow-step">
                    <span>1</span>
                    <b>Dashboard Alert</b>
                    <p>Dashboard flags an active or revision-needed task (e.g. DS-907).</p>
                  </div>
                  <div className="v2-flow-step">
                    <span>2</span>
                    <b>Work Board Brief</b>
                    <p>Read client specifications, check evaluation rubric criteria, and attach code.</p>
                  </div>
                  <div className="v2-flow-step">
                    <span>3</span>
                    <b>Faculty Verification</b>
                    <p>Coordinators (Ajitha V S / Krishnasree K) review and grade your pull request.</p>
                  </div>
                  <div className="v2-flow-step">
                    <span>4</span>
                    <b>Published to Portfolio</b>
                    <p>Accepted deliverables are permanently archived in your Evidence & Portfolio!</p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="button-row v2-guide-footer">
          <button type="button" className="primary-button" onClick={close}>
            Got it, back to dashboard <Icon name="check" />
          </button>
        </div>
      </div>
    </div>
  );

  return createPortal(modalMarkup, document.body);
}
