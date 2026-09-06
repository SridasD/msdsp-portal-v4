"use client";

import { useMemo, useState } from "react";
import { FilterBar, Icon, Metric, PageHeader, PanelHeading, ScoreRow } from "./portal-primitives";
import { academicComponents, levelNinePoints, sprintData, type Cycle } from "../portal-config";

interface StudentDashboardV2Props {
  cycle: Cycle;
  openEvidence: (assignment?: string) => void;
  notify: (message: string) => void;
  onSwitchToClassic: () => void;
}

export function StudentDashboardV2({ cycle, openEvidence, notify, onSwitchToClassic }: StudentDashboardV2Props) {
  const [checklist, setChecklist] = useState({
    tokenRefresh: false,
    rollbackTrace: false,
    prBranch: true,
  });

  const academicScore = useMemo(
    () => academicComponents.reduce((sum, [, score, weight]) => sum + (score * weight) / 100, 0),
    []
  );

  const teamMembers = [
    { name: "Anakha Rajesh", role: "Full-Stack Engineer (You)", status: "Revision Open", task: "DS-907 E2E failure recovery", tone: "violet" },
    { name: "Alfin", role: "Backend Engineer", status: "Under Review", task: "DS-905 API contract & errors", tone: "cyan" },
    { name: "Annrosna", role: "Database Engineer", status: "In Progress", task: "PostgreSQL rollback migrations", tone: "gold" },
    { name: "Annamma", role: "QA & Integration Lead", status: "Demo Ready", task: "Local deployment runbook", tone: "green" },
  ];

  const todayTasks = [
    {
      id: "DS-907",
      title: "End-to-End Quality Gate Revision",
      role: "Quality Engineer",
      due: "05 Sep · 34h left",
      urgency: "urgent",
      status: "Revision required",
      reviewer: "Ajitha V S",
      evidence: "Playwright failure traces (v3 pending)",
    },
    {
      id: "DS-904",
      title: "Full-Stack Integration & Test Readiness",
      role: "Full-Stack Engineer",
      due: "14 Sep · 10 days",
      urgency: "active",
      status: "Faculty review",
      reviewer: "Krishnasree K",
      evidence: "5 of 7 artifacts accepted",
    },
    {
      id: "DS-905",
      title: "API Contract & PostgreSQL Integration",
      role: "Backend Engineer",
      due: "15 Sep · 11 days",
      urgency: "active",
      status: "Under review",
      reviewer: "Soorya S Kumar",
      evidence: "OpenAPI 3.1 & migration scripts",
    },
  ];

  return (
    <div className="v2-dashboard">
      {/* Top Banner & Mode Toggle */}
      <div className="v2-top-controls">
        <div className="v2-mode-selector" role="group" aria-label="Dashboard presentation style">
          <span className="v2-mode-label">DASHBOARD VIEW:</span>
          <button type="button" className="v2-mode-pill active" aria-pressed="true">
            <Icon name="target" /> Focused (v2)
          </button>
          <button type="button" className="v2-mode-pill" aria-pressed="false" onClick={onSwitchToClassic}>
            <Icon name="grid" /> Classic Overview
          </button>
        </div>
        <div className="v2-quick-links">
          <button type="button" className="v2-text-btn" onClick={() => notify("Git branch feat/ds-907 opened")}>
            <Icon name="file" /> Branch: <code>feat/ds-907-e2e</code>
          </button>
          <button type="button" className="v2-text-btn" onClick={() => notify("Team standup notes opened")}>
            <Icon name="users" /> Team Northstar
          </button>
        </div>
      </div>

      <PageHeader
        eyebrow="THURSDAY · 03 SEPTEMBER 2026"
        title="Good afternoon, Anakha Rajesh"
        description={`${cycle.semester} · ${cycle.id} (${cycle.title}) · Sprint 04: Verify. Two failing Playwright scenarios currently block your 16 September demonstration defence.`}
        action="Record learning evidence"
        onAction={() => openEvidence("DS-907 · End-to-end quality-gate revision")}
      />

      {/* 1. Hero Action Banner: Urgent Revision with Direct Reviewer Feedback */}
      <article className="v2-hero-action-card">
        <div className="v2-hero-badge-row">
          <span className="v2-urgency-badge">
            <i /> ACTION REQUIRED · SPRINT 04 QUALITY GATE
          </span>
          <time className="v2-countdown-timer">
            <Icon name="calendar" /> Due in 34 hours · 05 September, 17:00
          </time>
        </div>

        <div className="v2-hero-body">
          <div className="v2-hero-main">
            <h2>Resolve the two failing end-to-end scenarios (DS-907)</h2>
            <p className="v2-hero-summary">
              Repair token refresh and transaction rollback under concurrent load, attach the Playwright traces, and resubmit for QA coordinator review.
            </p>

            {/* Direct Mentor Feedback Callout */}
            <div className="v2-mentor-quote">
              <span className="avatar">AV</span>
              <div>
                <small>CRITIQUE FROM AJITHA V S · QA & TEST AUTOMATION COORDINATOR</small>
                <blockquote>
                  “The primary CRUD workflow connects properly. However, token refresh fails in Firefox, and transaction rollback is not demonstrated as idempotent. Attach the failing traces and updated runbook.”
                </blockquote>
              </div>
            </div>

            {/* Interactive Revision Checklist */}
            <div className="v2-revision-checklist">
              <label>
                <input
                  type="checkbox"
                  checked={checklist.tokenRefresh}
                  onChange={(e) => setChecklist({ ...checklist, tokenRefresh: e.target.checked })}
                />
                <span>Token refresh scenario passes in Chromium and Firefox</span>
              </label>
              <label>
                <input
                  type="checkbox"
                  checked={checklist.rollbackTrace}
                  onChange={(e) => setChecklist({ ...checklist, rollbackTrace: e.target.checked })}
                />
                <span>Transaction rollback idempotency assertion & trace attached</span>
              </label>
              <label>
                <input
                  type="checkbox"
                  checked={checklist.prBranch}
                  onChange={(e) => setChecklist({ ...checklist, prBranch: e.target.checked })}
                />
                <span>Updated pull request PR-42 linked to automated report</span>
              </label>
            </div>
          </div>

          <aside className="v2-hero-sidebar">
            <div className="v2-unlock-target">
              <small>THIS ACTION UNLOCKS</small>
              <b>Live Demonstration Defence</b>
              <span>16 Sep · 10:30 · Engineering Studio 2</span>
            </div>
            <div className="v2-hero-actions">
              <button
                type="button"
                className="primary-button v2-cta"
                onClick={() => openEvidence("DS-907 · End-to-end quality-gate revision")}
              >
                Attach corrected test trace <Icon name="arrow" />
              </button>
              <button
                type="button"
                className="v2-secondary-btn"
                onClick={() => notify("DS-907 revision workspace opened")}
              >
                Open revision details
              </button>
            </div>
          </aside>
        </div>
      </article>

      {/* 2. Main 2-Column Operational Grid */}
      <div className="v2-two-col-grid">
        {/* ================= LEFT COLUMN: Operational Core ("Do Now") ================= */}
        <section className="v2-op-column">
          {/* A. Today's Sprint Tasks */}
          <article className="panel v2-card">
            <PanelHeading
              label="CURRENT SPRINT 04 WORK"
              title="Today's Active Tasks & Deliverables"
              meta="3 active items"
            />
            <div className="v2-task-list">
              {todayTasks.map((task) => (
                <div key={task.id} className={`v2-task-item ${task.urgency}`}>
                  <div className="v2-task-info">
                    <div className="v2-task-meta-top">
                      <span className="v2-task-code">{task.id}</span>
                      <span className="v2-task-role">{task.role}</span>
                      <i className={`status ${task.status.toLowerCase().replaceAll(" ", "-")}`}>{task.status}</i>
                    </div>
                    <h3>{task.title}</h3>
                    <p>
                      <strong>Evidence:</strong> {task.evidence}
                    </p>
                    <div className="v2-task-sub">
                      <span>
                        <Icon name="calendar" /> {task.due}
                      </span>
                      <span>
                        <Icon name="user" /> Reviewer: {task.reviewer}
                      </span>
                    </div>
                  </div>
                  <div className="v2-task-actions">
                    <button
                      type="button"
                      className="v2-action-btn"
                      onClick={() => openEvidence(task.id)}
                      title={`Submit evidence for ${task.id}`}
                    >
                      Upload evidence
                    </button>
                    <button
                      type="button"
                      className="v2-icon-btn"
                      onClick={() => notify(`${task.id} details opened`)}
                      aria-label={`Open details for ${task.id}`}
                    >
                      <Icon name="arrow" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </article>

          {/* B. Team Northstar Pulse (Collaborative Context) */}
          <article className="panel v2-card">
            <PanelHeading
              label="TEAM NORTHSTAR · COHORT COLLABORATION"
              title="Sprint 04 Team Pulse & Shared Goals"
              meta="Level 9 Pod"
            />
            <div className="v2-team-banner">
              <div className="v2-team-goal">
                <small>CURRENT SPRINT GOAL</small>
                <p>Deliver verified full-stack project slice connecting Next.js client, Spring Boot REST endpoints, and PostgreSQL with failure recovery.</p>
              </div>
              <div className="v2-team-blocker">
                <Icon name="alert" />
                <div>
                  <small>SHARED TEAM BLOCKER</small>
                  <b>DUK@360 SSO token contract pending</b>
                  <p>Mock identity adapter active for local integration testing.</p>
                </div>
              </div>
            </div>

            <div className="v2-team-roster">
              {teamMembers.map((member) => (
                <div key={member.name} className="v2-team-row">
                  <span className={`avatar ${member.tone}`}>{member.name.split(" ").map((n) => n[0]).slice(0, 2).join("")}</span>
                  <div className="v2-team-details">
                    <b>{member.name}</b>
                    <small>{member.role}</small>
                    <p>{member.task}</p>
                  </div>
                  <span className={`v2-team-status ${member.status.toLowerCase().replaceAll(" ", "-")}`}>
                    {member.status}
                  </span>
                </div>
              ))}
            </div>
          </article>

          {/* C. Live Git & CI/CD Pipeline Health */}
          <article className="panel v2-card v2-ci-widget">
            <PanelHeading
              label="DEVELOPMENT SIGNAL"
              title="Git & Automated Pipeline Status"
              meta="CI/CD Quality Gate"
            />
            <div className="v2-ci-grid">
              <div className="v2-ci-box">
                <div className="v2-ci-header">
                  <Icon name="brief" />
                  <span>Pull Request #42</span>
                  <em className="status accepted">Merged</em>
                </div>
                <b>Frontend–API Contract Integration</b>
                <small>Approved by Diju M & Krishnasree K</small>
              </div>

              <div className="v2-ci-box failing">
                <div className="v2-ci-header">
                  <Icon name="review" />
                  <span>Playwright Suite</span>
                  <em className="status revision-required">2 Failing</em>
                </div>
                <b>E2E Integration Quality Gate</b>
                <small>14 passed · 2 failed (token-refresh, rollback)</small>
              </div>
            </div>
            <footer className="v2-ci-footer">
              <span>Active branch: <code>feat/ds-907-e2e-quality</code> (Commit <code>8f21bc4</code>)</span>
              <button type="button" onClick={() => notify("CI/CD execution traces opened")}>
                Inspect failure traces <Icon name="arrow" />
              </button>
            </footer>
          </article>

          {/* D. Learning Reflection & Work Log (Compact) */}
          <article className="panel v2-card">
            <PanelHeading
              label="LEARNING REFLECTION"
              title="Sprint Work Log & Decisions"
              meta="Draft record"
            />
            <dl className="v2-log-list">
              <div>
                <dt>Completed</dt>
                <dd>Connected Next.js client to versioned Spring Boot API and verified primary CRUD flows.</dd>
              </div>
              <div>
                <dt>Key Learning</dt>
                <dd>Consistent OpenAPI error schemas significantly reduce defensive frontend boilerplate.</dd>
              </div>
              <div>
                <dt>Next Experiment</dt>
                <dd>Parameterize token expiry in Playwright test harness to prove idempotent retry behavior.</dd>
              </div>
            </dl>
            <div className="v2-log-footer">
              <Icon name="shield" />
              <small>This records authentic learning work; it is not attendance (managed in DUK@360).</small>
            </div>
          </article>
        </section>

        {/* ================= RIGHT COLUMN: Strategic Progress & Outcomes ================= */}
        <aside className="v2-stat-column">
          {/* A. Consolidated Academic & Progression Standing */}
          <article className="panel v2-card v2-score-card">
            <PanelHeading
              label="EVALUATION STANDING"
              title="Academic Marks vs Level Gate"
              meta="Separated records"
            />
            <div className="v2-score-hero">
              <div className="v2-score-primary">
                <b>{academicScore.toFixed(1)}%</b>
                <span>ACADEMIC RESULT</span>
                <small>Course Plan 5-component weighted view</small>
              </div>
              <div className="v2-score-divider" />
              <div className="v2-score-secondary">
                <b>780</b>
                <span>LEVEL 9 GATE PTS</span>
                <small>Ladder Pass band (1,000 max)</small>
              </div>
            </div>

            <div className="v2-score-bars">
              <ScoreRow label="Academic Component Average" value={`${academicScore.toFixed(1)}%`} width={`${academicScore}%`} />
              <ScoreRow label="Level Gate Readiness Score" value="78%" width="78%" purple />
            </div>

            <div className="v2-ladder-pill">
              <span>Current Band: <strong>Ladder Pass</strong></span>
              <small>120 pts to Distinction threshold (90%)</small>
            </div>

            <div className="v2-boundary-note">
              <Icon name="shield" />
              <small>Academic marks, gamification points, certification and attendance remain separate records.</small>
            </div>
          </article>

          {/* B. Upcoming Academic Checkpoint */}
          <article className="panel v2-card v2-checkpoint-card">
            <div className="card-icon">
              <Icon name="calendar" />
            </div>
            <span className="eyebrow">NEXT ACADEMIC CHECKPOINT</span>
            <h3>Full-Stack Live Demonstration</h3>
            <p>Demonstrate integrated workflow, automated test failure handling, and local Docker reproducibility.</p>
            <dl className="v2-checkpoint-meta">
              <div>
                <dt>Date & Time</dt>
                <dd>16 Sep · 10:30 AM</dd>
              </div>
              <div>
                <dt>Review Panel</dt>
                <dd>Krishnasree K · Ajitha V S</dd>
              </div>
              <div>
                <dt>Venue</dt>
                <dd>Engineering Studio 2</dd>
              </div>
            </dl>
            <button
              type="button"
              className="v2-secondary-btn"
              onClick={() => notify("Live demonstration brief opened")}
            >
              Open demonstration brief <Icon name="arrow" />
            </button>
          </article>

          {/* C. Verified Capabilities & Certifications */}
          <article className="panel v2-card">
            <PanelHeading
              label="VERIFIED CAPABILITIES"
              title="Badges & Certification"
              meta="Evidence backed"
            />
            <div className="v2-badge-list">
              <div className="v2-badge-item verified">
                <i className="badge-icon"><Icon name="check" /></i>
                <div>
                  <b>Git & GitHub Professional</b>
                  <small>Level 1 · Repository & PR hygiene</small>
                </div>
              </div>
              <div className="v2-badge-item verified">
                <i className="badge-icon"><Icon name="check" /></i>
                <div>
                  <b>Docker Containerization</b>
                  <small>Level 6 · Multi-stage build evidence</small>
                </div>
              </div>
              <div className="v2-badge-item verified">
                <i className="badge-icon"><Icon name="check" /></i>
                <div>
                  <b>GitHub Actions & Postman</b>
                  <small>Level 8 · Automated pipeline & API tests</small>
                </div>
              </div>
              <div className="v2-badge-item pending">
                <i className="badge-icon"><Icon name="target" /></i>
                <div>
                  <b>AWS SAA-C03 Certification</b>
                  <small>Assessment attached · Verification pending</small>
                </div>
              </div>
            </div>
          </article>

          {/* D. Recent Verifiable Evidence */}
          <article className="panel v2-card">
            <PanelHeading
              label="RECENT EVIDENCE"
              title="Artifact Portfolio"
              meta="18 verified"
            />
            <div className="v2-evidence-list">
              <button
                type="button"
                className="v2-evidence-row"
                onClick={() => notify("PR-42 evidence opened")}
              >
                <span>
                  <Icon name="file" /> PR-42 Frontend–API Integration
                </span>
                <i className="status accepted">Accepted</i>
              </button>
              <button
                type="button"
                className="v2-evidence-row"
                onClick={() => notify("OpenAPI contract opened")}
              >
                <span>
                  <Icon name="file" /> OpenAPI 3.1 Contract & Schemas
                </span>
                <i className="status under-review">Under review</i>
              </button>
              <button
                type="button"
                className="v2-evidence-row"
                onClick={() => notify("Playwright trace report opened")}
              >
                <span>
                  <Icon name="file" /> Playwright E2E Suite (v2)
                </span>
                <i className="status revision-required">Needs revision</i>
              </button>
            </div>
            <button
              type="button"
              className="v2-text-btn full-width"
              onClick={() => notify("Evidence & Portfolio page opened")}
            >
              View complete evidence portfolio <Icon name="arrow" />
            </button>
          </article>
        </aside>
      </div>
    </div>
  );
}
