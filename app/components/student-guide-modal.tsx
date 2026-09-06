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
  const [activeTab, setActiveTab] = useState<"hierarchy" | "acronyms" | "scores">("hierarchy");

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
                  <div className="v2-htree-badge">SPRINT</div>
                  <div className="v2-htree-info">
                    <b>Sprint 04: Verify (Current Week)</b>
                    <span>1-week execution cycle within the level (Sprint 1: Foundation → 2: Contracts → 3: Integrate → 4: Verify → 5: Live Demo)</span>
                  </div>
                </div>
                <div className="v2-htree-connector" />

                <div className="v2-htree-node h-activity">
                  <div className="v2-htree-badge">ACTIVITY / ASSIGNMENT</div>
                  <div className="v2-htree-info">
                    <b>DS-907 · End-to-End Quality Gate Revision</b>
                    <span>Specific project deliverable submitted for faculty review (Reviewer: Ajitha V S)</span>
                  </div>
                </div>
                <div className="v2-htree-connector" />

                <div className="v2-htree-node h-subactivity">
                  <div className="v2-htree-badge">SUB-ACTIVITIES (TASKS)</div>
                  <div className="v2-htree-info">
                    <b>Work Items & Test Traces</b>
                    <span>1. Fix Firefox token refresh · 2. Verify rollback · 3. Attach Playwright traces to PR-42</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Tab 2: Acronyms */}
          {activeTab === "acronyms" && (
            <div className="v2-guide-content" tabIndex={0} role="tabpanel" aria-label="Acronyms Guide">
              <p className="v2-guide-explainer">
                What do all the letter codes mean in your dashboard?
              </p>

              <div className="v2-glossary-grid">
                <div className="v2-glossary-card">
                  <div className="v2-glossary-header">
                    <span className="v2-chip chip-indigo">DS</span>
                    <b>Data Science Assignment Code</b>
                  </div>
                  <p>
                    "DS" is the prefix for project deliverables in the M.Sc. Data Science curriculum. The digits signify the Level and assignment number:
                  </p>
                  <div className="v2-glossary-example">
                    <code>DS-904</code>: Level 9, Assignment 04 (Full-Stack Integration)<br />
                    <code>DS-905</code>: Level 9, Assignment 05 (PostgreSQL & API Contract)<br />
                    <code>DS-907</code>: Level 9, Assignment 07 (E2E Quality Gate)
                  </div>
                </div>

                <div className="v2-glossary-card">
                  <div className="v2-glossary-header">
                    <span className="v2-chip chip-violet">PO</span>
                    <b>Programme Outcome (PO1–PO8)</b>
                  </div>
                  <p>
                    8 national engineering attributes accredited by the University that every graduate must demonstrate:
                  </p>
                  <div className="v2-glossary-example">
                    <code>PO2</code>: Cloud-native full-stack system architecture<br />
                    <code>PO3</code>: Distributed backend & data engineering<br />
                    <code>PO4</code>: DevOps, CI/CD pipelines & test automation
                  </div>
                </div>

                <div className="v2-glossary-card">
                  <div className="v2-glossary-header">
                    <span className="v2-chip chip-cyan">PSO</span>
                    <b>Programme-Specific Outcome (PSO1–PSO4)</b>
                  </div>
                  <p>
                    4 specialised capabilities unique to Digital University Kerala’s CDIPD applied product programme:
                  </p>
                  <div className="v2-glossary-example">
                    <code>PSO1</code>: AI-powered product engineering end-to-end<br />
                    <code>PSO4</code>: Secure, quality-assured production systems
                  </div>
                </div>

                <div className="v2-glossary-card">
                  <div className="v2-glossary-header">
                    <span className="v2-chip chip-gold">CO</span>
                    <b>Course Outcome</b>
                  </div>
                  <p>
                    The specific learning outcomes defined in the syllabus of an individual university course (e.g. CS102, CS105).
                  </p>
                  <div className="v2-glossary-example">
                    Work on <code>DS-907</code> satisfies both <code>CS105 (CO3)</code> and <code>PO4</code>.
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
