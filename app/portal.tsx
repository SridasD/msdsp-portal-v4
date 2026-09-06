"use client";

import { useEffect, useId, useMemo, useRef, useState } from "react";
import { EvidenceModal } from "./components/evidence-modal";
import { FilterBar, Icon, Metric, PageHeader, PanelHeading, ScoreRow } from "./components/portal-primitives";
import { StudentDashboardV2 } from "./components/student-dashboard-v2";
import { coordinators, levelCoordination, semesterCoordination } from "./coordination-data";
import { academicComponents, cycles, levelNinePoints, programmeRules, prototypeCohort, sprintData, workspaceIcons, workspaceNavigation, type Cycle, type MentorKind, type Role, type Theme } from "./portal-config";

export default function Portal() {
  const [role, setRole] = useState<Role>("student");
  const [mentorKind, setMentorKind] = useState<MentorKind>("domain");
  const [page, setPage] = useState("Overview");
  const [cycleId, setCycleId] = useState("LC-09");
  const [theme, setTheme] = useState<Theme>("system");
  const [cycleOpen, setCycleOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [evidenceOpen, setEvidenceOpen] = useState(false);
  const [evidenceAssignment, setEvidenceAssignment] = useState<string | undefined>();
  const [studentDashboardMode, setStudentDashboardMode] = useState<"v2" | "classic">("classic");
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [selectedAssignmentId, setSelectedAssignmentId] = useState<string>("DS-907");
  const [toast, setToast] = useState("");
  const searchRef = useRef<HTMLInputElement>(null);
  const appShellRef = useRef<HTMLElement>(null);
  const workspaceRef = useRef<HTMLElement>(null);
  const profileMenuRef = useRef<HTMLDivElement>(null);
  const cycleMenuRef = useRef<HTMLDivElement>(null);
  const cycle = cycles.find((item) => item.id === cycleId) ?? cycles[1];
  const navItems = workspaceNavigation[role];
  const roleProfile = role === "student" ? { initials: "AR", name: "Anakha Rajesh", title: "Postgraduate Student" } : role === "courseHead" ? { initials: "AK", name: "Dr. Ajith Kumar", title: "Course Head" } : mentorKind === "domain" ? { initials: "AV", name: "Ajitha V S", title: "Domain Mentor · QA & Testing" } : { initials: "DM", name: "Diju M", title: "Student-Team Mentor · Code Review" };

  useEffect(() => {
    appShellRef.current?.setAttribute("data-hydrated", "true");
    const restore = window.setTimeout(() => {
      const storedTheme = localStorage.getItem("msdsp-theme") as Theme | null;
      const storedCycle = localStorage.getItem("msdsp-cycle");
      const storedMode = localStorage.getItem("msdsp-student-dashboard-mode") as "v2" | "classic" | null;
      const storedSidebar = localStorage.getItem("msdsp-sidebar-collapsed");
      if (storedTheme) setTheme(storedTheme);
      if (storedCycle && cycles.some((item) => item.id === storedCycle)) setCycleId(storedCycle);
      if (storedSidebar === "true") setSidebarCollapsed(true);
      if (storedMode) {
        setStudentDashboardMode(storedMode);
      } else {
        setStudentDashboardMode("v2");
      }
    }, 0);
    return () => window.clearTimeout(restore);
  }, []);
  useEffect(() => {
    const root = document.documentElement;
    const media = window.matchMedia("(prefers-color-scheme: dark)");
    const apply = () => { root.dataset.theme = theme === "system" ? (media.matches ? "dark" : "light") : theme; };
    apply(); localStorage.setItem("msdsp-theme", theme); media.addEventListener("change", apply);
    return () => media.removeEventListener("change", apply);
  }, [theme]);
  useEffect(() => localStorage.setItem("msdsp-cycle", cycleId), [cycleId]);
  useEffect(() => {
    const handleKeyboard = (event: KeyboardEvent) => {
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "k") {
        event.preventDefault();
        searchRef.current?.focus();
      }
      if (event.key === "Escape") {
        setProfileOpen(false);
        setCycleOpen(false);
        setMobileOpen(false);
      }
    };
    window.addEventListener("keydown", handleKeyboard);
    return () => window.removeEventListener("keydown", handleKeyboard);
  }, []);
  useEffect(() => {
    const closeOutsideMenus = (event: PointerEvent) => {
      const target = event.target as Node;
      if (!profileMenuRef.current?.contains(target)) setProfileOpen(false);
      if (!cycleMenuRef.current?.contains(target)) setCycleOpen(false);
    };
    document.addEventListener("pointerdown", closeOutsideMenus);
    return () => document.removeEventListener("pointerdown", closeOutsideMenus);
  }, []);

  const notify = (message: string) => { setToast(message); window.setTimeout(() => setToast(""), 2600); };
  const focusWorkspace = () => window.requestAnimationFrame(() => workspaceRef.current?.focus());
  const changeRole = (next: Role) => { setRole(next); setPage("Overview"); setMobileOpen(false); focusWorkspace(); };
  const changePage = (next: string, assignmentId?: string) => {
    setPage(next);
    if (assignmentId) setSelectedAssignmentId(assignmentId);
    setMobileOpen(false);
    focusWorkspace();
  };
  const handleOpenEvidence = (assignment?: string) => { setEvidenceAssignment(assignment); setEvidenceOpen(true); };
  const handleDashboardModeChange = (mode: "v2" | "classic") => {
    setStudentDashboardMode(mode);
    localStorage.setItem("msdsp-student-dashboard-mode", mode);
    notify(mode === "v2" ? "Focused Dashboard (v2) activated" : "Classic Overview activated");
  };
  const handleToggleSidebar = () => {
    const next = !sidebarCollapsed;
    setSidebarCollapsed(next);
    localStorage.setItem("msdsp-sidebar-collapsed", String(next));
    notify(next ? "Sidebar collapsed (icons only)" : "Sidebar expanded");
  };

  return <main ref={appShellRef} className={`app-shell ${sidebarCollapsed ? "sidebar-collapsed" : ""}`} data-hydrated="false">
    <a className="skip-link" href="#workspace" onClick={focusWorkspace}>Skip to workspace</a>
    <header className="topbar">
      <button type="button" className="mobile-menu" aria-label={mobileOpen ? "Close navigation" : "Open navigation"} aria-expanded={mobileOpen} aria-controls="primary-navigation" onClick={() => setMobileOpen(!mobileOpen)}><Icon name="menu" /></button>
      <div className="brand" aria-label="MSDSP learning portal"><span className="brand-mark">DUK</span><div><b>MSDSP</b><small>Applied Learning Portal</small></div></div>
      <div className="programme-context"><span>Master of Science</span><b>Data Science & Product Development</b></div>
      <label className="global-search"><Icon name="search" /><input ref={searchRef} type="search" aria-label="Search portal" placeholder="Search assignments, evidence, outcomes…" /><kbd aria-hidden="true">Ctrl K</kbd></label>
      <button className="top-icon" aria-label="Notifications" onClick={() => notify("Three academic updates are unread")}><Icon name="bell" /><i>3</i></button>
      <div ref={profileMenuRef} className="profile-wrap"><button className="profile" aria-haspopup="menu" aria-controls="profile-menu" aria-expanded={profileOpen} onClick={() => setProfileOpen(!profileOpen)}><span>{roleProfile.initials}</span><div><b>{roleProfile.name}</b><small>{roleProfile.title}</small></div><Icon name="chevron" /></button>{profileOpen && <div id="profile-menu" role="menu" className="popover profile-menu"><p>Appearance</p><div className="theme-options">{(["light", "dark", "system"] as Theme[]).map((item) => <button role="menuitemradio" aria-checked={theme === item} key={item} className={theme === item ? "selected" : ""} onClick={() => { setTheme(item); setProfileOpen(false); }}>{item}</button>)}</div><button role="menuitem" onClick={() => notify("Profile opened")}><Icon name="user" />Profile & preferences</button></div>}</div>
    </header>

    <aside className={`sidebar ${sidebarCollapsed ? "collapsed" : ""} ${mobileOpen ? "mobile-open" : ""}`} aria-label="Sidebar navigation">
      <div className="role-switch" role="group" aria-label="Prototype role">
        <button type="button" aria-pressed={role === "student"} className={role === "student" ? "active" : ""} onClick={() => changeRole("student")} title="Student Workspace">
          <span className="role-full">Student</span>
          <span className="role-short" aria-hidden="true">S</span>
        </button>
        <button type="button" aria-pressed={role === "courseHead"} className={role === "courseHead" ? "active" : ""} onClick={() => changeRole("courseHead")} title="Course Head Workspace">
          <span className="role-full">Course Head</span>
          <span className="role-short" aria-hidden="true">CH</span>
        </button>
        <button type="button" aria-pressed={role === "mentor"} className={role === "mentor" ? "active" : ""} onClick={() => changeRole("mentor")} title="Mentor Workspace">
          <span className="role-full">Mentor</span>
          <span className="role-short" aria-hidden="true">M</span>
        </button>
      </div>
      {role === "mentor" && !sidebarCollapsed && <div className="mentor-persona-switch" aria-label="Mentor responsibility"><span>MENTOR RESPONSIBILITY</span><div><button className={mentorKind === "domain" ? "active" : ""} onClick={() => { setMentorKind("domain"); setPage("Overview"); }}>Domain Mentor</button><button className={mentorKind === "team" ? "active" : ""} onClick={() => { setMentorKind("team"); setPage("Overview"); }}>Team Mentor</button></div></div>}
      <p className="nav-label">{role === "student" ? "LEARNING WORKSPACE" : role === "courseHead" ? "COURSE HEAD WORKSPACE" : "MENTOR WORKSPACE"}</p>
      <nav id="primary-navigation" aria-label="Workspace navigation">
        {navItems.map((item) => (
          <button
            type="button"
            key={item}
            aria-current={page === item ? "page" : undefined}
            className={page === item ? "active" : ""}
            onClick={() => changePage(item)}
            title={item}
          >
            <Icon name={workspaceIcons[item] ?? "grid"} />
            <span className="nav-text">{item}</span>
            {item === "Activity Review" && <em aria-label="14 items">14</em>}
          </button>
        ))}
      </nav>

      {/* Sidebar Collapse Toggle Button */}
      <button
        type="button"
        className="sidebar-collapse-toggle"
        aria-label={sidebarCollapsed ? "Expand sidebar navigation" : "Collapse sidebar to icons only"}
        aria-expanded={!sidebarCollapsed}
        title={sidebarCollapsed ? "Expand sidebar" : "Collapse sidebar to icons only"}
        onClick={handleToggleSidebar}
      >
        <Icon name="chevron" />
        <span className="collapse-text">{sidebarCollapsed ? "" : "Collapse sidebar"}</span>
      </button>

      <small className="prototype-label" title={sidebarCollapsed ? "Interactive academic prototype" : undefined}><i /> <span className="prototype-text">Interactive academic prototype</span></small>
    </aside>
    {mobileOpen && <button className="mobile-scrim" aria-label="Close navigation" onClick={() => setMobileOpen(false)} />}

    <section ref={workspaceRef} id="workspace" tabIndex={-1} aria-label={`${role === "courseHead" ? "Course Head" : role === "mentor" ? "Mentor" : "Student"} workspace: ${page}`} className="workspace">
      <div className="workspace-bar"><div className="breadcrumb"><span>{role === "student" ? "Student" : role === "courseHead" ? "Course Head" : "Mentor"}</span><Icon name="chevron" /><b>{page}</b></div><div ref={cycleMenuRef} className="cycle-selector-wrap"><button className="cycle-selector" aria-haspopup="listbox" aria-controls="cycle-menu" aria-expanded={cycleOpen} onClick={() => setCycleOpen(!cycleOpen)}><span className="cycle-code">{cycle.id}</span><span><small>{cycle.semester} · Official Level {cycle.level}</small><b>{cycle.title}</b></span><em className={`status ${cycle.status.toLowerCase()}`}>{cycle.status}</em><Icon name="chevron" /></button>{cycleOpen && <div id="cycle-menu" role="listbox" aria-label="Learning Cycle" className="popover cycle-menu"><p>SELECT LEARNING CYCLE</p>{cycles.map((item) => <button role="option" aria-selected={item.id === cycleId} key={item.id} className={item.id === cycleId ? "selected" : ""} onClick={() => { setCycleId(item.id); setCycleOpen(false); notify(`${item.id} selected`); }}><span className="cycle-code">{item.id}</span><span><b>{item.title}</b><small>{item.semester} · Level {item.level} · {item.weeks}</small></span><i className={`status ${item.status.toLowerCase()}`}>{item.status}</i></button>)}</div>}</div></div>
      <div key={`${role}-${mentorKind}-${page}-${cycleId}-${studentDashboardMode}`} className="page-enter">{role === "student" ? <StudentWorkspace page={page} cycle={cycle} openEvidence={handleOpenEvidence} notify={notify} dashboardMode={studentDashboardMode} setDashboardMode={handleDashboardModeChange} onNavigate={changePage} selectedAssignmentId={selectedAssignmentId} setSelectedAssignmentId={setSelectedAssignmentId} /> : role === "courseHead" ? <FacultyWorkspace page={page} cycle={cycle} notify={notify} /> : <MentorWorkspace page={page} cycle={cycle} mentorKind={mentorKind} notify={notify} />}</div>
    </section>
    {evidenceOpen && <EvidenceModal defaultAssignment={evidenceAssignment} close={() => { setEvidenceOpen(false); setEvidenceAssignment(undefined); }} save={() => { setEvidenceOpen(false); notify(`Evidence saved to ${evidenceAssignment ?? "DS-904"}`); setEvidenceAssignment(undefined); }} />}
    <div className="toast-region" aria-live="polite" aria-atomic="true">{toast && <div className="toast"><Icon name="check" />{toast}</div>}</div>
  </main>;
}

function StudentWorkspace({ page, cycle, openEvidence, notify, dashboardMode, setDashboardMode, onNavigate, selectedAssignmentId, setSelectedAssignmentId }: { page: string; cycle: Cycle; openEvidence: (assignment?: string) => void; notify: (message: string) => void; dashboardMode: "v2" | "classic"; setDashboardMode: (mode: "v2" | "classic") => void; onNavigate: (page: string, assignmentId?: string) => void; selectedAssignmentId: string; setSelectedAssignmentId: (id: string) => void }) {
  if (page === "Work Board") return <Workboard openEvidence={() => openEvidence(selectedAssignmentId)} notify={notify} onNavigate={onNavigate} selectedAssignmentId={selectedAssignmentId} onSelectAssignment={setSelectedAssignmentId} />;
  if (page === "Evidence & Portfolio") return <EvidenceLibrary openEvidence={() => openEvidence()} notify={notify} onNavigate={onNavigate} />;
  if (page === "Skills & Outcomes") return <OutcomesPage notify={notify} onNavigate={onNavigate} openEvidence={openEvidence} />;
  if (page === "Faculty Feedback") return <FeedbackPage notify={notify} onNavigate={onNavigate} openEvidence={openEvidence} selectedAssignmentId={selectedAssignmentId} onSelectAssignment={setSelectedAssignmentId} />;
  if (page === "Calendar") return <StudentCalendar notify={notify} onNavigate={onNavigate} />;
  if (page === "Performance & Results") return <PerformancePage notify={notify} onNavigate={onNavigate} />;
  if (page === "Information Centre") return <StudentInformationCentre notify={notify} />;
  if (dashboardMode === "v2") {
    return <StudentDashboardV2 cycle={cycle} openEvidence={openEvidence} notify={notify} onSwitchToClassic={() => setDashboardMode("classic")} onNavigate={onNavigate} />;
  }
  return <StudentOverviewWithToggle cycle={cycle} openEvidence={() => openEvidence()} notify={notify} onSwitchToV2={() => setDashboardMode("v2")} />;
}

function StudentOverviewWithToggle({ cycle, openEvidence, notify, onSwitchToV2 }: { cycle: Cycle; openEvidence: () => void; notify: (message: string) => void; onSwitchToV2: () => void }) {
  return (
    <>
      <div className="v2-top-controls classic-banner">
        <div className="v2-mode-selector" role="group" aria-label="Dashboard presentation style">
          <span className="v2-mode-label">DASHBOARD VIEW:</span>
          <button type="button" className="v2-mode-pill" aria-pressed="false" onClick={onSwitchToV2}>
            <Icon name="target" /> Focused (v2)
          </button>
          <button type="button" className="v2-mode-pill active" aria-pressed="true">
            <Icon name="grid" /> Classic Overview
          </button>
        </div>
        <button type="button" className="v2-switch-btn" onClick={onSwitchToV2}>
          Switch to Focused Dashboard (v2) →
        </button>
      </div>
      <StudentOverview cycle={cycle} openEvidence={openEvidence} notify={notify} />
    </>
  );
}

function StudentOverview({ cycle, openEvidence, notify }: { cycle: Cycle; openEvidence: () => void; notify: (message: string) => void }) {
  const levelRoute = [["L6", "Complete"], ["L7", "Complete"], ["L8", "Complete"], ["L9", "Current"], ["L10", "Locked"]];
  const quests = [
    ["complete", "Frontend–backend integration", "Connect the React/Next.js client to versioned backend services", "230 / 250 pts"],
    ["current", "End-to-end test suite", "Prove priority journeys through API and browser automation", "170 / 200 pts"],
    ["review", "AWS SAA-C03 certification", "Attach the external result for independent verification", "160 / 200 pts · provisional"],
    ["current", "Full-stack live demonstration", "Demonstrate the integrated solution and defend failure handling", "120 / 200 pts"],
    ["complete", "Code review and documentation", "Close review findings and maintain an auditable delivery guide", "100 / 150 pts"],
  ];

  return <><PageHeader eyebrow="THURSDAY · 03 SEPTEMBER" title="Good afternoon, Anakha Rajesh" description="Level 9 is focused on integrating, testing and demonstrating a production-minded full-stack solution. Your next priority is to close the end-to-end quality gate." action="Record learning evidence" onAction={openEvidence} />
    <article className="next-action-card"><div className="next-action-icon"><Icon name="target" /></div><div><span>YOUR NEXT BEST ACTION</span><h2>Resolve the two failing end-to-end scenarios</h2><p>Repair token refresh and transaction rollback, attach the Playwright traces, then request QA review for DS-907.</p><div><small>Revision due · 05 September</small><small>Reviewer · Ajitha V S</small><small>Unlocks · Live demonstration readiness</small></div></div><button onClick={() => notify("DS-907 revision workspace opened")}>Open DS-907 revision <Icon name="arrow" /></button></article>
    <section className="game-command"><div className="game-command-copy"><span className="game-status"><i /> ACTIVE LEVEL · DRAFT GAMIFICATION RUBRIC</span><p>{cycle.semester} · {cycle.id} · {cycle.weeks}</p><h2>{cycle.title}</h2><p>Integrate the user interface, backend services, PostgreSQL data layer and automated tests into a coherent working product. Progress is earned through verifiable technical evidence, professional review and an approved live demonstration—not time spent online.</p><div className="level-route">{levelRoute.map((item, index) => <button key={item[0]} className={index < 3 ? "complete" : index === 3 ? "current" : "locked"} onClick={() => notify(`${item[0]} progression record opened`)}><i>{index < 3 ? <Icon name="check" /> : item[0]}</i><span><b>{item[0]}</b><small>{item[1]}</small></span></button>)}</div></div><aside className="game-score"><span className="score-orbit"><b>780</b><small>/ 1,000 points</small></span><div><small>CURRENT BAND</small><h3>Ladder Pass</h3><p>120 points to Distinction threshold</p><div className="game-meter"><i style={{ width: "78%" }} /></div><footer><span><b>78%</b>Level gate</span><span><b>{cycle.progress}%</b>Sprint progress</span></footer></div><em>Gamification is provisional and separate from academic marks.</em></aside></section>
    <section className="academic-brief"><div className="brief-copy"><span className="eyebrow">ACADEMIC CONTEXT</span><h2>Semester II · Backend & AI / Full Stack Engineering</h2><p>Build a functional full-stack solution in the local environment by integrating backend CRUD services, reliable data persistence, automated delivery controls and professional technical documentation.</p><div className="brief-tags"><span>Bloom · Analyze, Evaluate & Create</span><span>Kolb · Active experimentation</span><span>CS102 · CS103 · CS104 · CS105</span><span>PO2 · PO3 · PO4 · PO8</span></div></div><div className="level-visual"><div className="level-ring"><b>{cycle.level}</b><span>Current Level</span></div><div><small>NEXT ACADEMIC CHECKPOINT</small><b>Full-stack integration review</b><span>16 September · 10:30</span></div></div></section>
    <article className="panel pedagogy-strip" tabIndex={0} aria-label="Experiential learning scaffold; scroll horizontally to review all stages"><div><span className="eyebrow">EXPERIENTIAL LEARNING SCAFFOLD</span><b>Current position · Active experimentation</b></div>{[["01", "Experience", "Run the integrated service"], ["02", "Reflect", "Inspect failures and traces"], ["03", "Conceptualise", "Refine contracts and boundaries"], ["04", "Experiment", "Rework, test and demonstrate"]].map((item, index) => <span className={index < 3 ? "complete" : "current"} key={item[0]}><i>{index < 3 ? <Icon name="check" /> : item[0]}</i><p><b>{item[1]}</b><small>{item[2]}</small></p></span>)}</article>
    <div className="metric-grid"><Metric icon="award" label="Level points" value="780" meta="Draft Level 9 rubric · 1,000 maximum" trend="+80 from reviewed evidence" tone="indigo" /><Metric icon="file" label="Integration evidence" value="18/22" meta="Accepted or under review" trend="4 quality gates open" tone="cyan" /><Metric icon="target" label="Competency coverage" value="12/16" meta="PO and PSO evidence" trend="PO3 and PO4 advancing" tone="violet" /><Metric icon="review" label="Review actions" value="3" meta="Code · QA · live demo" trend="Attendance excluded" tone="gold" /></div>
    <div className="student-record-grid"><article className="panel badge-register"><PanelHeading label="VERIFIED ACHIEVEMENTS" title="Professional capability badges" meta="Evidence-backed" /><div>{[["Git & GitHub", "Level 1 · Git repository evidence", "Verified"], ["Docker", "Level 6 · containerised solution", "Verified"], ["GitHub Actions & Postman", "Level 8 · pipeline and API evidence", "Verified"], ["Full Stack Integration & Testing", "Level 9 · DS-904 / DS-907", "In progress"]].map((item, index) => <button key={item[0]} onClick={() => notify(`${item[0]} evidence trail opened`)}><i className={index < 3 ? "verified" : "progressing"}><Icon name={index < 3 ? "check" : "target"} /></i><span><b>{item[0]}</b><small>{item[1]}</small></span><em>{item[2]}</em><Icon name="arrow" /></button>)}</div></article><article className="panel course-progress"><PanelHeading label="COURSES & ONLINE CERTIFICATION" title="Completion and verification record" meta="Separate from attendance" /><div>{[["CS102", "Full Stack Architecture & Cloud-Native Development", "Digital University Kerala", "Completed"], ["CS103", "Modern Backend Systems & Data Engineering", "Digital University Kerala", "In progress"], ["CS105", "DevOps & Automated Pipelines", "Digital University Kerala", "In progress"], ["AWS", "SAA-C03 certification", "AWS · result evidence supplied", "Verification pending"]].map((item) => <button key={item[0]} onClick={() => notify(`${item[1]} record opened`)}><span><i>{item[0]}</i><b>{item[1]}</b><small>{item[2]}</small></span><em className={`status ${item[3].toLowerCase().replaceAll(" ", "-")}`}>{item[3]}</em></button>)}</div></article></div>
    <div className="game-grid"><article className="panel quest-board"><PanelHeading label="LEVEL 9 QUESTS" title="Professional evidence that advances integration mastery" meta="Shared rubric · 1,000 pts" /><div>{quests.map((quest, index) => <button key={quest[1]} className={quest[0]} onClick={() => notify(`${quest[1]} opened`)}><i>{quest[0] === "complete" ? <Icon name="check" /> : index + 1}</i><span><b>{quest[1]}</b><small>{quest[2]}</small></span><em>{quest[3]}</em><Icon name="arrow" /></button>)}</div></article><aside className="panel achievement-shelf"><PanelHeading label="COMPETENCY RECOGNITION" title="Faculty-verified professional milestones" meta="No attendance rewards" /><div><span className="earned"><i><Icon name="check" /></i><p><b>API Contract Verified</b><small>OpenAPI contract approved and traceable</small></p></span><span className="earned"><i><Icon name="network" /></i><p><b>Full-Stack Integrator</b><small>Priority frontend and backend flows connected</small></p></span><span className="progressing"><i><Icon name="target" /></i><p><b>Quality Gate</b><small>Two end-to-end scenarios remain unstable</small></p></span><span className="locked"><i><Icon name="shield" /></i><p><b>Level 9 Distinction</b><small>Requires 90% gate score and approved demonstration</small></p></span></div><button onClick={() => notify("Achievement criteria opened")}>View recognition criteria <Icon name="arrow" /></button></aside></div>
    <div className="student-operations"><article className="panel today-plan"><PanelHeading label="TODAY'S WORK PLAN" title="Three integration outcomes" meta="03 September" /><div>{[["In progress", "DS-904", "Stabilise the authenticated project-submission workflow", "QA evidence due · 15:00"], ["Planned", "DS-905", "Complete PostgreSQL migration and API contract checks", "Code review · 16:30"], ["Revision", "DS-907", "Resolve failing Playwright scenarios and update the runbook", "Resubmit · 05 Sep"]].map((task, index) => <button key={task[1]} onClick={() => notify(`${task[1]} work item opened`)}><i className={`task-state s${index}`}>{task[0]}</i><span><b>{task[1]} · {task[2]}</b><small>{task[3]}</small></span><Icon name="arrow" /></button>)}</div></article><article className="panel activity-log-card"><PanelHeading label="LATEST ACTIVITY LOG" title="Learning-work record" meta="Draft" /><dl><div><dt>Completed</dt><dd>Connected the Next.js client to the versioned Spring Boot API and verified the main CRUD workflow.</dd></div><div><dt>Learning</dt><dd>Shared validation rules and stable API error contracts reduce duplicate frontend handling.</dd></div><div><dt>Blocker</dt><dd>The production SSO claims and token contract from DUK@360 are not yet available.</dd></div><div><dt>Next plan</dt><dd>Replace the mock identity adapter when approved, rerun Playwright and attach the trace report.</dd></div></dl><button onClick={() => notify("Activity log editor opened")}>Update activity log <Icon name="arrow" /></button><p><Icon name="shield" /> This records project work and learning; it is not attendance.</p></article></div>
    <div className="primary-grid"><article className="panel focus-card"><PanelHeading label="PRIORITY ASSIGNMENT" title="DS-904 · Full-stack integration and test readiness" meta="Faculty review · 14 September" /><p className="lead">Deliver an integrated full-stack product slice with a responsive client, versioned REST API, PostgreSQL persistence, role-aware access, automated tests and a reproducible local runbook.</p><div className="focus-facts"><span><small>REQUIRED PROFESSIONAL ARTIFACTS</small><b>OpenAPI specification · pull request · schema migration · E2E report · deployment guide</b></span><span><small>CONSTRAINTS & DEPENDENCIES</small><b>DUK@360 SSO boundary · RBAC · secrets · accessibility · API versioning · rollback</b></span></div><div className="stage-track">{["Brief", "Build", "Integrate", "Verify", "Demonstrate"].map((stage, i) => <button key={stage} className={i < 3 ? "done" : i === 3 ? "current" : ""} onClick={() => notify(`${stage} stage opened`)}><i>{i < 3 ? <Icon name="check" /> : i + 1}</i><span>{stage}</span></button>)}</div><div className="evidence-gaps"><Icon name="alert" /><div><b>Two failing scenarios block the live demonstration</b><p>Resolve token refresh and transaction rollback failures, then attach the automated test trace and reviewed pull request.</p></div><button onClick={openEvidence}>Add evidence</button></div></article>
      <aside className="side-stack"><article className="panel checkpoint-card"><div className="card-icon"><Icon name="calendar" /></div><span className="eyebrow">NEXT ACADEMIC CHECKPOINT</span><h3>Full-stack live demonstration</h3><p>Demonstrate the integrated workflow, automated tests, failure recovery and reproducible local setup.</p><dl><div><dt>Date</dt><dd>16 Sep · 10:30</dd></div><div><dt>Review panel</dt><dd>Krishnasree K · Ajitha V S</dd></div><div><dt>Venue</dt><dd>Engineering Studio 2</dd></div></dl><button onClick={() => notify("Preparation brief opened")}>Open demonstration brief <Icon name="arrow" /></button></article><article className="panel mentor-note"><span className="avatar">KK</span><div><small>MENTOR NOTE</small><p>“Show the contract, the failure path and the recovery—not only the successful screen flow.”</p><button onClick={() => notify("Faculty feedback opened")}>View full feedback</button></div></article></aside></div>
    <article className="panel sprint-panel"><PanelHeading label="LEARNING CYCLE ROADMAP" title="Five weekly full-stack engineering sprints" meta={`${cycle.weeks} · ${cycle.progress}% complete`} /><div className="sprint-roadmap">{sprintData.map((sprint, i) => <button key={sprint.no} className={i < 3 ? "done" : i === 3 ? "current" : ""} onClick={() => notify(`Sprint ${sprint.no} opened`)}><span className="sprint-number">{sprint.no}</span><div><small>{sprint.state}</small><b>{sprint.name}</b><p>{sprint.detail}</p></div>{i < 4 && <i className="connector" />}</button>)}</div></article>
    <div className="secondary-grid"><article className="panel evidence-table"><PanelHeading label="EVIDENCE STUDIO" title="Recent full-stack engineering evidence" meta="18 ready" /><div className="list-head"><span>Evidence</span><span>Academic purpose</span><span>Status</span><span>Updated</span></div>{[["PR-42 · Frontend–API integration", "Cloud-native systems · PO2", "Accepted", "Today"], ["OpenAPI contract & Postman collection", "Distributed backend · PO3", "Under review", "Yesterday"], ["Playwright end-to-end report", "DevOps quality · PO4", "Revision required", "30 Aug"]].map((row) => <button key={row[0]} onClick={() => notify(`${row[0]} opened`)}><span><i className="doc-icon"><Icon name="file" /></i><b>{row[0]}</b></span><span>{row[1]}</span><span><i className={`status ${row[2].toLowerCase().replace(" ", "-")}`}>{row[2]}</i></span><span>{row[3]} <Icon name="arrow" /></span></button>)}</article><article className="panel score-card"><PanelHeading label="SEPARATE RESULTS" title="Academic and gamification standing" meta="Gamification provisional" /><div className="score-main"><div><b>82.4</b><span>% academic</span></div><i>Ladder Pass · 780 pts</i></div><ScoreRow label="Academic performance" value="82.4%" width="82.4%" /><ScoreRow label="Level gate score" value="78%" width="78%" purple /><div className="score-separator" /><p><Icon name="shield" /> Academic marks, gamification points, certification and attendance remain separate records.</p></article></div>
  </>;
}

function CourseDetails({ notify }: { notify: (message: string) => void }) {
  const coreCourses = [
    ["CS101", "Advanced AI & Machine Learning", "Data engineering, deep learning, optimisation, explainability and model deployment."],
    ["CS102", "Full Stack Architecture & Cloud-Native Development", "Multi-tier architecture, API orchestration, containerisation and cloud-native deployment."],
    ["CS103", "Modern Backend Systems & Data Engineering", "Advanced databases, event streaming, asynchronous processing and ETL/ELT orchestration."],
    ["CS104", "API Design & Microservices Orchestration", "API contracts, service decomposition, gateways, resilience and distributed tracing."],
    ["CS105", "DevOps & Automated Pipelines", "CI/CD, infrastructure as code, GitOps, MLOps, observability and operational feedback."],
  ];
  const semesterPlan = [
    ["I", "Foundation & Ideation", "CS101 · CS102 · three elective areas", "Market research, technology-stack selection and UI/UX prototype", "Validated idea, architecture blueprint and high-fidelity UI prototype"],
    ["II", "Backend & AI / Full Stack Engineering", "CS103 · CS105 · three electives", "AI model and backend CRUD development", "Functional backend with a trained AI model or full-stack solution"],
    ["III", "Integration & Cloud Orchestration", "CS104 · four electives", "Middle-layer integration, third-party APIs and cloud deployment", "Fully integrated live digital product"],
    ["IV", "Solution Evaluation, Report & Viva", "Final Project · 12 credits · Report and Viva · 8 credits", "Six-month final project within DUK CDIPD Lab", "Final solution/product evaluation, report and viva voce"],
  ];
  const outcomes = [
    ["PO1", "Apply AI/ML techniques to design intelligent systems"], ["PO2", "Architect scalable cloud-native full-stack systems"],
    ["PO3", "Design distributed backend and real-time data systems"], ["PO4", "Implement DevOps, CI/CD and MLOps workflows"],
    ["PO5", "Translate business requirements into validated products"], ["PO6", "Apply ethical AI, cybersecurity and governance frameworks"],
    ["PO7", "Conduct experimentation, benchmarking and optimisation"], ["PO8", "Demonstrate industry readiness and professional competence"],
  ];

  return <><PageHeader eyebrow="COURSE DETAILS · FACULTY REFERENCE" title="M.Sc. Data Science and Product Development" description="A faculty-only reference aligned to the current Digital University Kerala programme page and the shared Course Plan. Conflicting draft values are shown as governance decisions, not hidden assumptions." />
    <section className="programme-hero"><div><span className="programme-kicker">TWO-YEAR · WORK-IMMERSIVE LEARNING PROGRAMME</span><h2>Academic learning mapped directly to real project work</h2><p>The programme integrates artificial intelligence, data systems, full-stack engineering, cloud, DevOps and product development. Academic credits, assessment and learning outcomes are mapped to project tasks, assignments and deliverables.</p><div className="programme-tags"><span>AI and Data Science</span><span>Full-stack systems</span><span>Cloud and MLOps</span><span>Product development</span><span>Governance and security</span></div></div><aside><span className="programme-orbit"><b>{programmeRules.creditTotal.displayValue}</b><small>{programmeRules.creditTotal.label}</small></span><div><small>CURRENT PUBLISHED STRUCTURE</small><b>2 years · 4 semesters</b><p>Continuous project-integrated learning with one project outcome in each semester. Credit totals remain subject to Programme Board confirmation.</p><i className="decision-reference">{programmeRules.creditTotal.decisionId} · {programmeRules.creditTotal.status}</i><a href="https://cdipd.duk.ac.in/mdspd.html" target="_blank" rel="noreferrer">Open official programme page <Icon name="arrow" /></a></div></aside></section>
    <div className="programme-stats"><span><Icon name="calendar" /><div><b>2 years</b><small>Programme duration</small></div></span><span><Icon name="layers" /><div><b>4 × 20</b><small>Semesters and credits</small></div></span><span><Icon name="book" /><div><b>5</b><small>Mandatory core subjects</small></div></span><span><Icon name="award" /><div><b>17</b><small>Published elective pool</small></div></span></div>

    <article className="panel source-register"><div><Icon name="shield" /><span><small>CONTENT CONTROL</small><b>Official page is the current public reference</b><p>The Course Plan, dashboard FRS, gamification rubric and coordination workbook remain working documents. Portal rules derived from them are marked provisional until academic approval.</p></span></div><div><span><small>PUBLISHED ELECTIVE REQUIREMENT</small><b>12 of 17 skill areas</b><p>The shared Course Plan states 10 of 17. Programme Board confirmation is required before enforcing either value.</p></span><i>Decision pending</i></div></article>

    <article className="panel semester-architecture"><PanelHeading label="SEMESTER-WISE LEARNING STRUCTURE" title="Four progressive product outcomes" meta="Published proposal · 20 credits per semester" /><div className="semester-course-grid">{semesterPlan.map((item) => <button key={item[0]} onClick={() => notify(`Semester ${item[0]} details opened`)}><span>{item[0]}</span><div><small>SEMESTER {item[0]}</small><h3>{item[1]}</h3><p><b>Academic structure</b>{item[2]}</p><p><b>Project work</b>{item[3]}</p><p><b>Expected outcome</b>{item[4]}</p></div><Icon name="arrow" /></button>)}</div></article>

    <div className="course-details-grid"><section><article className="panel curriculum-panel"><PanelHeading label="MANDATORY CORE SUBJECTS" title="Five connected engineering domains" meta="Course Plan reference" /><div className="curriculum-grid">{coreCourses.map(([code, title, description], index) => <button key={code} onClick={() => notify(`${code} course details opened`)}><span className={`domain-number d${index + 1}`}>{String(index + 1).padStart(2, "0")}</span><div><small>{code}</small><h3>{title}</h3><p>{description}</p></div><Icon name="arrow" /></button>)}</div></article></section>
      <aside className="course-side-stack"><article className="panel delivery-model"><PanelHeading label="WORK-IMMERSIVE DELIVERY" title="Evidence from project activity" meta="Faculty monitored" /><div className="learning-loop">{[["01", "Plan", "Sprint work plan"], ["02", "Perform", "Project task"], ["03", "Record", "Activity and evidence"], ["04", "Review", "Mentor feedback"], ["05", "Present", "Monthly evaluation"]].map((item, index) => <span key={item[0]}><i>{item[0]}</i><p><b>{item[1]}</b><small>{item[2]}</small></p>{index < 4 && <em />}</span>)}</div></article><article className="panel academic-boundaries"><Icon name="shield" /><div><span className="eyebrow">SYSTEM BOUNDARY</span><h3>Attendance remains in DUK@360</h3><p>MSDSP records learning work and evidence. Login time, time spent, submission frequency and after-hours work are not attendance and do not determine academic performance.</p></div></article></aside></div>

    <article className="panel outcomes-register"><PanelHeading label="PROGRAMME OUTCOMES" title="Verifiable graduate capabilities" meta="PO1–PO8" /><div>{outcomes.map(([code, label]) => <span key={code}><i>{code}</i><p>{label}</p></span>)}</div><footer><b>Programme-Specific Outcomes</b><p>PSO1 · AI-powered full-stack products end-to-end</p><p>PSO2 · Microservices-based cloud platforms</p><p>PSO3 · AI deployment through DevOps and MLOps</p><p>PSO4 · Compliant, secure and quality-assured systems</p></footer></article>

    <article className="panel assessment-framework"><div className="assessment-intro"><span className="eyebrow">COURSE PLAN ASSESSMENT FRAMEWORK</span><h2>Transparent, evidence-backed evaluation</h2><p>Academic marks remain separate from gamification points and progression status. The scope and aggregation level of these draft component weights must be confirmed before production use.</p></div><div className="assessment-bars">{academicComponents.map(([name, , weight]) => <span key={name}><p><b>{name}</b><small>{weight}%</small></p><i><em style={{ width: `${weight * 2}%` }} /></i></span>)}</div></article>
  </>;
}

const mermaidCharts = [
  {
    id: "structure",
    label: "Programme structure",
    title: "Programme to evidence",
    source: `flowchart TD
    subgraph Delivery ["Agile Delivery Architecture"]
      P["MSDSP Master Programme"] --> S["4 Semesters"]
      S --> L["20 Learning Cycles / Levels"]
      L --> SP["5 Weekly Sprints per Level"]
      SP --> A["Assignments and Workplace Tasks"]
    end
    subgraph Academic ["Academic Curriculum Framework"]
      C["Academic Courses"] --> U["Course Units"]
      U --> A
      C --> CR["Approved Course Credits"]
    end
    subgraph Evidence ["Verifiable Proof & Outcomes"]
      A --> E["Deliverables & Evidence Artifacts"]
      E --> PO["PO1–PO8 & PSO1–PSO4 Mappings"]
      E --> CR
    end
    classDef governance fill:#3448A6,color:#FFFFFF,stroke:#24347C,stroke-width:2px
    classDef academic fill:#DFE7FF,color:#16244C,stroke:#5269D6,stroke-width:1.5px
    classDef student fill:#FFF0CF,color:#4D3410,stroke:#C88922,stroke-width:1.5px
    classDef evidence fill:#DDF5E7,color:#153A27,stroke:#32965F,stroke-width:1.5px
    class P governance
    class S,L,SP,C,U academic
    class A student
    class E,CR,PO evidence`,
  },
  {
    id: "creation",
    label: "Level creation",
    title: "Governed Level publication",
    source: `flowchart TD
    subgraph Governance ["Academic Governance Layer"]
      PB["Programme Board approves rules"] --> CH["Course Head configures programme master"]
      CH --> LC["Course Head creates Learning Cycle master"]
    end
    subgraph Planning ["Level & Sprint Planning"]
      LC --> CO["Level Coordinator prepares delivery plan"]
      CO --> MT["Mentor Team drafts Sprints, briefs & rubrics"]
      MT --> AP["Level Coordinator quality reviews submission"]
    end
    subgraph Publication ["Publication & Activation"]
      AP --> PU["Course Head approves & publishes Level"]
      PU --> AL["Learners and mentors assigned to workspace"]
    end
    classDef governance fill:#3448A6,color:#FFFFFF,stroke:#24347C,stroke-width:2px
    classDef decision fill:#EEE4FF,color:#362052,stroke:#7B5BC4,stroke-width:1.5px
    classDef mentor fill:#DDF7F2,color:#123D3A,stroke:#218C7E,stroke-width:1.5px
    classDef student fill:#FFF0CF,color:#4D3410,stroke:#C88922,stroke-width:1.5px
    class PB,CH,LC,PU governance
    class CO,AP decision
    class MT mentor
    class AL student`,
  },
  {
    id: "level-one",
    label: "Level 1 allocation",
    title: "Orientation and Foundations",
    source: `flowchart TD
    subgraph Leadership ["Level 1 Leadership"]
      L1["Level 1: Orientation and Foundations"] --> V["Lead: Vyga V R"]
    end
    subgraph Mentorship ["Mentorship Support Structure"]
      V --> SS["Sprint support: Soorya Krishnan G"]
      V --> SM["Student success: Smitha Surendran"]
      L1 --> GH["Git & GitHub professional track"]
    end
    subgraph Cohort ["Prototype Student Cohort"]
      L1 --> CO["Five-student prototype cohort"]
      CO --> A["Alfin"]
      CO --> AR["Anakha Rajesh"]
      CO --> AN["Annamma"]
      CO --> RS["Annrosna"]
      CO --> DG["Dhanush Girish"]
    end
    classDef governance fill:#3448A6,color:#FFFFFF,stroke:#24347C,stroke-width:2px
    classDef decision fill:#EEE4FF,color:#362052,stroke:#7B5BC4,stroke-width:1.5px
    classDef mentor fill:#DDF7F2,color:#123D3A,stroke:#218C7E,stroke-width:1.5px
    classDef student fill:#FFF0CF,color:#4D3410,stroke:#C88922,stroke-width:1.5px
    classDef evidence fill:#DDF5E7,color:#153A27,stroke:#32965F,stroke-width:1.5px
    class L1 governance
    class V decision
    class SS,SM mentor
    class GH evidence
    class CO,A,AR,AN,RS,DG student`,
  },
  {
    id: "student",
    label: "Student delivery",
    title: "Brief to professional evidence",
    source: `flowchart TD
    subgraph Discovery ["Sprint Discovery & Briefing"]
      B["Receive Sprint Brief & Outcomes"] --> U["Understand constraints & criteria"]
      U --> P["Prepare personal or team execution plan"]
    end
    subgraph Execution ["Work Board Active Execution"]
      P --> W["Implement workplace engineering tasks"]
      W --> R["Record architectural decisions & commits"]
      R --> T["Execute automated tests & local quality gates"]
    end
    subgraph EvidenceSubmission ["Accredited Evidence Submission"]
      T --> E["Attach PRs, traces & runbooks to Evidence"]
      E --> S["Submit for faculty & mentor evaluation"]
    end
    classDef academic fill:#DFE7FF,color:#16244C,stroke:#5269D6,stroke-width:1.5px
    classDef student fill:#FFF0CF,color:#4D3410,stroke:#C88922,stroke-width:1.5px
    classDef evidence fill:#DDF5E7,color:#153A27,stroke:#32965F,stroke-width:1.5px
    class B academic
    class U,P,W,R,T student
    class E,S evidence`,
  },
  {
    id: "mentor",
    label: "Mentor review",
    title: "Evidence-led mentoring loop",
    source: `flowchart TD
    subgraph Preparation ["Mentor Calibration"]
      A["Accept Level Allocation"] --> C["Calibrate rubric and quality gates"]
      C --> M["Conduct mentoring checkpoint"]
    end
    subgraph ReviewGate ["Review & Evaluation Gate"]
      M --> I["Inspect workplace code & artifacts"]
      I --> J{"Evidence meets criteria?"}
    end
    subgraph RemediationTrack ["Structured Rework Loop"]
      J -- "Deficiencies found" --> R["Issue 3-column critique dossier"]
      R --> RW["Student executes fix on Work Board"]
      RW --> RS["Review resubmitted test traces"]
      RS --> J
    end
    subgraph Endorsement ["Accreditation & Approval"]
      J -- "Standards verified" --> V["Validate competency achievement"]
      V --> REC["Submit formal recommendation"]
      REC --> CH["Course Head final signoff"]
    end
    classDef governance fill:#3448A6,color:#FFFFFF,stroke:#24347C,stroke-width:2px
    classDef mentor fill:#DDF7F2,color:#123D3A,stroke:#218C7E,stroke-width:1.5px
    classDef evidence fill:#DDF5E7,color:#153A27,stroke:#32965F,stroke-width:1.5px
    classDef revision fill:#FFE1E6,color:#501C28,stroke:#C84D62,stroke-width:1.5px
    classDef decision fill:#EEE4FF,color:#362052,stroke:#7B5BC4,stroke-width:2px
    class A,C,M mentor
    class I,V evidence
    class R,RW,RS revision
    class J,REC decision
    class CH governance`,
  },
  {
    id: "assessment",
    label: "Assessment and credits",
    title: "Academic and progression separation",
    source: `flowchart TD
    subgraph FormalDegree ["Official Degree Assessment (GPA & Credits)"]
      E["Reviewed Authentic Evidence"] --> FE["Authorised Faculty Evaluation"]
      FE --> AS["5 Course Plan Component Scores (82.1%)"]
      AS --> CH["Course Head Formal Approval"]
      CH --> CR["Official Course Result & Degree Credits"]
    end
    subgraph VelocityPace ["Continuous Sprint Velocity (Quest Points)"]
      E --> MR["Mentor Recommendation"]
      MR --> GP["Formative Quest Points (780 / 1000 QP)"]
      GP --> LG["Level Gate Readiness Check"]
      LG --> PD["Progression Recommendation"]
    end
    subgraph ExternalERP ["Authoritative External System"]
      AT["DUK@360 ERP Attendance"] -. "Statutory Attendance Boundary" .-> PD
    end
    classDef governance fill:#3448A6,color:#FFFFFF,stroke:#24347C,stroke-width:2px
    classDef academic fill:#DFE7FF,color:#16244C,stroke:#5269D6,stroke-width:1.5px
    classDef mentor fill:#DDF7F2,color:#123D3A,stroke:#218C7E,stroke-width:1.5px
    classDef evidence fill:#DDF5E7,color:#153A27,stroke:#32965F,stroke-width:1.5px
    classDef decision fill:#EEE4FF,color:#362052,stroke:#7B5BC4,stroke-width:2px
    classDef external fill:#EDF0F5,color:#263246,stroke:#8591A3,stroke-width:1.5px,stroke-dasharray:5 4
    class E,CR evidence
    class MR mentor
    class FE,AS academic
    class CH governance
    class GP,LG,PD decision
    class AT external`,
  },
  {
    id: "engine",
    label: "3-Tier Student Engine",
    title: "Dashboard to Portfolio closed loop",
    source: `flowchart TD
    subgraph Cockpit ["1. Dashboard Overview (The Cockpit)"]
      D1["Urgent Blocker Hero (DS-907 34h SLA)"]
      D2["Level 9 & Sprint 04 Roadmap Strip"]
      D3["Pod Activity & Quest Points (780 QP)"]
    end
    subgraph Studio ["2. Work Board (The Execution Studio)"]
      W1["Active Assignment Selection (DS-907 / DS-904)"]
      W2["Client Brief & Rubric Criteria"]
      W3["Attach Pull Requests & Test Reports"]
      W4["Submit for Faculty Review"]
    end
    subgraph Evaluation ["3. Faculty Critique & Evaluation Gate"]
      F1["3-Column Critique Dossier (Working / Change / Purpose)"]
      F2["Interactive Revision Checklist"]
      F3["Quality Gate Verification"]
    end
    subgraph Vault ["4. Evidence & Portfolio (Permanent Vault)"]
      P1["22 Degree Required Artifacts"]
      P2["PO1–PO8 & PSO1–PSO4 Outcome Matrices"]
      P3["University Viva Voce & Employer Defense"]
    end
    D1 ==>|"Execute on Work Board"| W1
    W1 --> W2 --> W3 --> W4
    W4 ==>|"Submit"| F1
    F1 --> F2
    F2 -.->|"Deficiencies found"| W1
    F2 -->|"Passing standard"| F3
    F3 ==>|"Graduates to Vault"| P1
    P1 --> P2 --> P3
    P1 -.->|"Fix Quality Gap"| W1
    classDef governance fill:#3448A6,color:#FFFFFF,stroke:#24347C,stroke-width:2px
    classDef academic fill:#DFE7FF,color:#16244C,stroke:#5269D6,stroke-width:1.5px
    classDef student fill:#FFF0CF,color:#4D3410,stroke:#C88922,stroke-width:1.5px
    classDef evidence fill:#DDF5E7,color:#153A27,stroke:#32965F,stroke-width:1.5px
    classDef revision fill:#FFE1E6,color:#501C28,stroke:#C84D62,stroke-width:1.5px
    classDef decision fill:#EEE4FF,color:#362052,stroke:#7B5BC4,stroke-width:2px
    class D1,D2,D3 student
    class W1,W2,W3,W4 academic
    class F1,F2 revision
    class F3 decision
    class P1,P2,P3 evidence`,
  },
  {
    id: "remediation",
    label: "Quality Gate Remediation",
    title: "E2E Failure to Verified Evidence",
    source: `flowchart TD
    subgraph Detection ["1. Automated Test Failure"]
      TF["Playwright E2E Suite Executed"] --> FL["2 Failing Scenarios: Token Refresh & Rollback"]
      FL --> EH["Elevated to Urgent Dashboard Hero (34h SLA)"]
    end
    subgraph Critique ["2. Faculty Review & Critique"]
      EH --> CD["Dossier Issued: What is Working vs What Must Change"]
      CD --> CL["4-Item Actionable Revision Checklist"]
    end
    subgraph Resolution ["3. Active Workbench Remediation"]
      CL --> WB["Student opens Work Board (DS-907)"]
      WB --> FX["Fix timeout threshold & race conditions in code"]
      FX --> TR["Re-run Playwright suite against staging cluster"]
      TR --> AT["Attach clean passing test trace & updated PR"]
    end
    subgraph Acceptance ["4. Verification & Outcome Clearance"]
      AT --> RV["Faculty re-evaluates submission"]
      RV --> SG["Faculty signoff granted"]
      SG --> OV["PO4 & PSO1 Evidence Gap resolved in Portfolio"]
    end
    classDef governance fill:#3448A6,color:#FFFFFF,stroke:#24347C,stroke-width:2px
    classDef academic fill:#DFE7FF,color:#16244C,stroke:#5269D6,stroke-width:1.5px
    classDef student fill:#FFF0CF,color:#4D3410,stroke:#C88922,stroke-width:1.5px
    classDef evidence fill:#DDF5E7,color:#153A27,stroke:#32965F,stroke-width:1.5px
    classDef revision fill:#FFE1E6,color:#501C28,stroke:#C84D62,stroke-width:1.5px
    classDef decision fill:#EEE4FF,color:#362052,stroke:#7B5BC4,stroke-width:2px
    class TF,FL,CD,CL revision
    class EH,WB,FX,TR student
    class RV decision
    class AT,SG,OV evidence`,
  },
  {
    id: "outcomes-map",
    label: "Outcome Architecture",
    title: "PO1–PO8 & PSO1–PSO4 Framework",
    source: `flowchart TD
    subgraph CorePOs ["Universal Programme Outcomes (PO1–PO8)"]
      PO1["PO1 · AI & Intelligent Systems"]
      PO2["PO2 · Cloud-Native Full Stack Architecture"]
      PO3["PO3 · Distributed Backend & Data Systems"]
      PO4["PO4 · Modern Tooling & DevOps QA"]
      PO8["PO8 · Professional Ethics & Viva Defense"]
    end
    subgraph SpecPSOs ["Specialized Outcomes (PSO1–PSO4)"]
      PSO1["PSO1 · Distributed Transaction Resilience"]
      PSO2["PSO2 · Microservices Cloud Platforms"]
      PSO3["PSO3 · MLOps & Continuous Delivery"]
      PSO4["PSO4 · Automated Quality-Gate Testing"]
    end
    subgraph ArtifactVault ["22 Verified Degree Artifacts"]
      PR["Pull Requests & ADRs"] --> PO2
      PR --> PO3
      TR["Playwright Test Traces"] --> PO4
      TR --> PSO4
      DB["PostgreSQL Migrations"] --> PSO1
      RB["Production Runbooks"] --> PO8
      RB --> PSO2
    end
    subgraph VivaDefense ["Degree Accreditation & Placement"]
      PO2 --> VV["University Viva Voce Defense"]
      PO4 --> VV
      PSO1 --> VV
      VV --> ACC["Accredited M.Sc. Degree Awarded"]
    end
    classDef governance fill:#3448A6,color:#FFFFFF,stroke:#24347C,stroke-width:2px
    classDef academic fill:#DFE7FF,color:#16244C,stroke:#5269D6,stroke-width:1.5px
    classDef student fill:#FFF0CF,color:#4D3410,stroke:#C88922,stroke-width:1.5px
    classDef evidence fill:#DDF5E7,color:#153A27,stroke:#32965F,stroke-width:1.5px
    classDef decision fill:#EEE4FF,color:#362052,stroke:#7B5BC4,stroke-width:2px
    class PO1,PO2,PO3,PO4,PO8 academic
    class PSO1,PSO2,PSO3,PSO4 governance
    class PR,TR,DB,RB student
    class VV decision
    class ACC evidence`,
  },
] as const;

function MermaidDiagram({ chart, title }: { chart: string; title: string }) {
  const reactId = useId().replaceAll(":", "");
  const [svg, setSvg] = useState("");
  const [error, setError] = useState("");
  useEffect(() => {
    let cancelled = false;
    let renderCount = 0;
    const render = async () => {
      try {
        const mermaid = (await import("mermaid")).default;
        const dark = document.documentElement.dataset.theme === "dark";
        mermaid.initialize({
          startOnLoad: false,
          securityLevel: "strict",
          theme: dark ? "dark" : "base",
          flowchart: { htmlLabels: false, curve: "basis", nodeSpacing: 42, rankSpacing: 48 },
          themeVariables: dark
            ? {
                primaryColor: "#26376f",
                primaryTextColor: "#eef3ff",
                primaryBorderColor: "#6e82e8",
                lineColor: "#93A3C8",
                edgeLabelBackground: "#111a31",
                secondaryColor: "#173f48",
                tertiaryColor: "#172139",
                clusterBkg: "#131d35",
                clusterBorder: "#40517c",
                fontFamily: "Inter, system-ui, sans-serif",
              }
            : {
                primaryColor: "#eef1ff",
                primaryTextColor: "#172039",
                primaryBorderColor: "#6173d8",
                lineColor: "#68789A",
                edgeLabelBackground: "#FFFFFF",
                secondaryColor: "#e8f8f6",
                tertiaryColor: "#f5f7fc",
                clusterBkg: "#F8FAFF",
                clusterBorder: "#C9D2E7",
                fontFamily: "Inter, system-ui, sans-serif",
              },
        });
        const result = await mermaid.render(`msdsp-${reactId}-${renderCount++}`, chart);
        if (!cancelled) {
          setSvg(result.svg);
          setError("");
        }
      } catch {
        if (!cancelled) setError("Diagram could not be rendered.");
      }
    };
    void render();
    const observer = new MutationObserver(() => {
      void render();
    });
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ["data-theme"] });
    return () => {
      cancelled = true;
      observer.disconnect();
    };
  }, [chart, reactId]);
  return (
    <div className="mermaid-render" role="img" aria-label={title}>
      {error ? (
        <p role="alert">{error}</p>
      ) : svg ? (
        <div dangerouslySetInnerHTML={{ __html: svg }} />
      ) : (
        <span className="mermaid-loading" role="status">
          <i />
          <b>Rendering diagram…</b>
        </span>
      )}
    </div>
  );
}

function MermaidGallery({ notify }: { notify: (message: string) => void }) {
  const [selected, setSelected] = useState<(typeof mermaidCharts)[number]["id"]>("structure");
  const chart = mermaidCharts.find((item) => item.id === selected) ?? mermaidCharts[0];
  const legend = [
    ["governance", "Governance"],
    ["academic", "Academic"],
    ["mentor", "Mentor"],
    ["student", "Student work"],
    ["evidence", "Verified evidence"],
    ["revision", "Revision"],
    ["decision", "Decision"],
    ["external", "External system"],
  ];
  return (
    <article className="panel mermaid-gallery">
      <PanelHeading
        label="MERMAID REFERENCE DIAGRAMS"
        title="Explore each workflow as a formal flowchart"
        meta={`${mermaidCharts.length} diagrams`}
      />
      <div className="mermaid-tabs" role="tablist" aria-label="Programme workflow diagrams">
        {mermaidCharts.map((item) => (
          <button
            role="tab"
            aria-selected={selected === item.id}
            className={selected === item.id ? "active" : ""}
            key={item.id}
            onClick={() => {
              setSelected(item.id);
              notify(`${item.title} diagram opened`);
            }}
          >
            <Icon
              name={
                item.id === "structure"
                  ? "layers"
                  : item.id === "creation"
                  ? "network"
                  : item.id === "level-one"
                  ? "users"
                  : item.id === "student"
                  ? "brief"
                  : item.id === "mentor"
                  ? "review"
                  : item.id === "assessment"
                  ? "chart"
                  : item.id === "engine"
                  ? "grid"
                  : item.id === "remediation"
                  ? "target"
                  : "file"
              }
            />
            {item.label}
          </button>
        ))}
      </div>
      <div className="mermaid-legend" aria-label="Diagram colour key">
        {legend.map(([tone, label]) => (
          <span key={tone}>
            <i className={tone} />
            {label}
          </span>
        ))}
      </div>
      <div className="mermaid-stage">
        <header>
          <span>
            <small>SELECTED FLOW</small>
            <h3>{chart.title}</h3>
          </span>
          <i>
            <b /> Live workflow
          </i>
        </header>
        <MermaidDiagram chart={chart.source} title={chart.title} />
      </div>
      <footer>
        <Icon name="shield" />
        <p>
          Colour identifies responsibility and record type. Animated connectors show direction only; they do not indicate live system activity. Motion is disabled when reduced motion is preferred.
        </p>
      </footer>
    </article>
  );
}


function ProgrammeWorkflow({ notify }: { notify: (message: string) => void }) {
  const ownership = [
    ["Course Head", "Creates programme, course and Learning Cycle masters", "Approves publication, official dates, academic results and progression", "shield"],
    ["Level Coordinator", "Prepares the Level plan, Sprint structure and delivery schedule", "Coordinates mentors, learners, dependencies and escalation", "network"],
    ["Student-Team Mentor", "Creates workplace tasks with the Coordinator and guides delivery", "Maintains team actions, mentoring records and specialist referrals", "users"],
    ["Domain Mentor", "Defines specialist evidence and quality expectations", "Reviews referred artifacts and recommends competency status", "target"],
    ["Student / Team", "Creates the work plan and professional artifacts", "Submits evidence, responds to feedback and defends decisions", "brief"],
  ];
  const levelOneSprints = [
    ["01", "Orient", "Programme, workplace and professional expectations", "Professional development plan"],
    ["02", "Discover", "Problem, stakeholder and user context", "Stakeholder map and problem statement"],
    ["03", "Form", "Team roles and ways of working", "Team charter and communication protocol"],
    ["04", "Collaborate", "Git-based professional delivery", "Repository, commits and pull request"],
    ["05", "Demonstrate", "Foundation review and reflection", "Demonstration and Sprint retrospective"],
  ];
  const learners = ["Alfin", "Anakha Rajesh", "Annamma", "Annrosna", "Dhanush Girish"];
  return <><PageHeader eyebrow="COURSE HEAD · OPERATING MODEL" title="How the MSDSP programme works" description="A simple end-to-end view of academic credits, Learning Cycles, Sprint creation, role ownership, evidence review, assessment and progression." action="Open Level 1 setup" onAction={() => notify("Level 1 planning workspace opened")} />
    <section className="workflow-command"><div><span><i /> FACULTY OPERATING REFERENCE</span><h2>Courses carry credits. Levels organise delivery. Sprints organise work.</h2><p>Assignments connect course units to authentic workplace evidence. Mentors guide and recommend; authorised academic faculty and the Course Head approve credit-bearing results.</p><div><em>4 semesters</em><em>20 Learning Cycles</em><em>5 Sprints per Level</em><em>Evidence-based assessment</em></div></div><aside><Icon name="network" /><small>START HERE</small><b>Programme → Semester → Level → Sprint → Evidence</b><p>Follow the animated path below to understand creation, delivery and approval.</p></aside></section>

    <article className="panel workflow-source-strip"><div><Icon name="book" /><span><small>ACADEMIC STRUCTURE</small><b>SODS M.Sc. DSPD Final Course Plan</b><p>Courses, outcomes, semester delivery and assessment framework.</p></span><i className="source-state current">Academic reference</i></div><div><Icon name="users" /><span><small>ROLE ALLOCATION</small><b>MSDSP Course Coordination Plan v4</b><p>Proposed coordinators, mentor tiers and Level assignments.</p></span><i className="source-state proposal">Board approval pending</i></div><div><Icon name="award" /><span><small>PROGRESSION OVERLAY</small><b>M.Sc. DSPD Gamification Rubric</b><p>Draft points, progression bands, certifications and recovery rules.</p></span><i className="source-state proposal">Provisional</i></div></article>

    <MermaidGallery notify={notify} />

    <article className="panel programme-map"><PanelHeading label="01 · PROGRAMME ARCHITECTURE" title="From programme structure to verifiable evidence" meta="Learning Cycle = official Level" /><div className="flow-track primary-flow">{[["book", "Programme", "M.Sc. DSPD"], ["calendar", "Semester", "4 in programme"], ["layers", "Learning Cycle", "20 official Levels"], ["brief", "Sprint", "Normally 5 per Level"], ["file", "Evidence", "Reviewed artifacts"]].map((item, index) => <span className={index === 2 ? "active" : ""} key={item[1]}><i><Icon name={item[0]} /></i><small>0{index + 1}</small><b>{item[1]}</b><p>{item[2]}</p>{index < 4 && <em><Icon name="arrow" /></em>}</span>)}</div><div className="mapping-bridge"><i /><span>Assignments map the delivery structure to the academic structure</span><i /></div><div className="flow-track academic-flow">{[["book", "Academic course", "Approved credit value"], ["layers", "Course units", "May span Levels"], ["brief", "Assignments", "Mapped to outcomes"], ["review", "Reviewed evidence", "Rubric judgement"], ["award", "Course credits", "After approval"]].map((item, index) => <span key={item[1]}><i><Icon name={item[0]} /></i><small>0{index + 1}</small><b>{item[1]}</b><p>{item[2]}</p>{index < 4 && <em><Icon name="arrow" /></em>}</span>)}</div></article>

    <section className="credit-progression-grid"><article className="panel credit-path"><PanelHeading label="02 · ACADEMIC CREDIT PATH" title="Credits belong to courses" meta="Credit-bearing" /><div>{[["Course master", "Course code, approved credits, L–T–P and units"], ["Mapped evidence", "Assignments contribute to named assessment components"], ["Faculty evaluation", "Authorised evaluator applies the academic rubric"], ["Course Head approval", "Result is approved and published"], ["Credits awarded", "Only after course completion requirements are met"]].map((item, index) => <span key={item[0]}><i>{index < 4 ? String(index + 1).padStart(2, "0") : <Icon name="award" />}</i><p><b>{item[0]}</b><small>{item[1]}</small></p></span>)}</div></article><article className="panel progression-path"><PanelHeading label="SEPARATE LEVEL PATH" title="Progression is not a credit calculation" meta="Gamification provisional" /><div className="split-records"><span><Icon name="chart" /><p><b>Academic result</b><small>Course Plan components and approved evidence</small></p></span><span><Icon name="target" /><p><b>Level Gate</b><small>Evidence-based readiness for the next Level</small></p></span><span><Icon name="award" /><p><b>Gamification</b><small>Motivational points and professional recognition</small></p></span><span><Icon name="shield" /><p><b>Attendance</b><small>External to MSDSP and managed in DUK@360</small></p></span></div><footer><Icon name="alert" /><p><b>Credit values remain configurable</b>The shared Course Plan contains unresolved core-course and Project Lab totals. The final 80-credit distribution requires Programme Board confirmation.</p></footer></article></section>

    <article className="panel ownership-map"><PanelHeading label="03 · WHO CREATES AND APPROVES" title="One accountable chain of responsibility" meta="Faculty control model" /><div>{ownership.map((item, index) => <button key={item[0]} onClick={() => notify(`${item[0]} responsibility opened`)}><i><Icon name={item[3]} /></i><span><small>ROLE 0{index + 1}</small><b>{item[0]}</b><p>{item[1]}</p><em>{item[2]}</em></span><Icon name="arrow" /></button>)}</div><footer><Icon name="shield" /><p><b>Authority boundary</b>Mentors may draft Sprints, workplace briefs and evidence expectations. The Course Head controls publication, official deadlines, academic results and progression decisions.</p></footer></article>

    <article className="panel creation-sequence"><PanelHeading label="04 · LEVEL CREATION" title="How a Learning Cycle becomes available to students" meta="Controlled publication" /><div>{[["Programme Board", "Approves rules", "shield"], ["Course Head", "Creates Learning Cycle", "book"], ["Level Coordinator", "Plans Sprints", "network"], ["Mentor Team", "Drafts tasks and evidence", "users"], ["Course Head", "Approves and publishes", "check"], ["Coordinator", "Assigns learners and mentors", "target"]].map((item, index) => <span className={index === 3 ? "active" : index < 3 ? "complete" : ""} key={index + item[0]}><i><Icon name={item[2]} /></i><small>0{index + 1}</small><b>{item[0]}</b><p>{item[1]}</p>{index < 5 && <em><Icon name="arrow" /></em>}</span>)}</div></article>

    <section className="level-one-command"><header><div><span className="eyebrow">05 · WORKED EXAMPLE · LEVEL 1</span><h2>Orientation & Foundations</h2><p>Semester I · Proposed coordination and Sprint delivery model from the shared coordination workbook.</p></div><span className="level-one-orbit"><b>01</b><small>Official Level</small></span></header><div className="level-one-roles"><span><small>LEAD COORDINATOR</small><b>Vyga V R</b><p>Requirements, market and user-research coordination</p></span><span><small>SUPPORTING TEAM</small><b>Soorya Krishnan G</b><p>Agile and Sprint cadence</p></span><span><small>STUDENT SUCCESS</small><b>Smitha Surendran</b><p>Onboarding and cohort engagement</p></span><span><small>CERTIFICATION TRACK</small><b>Git & GitHub</b><p>Foundation professional practice</p></span></div><div className="level-one-sprints">{levelOneSprints.map((item, index) => <button key={item[0]} onClick={() => notify(`Level 1 Sprint ${item[0]} opened`)}><i className={index < 2 ? "complete" : index === 2 ? "active" : ""}>{item[0]}</i><span><small>SPRINT {item[0]}</small><b>{item[1]}</b><p>{item[2]}</p><em>{item[3]}</em></span>{index < 4 && <strong><Icon name="arrow" /></strong>}</button>)}</div><footer><div><span>ASSIGNED COHORT</span>{learners.map((learner) => <button key={learner} onClick={() => notify(`${learner} Level 1 allocation opened`)}><i className="avatar">{learner.split(" ").map((part) => part[0]).slice(0, 2).join("")}</i><b>{learner}</b></button>)}</div><p><Icon name="alert" />Team grouping remains pending until formally approved.</p></footer></section>

    <div className="workflow-pair"><article className="panel role-workflow student-flow"><PanelHeading label="06 · STUDENT DELIVERY" title="Brief to evidence" meta="Learner-owned work" /><div>{[["Receive brief", "Understand outcomes and constraints"], ["Plan", "Create individual or team work plan"], ["Perform", "Complete professional project tasks"], ["Record", "Document decisions, learning and blockers"], ["Submit evidence", "Attach versioned workplace artifacts"], ["Respond", "Revise and defend professional judgement"]].map((item, index) => <span key={item[0]}><i>{index + 1}</i><p><b>{item[0]}</b><small>{item[1]}</small></p></span>)}</div></article><article className="panel role-workflow mentor-flow"><PanelHeading label="07 · MENTOR DELIVERY" title="Allocation to recommendation" meta="Mentor-owned guidance" /><div>{[["Accept allocation", "Confirm scope, capacity and authority"], ["Calibrate", "Apply shared rubric and anchor examples"], ["Mentor", "Guide without implementing the solution"], ["Review", "Inspect artifacts and evidence versions"], ["Revise", "Issue evidence-linked corrective action"], ["Recommend", "Submit competency judgement for approval"]].map((item, index) => <span key={item[0]}><i>{index + 1}</i><p><b>{item[0]}</b><small>{item[1]}</small></p></span>)}</div></article></div>

    <article className="panel evidence-loop"><PanelHeading label="08 · EVIDENCE AND REVISION" title="Every decision remains traceable" meta="Original evidence retained" /><div>{[["upload", "Submit", "Professional artifact"], ["review", "Review", "Criterion-level judgement"], ["message", "Feedback", "Specific evidence gap"], ["layers", "Revise", "New version and rationale"], ["check", "Validate", "Competency recommendation"]].map((item, index) => <span className={index === 2 ? "active" : ""} key={item[1]}><i><Icon name={item[0]} /></i><b>{item[1]}</b><p>{item[2]}</p>{index < 4 && <em><Icon name="arrow" /></em>}</span>)}</div><footer><span><b>Needs Revision</b><small>Incomplete, unreliable or not reproducible</small></span><span><b>Meets Industry Standard</b><small>Satisfies the brief with valid evidence</small></span><span><b>Exceeds Expectations</b><small>Independent validation and defensible judgement</small></span></footer></article>

    <section className="assessment-gates"><article className="panel"><PanelHeading label="09 · ACADEMIC ASSESSMENT" title="Evidence-backed component marks" meta="Course Plan model" /><div>{academicComponents.map(([name, , weight]) => <span key={name}><p><b>{name}</b><small>{weight}%</small></p><i><em style={{ width: `${weight * 2}%` }} /></i></span>)}</div><footer><Icon name="shield" /><p>Authorised academic faculty evaluate. The Course Head approves and publishes.</p></footer></article><article className="panel"><PanelHeading label="10 · PROGRESSION OVERLAY" title="Gamification remains separate" meta="Draft rubric" /><div className="band-ladder">{[["0–49%", "Snake Zone", "Recovery"], ["50–69%", "Conditional Pass", "Remedial evidence"], ["70–89%", "Ladder Pass", "Progress"], ["90–100%", "Distinction", "Progress with distinction"]].map((item, index) => <span className={`b${index + 1}`} key={item[0]}><small>{item[0]}</small><b>{item[1]}</b><em>{item[2]}</em></span>)}</div><footer><Icon name="alert" /><p>Level Gate inputs and progression authority require final Programme Board approval.</p></footer></article></section>

    <article className="panel end-to-end-lifecycle"><PanelHeading label="11 · COMPLETE LEVEL LIFECYCLE" title="Configure, deliver, assess and progress" meta="End-to-end control" /><div>{[["book", "Configure"], ["calendar", "Plan Sprints"], ["users", "Allocate"], ["brief", "Perform"], ["file", "Submit"], ["review", "Review"], ["chart", "Evaluate"], ["award", "Progress"]].map((item, index) => <button className={index === 5 ? "active" : index < 5 ? "complete" : ""} key={item[1]} onClick={() => notify(`${item[1]} lifecycle stage opened`)}><i><Icon name={item[0]} /></i><small>{String(index + 1).padStart(2, "0")}</small><b>{item[1]}</b></button>)}</div></article>

    <article className="panel workflow-decisions"><Icon name="alert" /><div><span className="eyebrow">PROGRAMME BOARD DECISIONS STILL REQUIRED</span><h2>Do not convert unresolved draft values into permanent rules</h2><p>Confirm the final course-credit distribution, Project Lab credits, assessment aggregation level, Level Gate inputs, gamification maximum, certification enforcement, retry limits and the boundary between academic evaluation and industry mentoring.</p></div><button onClick={() => notify("Programme Rules Decision Register opened")}>Open decision register <Icon name="arrow" /></button></article>
  </>;
}

function CourseCoordination({ notify }: { notify: (message: string) => void }) {
  const [view, setView] = useState<"levels" | "team" | "governance">("levels");
  const [semester, setSemester] = useState(1);
  const selectedSemester = semesterCoordination.find((item) => item.semester === semester) ?? semesterCoordination[0];
  const selectedLevels = levelCoordination.filter((item) => item.semester === semester);
  const tiers = ["Coordination Committee", "Domain Mentor Pod", "Student-Team Mentor"] as const;

  return <><PageHeader eyebrow="COURSE COORDINATION · FACULTY ONLY" title="Proposed programme coordination plan" description="A working view of semester coordination, Level coverage, domain mentoring and certification support extracted from the shared coordination workbook. It is not a final academic organisation chart." />
    <section className="coordination-hero"><div><span className="proposal-badge"><i /> Proposed coordination plan</span><h2>One accountable network from curriculum to product delivery</h2><p>CDIPD coordinators and mentors are provisionally mapped to five core-course domains, 20 coordination Levels and the certification pathways listed in the workbook.</p></div><aside><Icon name="shield" /><div><small>GOVERNANCE STATUS</small><b>Programme Board approval pending</b><span>Working proposal · 15 members</span></div></aside></section>
    <div className="course-summary"><span><Icon name="layers" /><div><b>20</b><small>Proposed coordination Levels</small></div></span><span><Icon name="calendar" /><div><b>4</b><small>Semesters</small></div></span><span><Icon name="users" /><div><b>15</b><small>Coordination members</small></div></span><span><Icon name="book" /><div><b>5</b><small>Core-course domains</small></div></span><span><Icon name="award" /><div><b>13</b><small>Certification tracks</small></div></span></div>
    <div className="course-tabs" role="tablist"><button className={view === "levels" ? "active" : ""} onClick={() => setView("levels")}><Icon name="layers" />Levels & semesters</button><button className={view === "team" ? "active" : ""} onClick={() => setView("team")}><Icon name="users" />Coordination team</button><button className={view === "governance" ? "active" : ""} onClick={() => setView("governance")}><Icon name="shield" />Coverage & decisions</button></div>

    {view === "levels" && <div className="course-view-enter"><div className="semester-switcher">{semesterCoordination.map((item) => <button key={item.semester} className={semester === item.semester ? "active" : ""} onClick={() => setSemester(item.semester)}><small>SEMESTER</small><b>{String(item.semester).padStart(2, "0")}</b><span>{item.focus}</span></button>)}</div><article className="panel semester-focus"><div><span className="eyebrow">{selectedSemester.label.toUpperCase()} COORDINATION</span><h2>{selectedSemester.focus}</h2></div><dl><div><dt>Primary leads</dt><dd>{selectedSemester.leads}</dd></div><div><dt>Supporting network</dt><dd>{selectedSemester.support}</dd></div></dl></article><div className="level-plan-grid">{selectedLevels.map((item) => <article className={`panel level-plan-card ${item.gap ? "has-gap" : ""}`} key={item.level}><div className="level-card-head"><span>LEVEL {String(item.level).padStart(2, "0")}</span>{item.gap ? <i className="coverage-gap">Coverage gap</i> : <i className="coverage-set">Coordination mapped</i>}</div><h3>{item.title}</h3><dl><div><dt>Lead coordinator</dt><dd>{item.lead}</dd></div><div><dt>Support mentors</dt><dd>{item.support}</dd></div><div><dt>Certification pathway</dt><dd>{item.certification}</dd></div></dl><button onClick={() => notify(`Level ${item.level} coordination opened`)}>View Level coordination <Icon name="arrow" /></button></article>)}</div></div>}

    {view === "team" && <div className="course-view-enter"><article className="panel coordination-principle"><Icon name="network" /><div><span className="eyebrow">THREE-TIER MODEL</span><h2>Governance, domain depth and hands-on mentoring</h2><p>The model separates programme-wide coordination from specialist technical mentoring and student-team delivery support. Official credit-bearing assessment ownership remains subject to Programme Board confirmation.</p></div></article><div className="tier-overview">{tiers.map((tier, index) => <article className="panel" key={tier}><span className={`tier-icon t${index + 1}`}>0{index + 1}</span><div><small>{index === 0 ? "PROGRAMME-WIDE" : index === 1 ? "SPECIALIST COVERAGE" : "DELIVERY SUPPORT"}</small><h3>{tier}</h3><p>{index === 0 ? "Architecture, governance, sprint cadence, research and student success." : index === 1 ? "Data, cloud, DevOps, UI/UX, frontend and quality engineering." : "Backend, APIs, code review and cross-platform product mentoring."}</p><b>{coordinators.filter((person) => person.tier === tier).length} members</b></div></article>)}</div><article className="panel coordinator-directory"><PanelHeading label="COORDINATOR DIRECTORY" title="People mapped to curriculum and Levels" meta="15 proposed members" /><div className="directory-head"><span>Coordinator</span><span>Coordination responsibility</span><span>Course focus</span><span>Level focus</span><span>Track owned</span></div>{coordinators.map((person) => <button key={person.name} onClick={() => notify(`${person.name} coordination profile opened`)}><span><i className="avatar">{person.name.split(" ").slice(0, 2).map((part) => part[0]).join("")}</i><span><b>{person.name}</b><small>{person.designation}</small></span></span><span><b>{person.role}</b><small>{person.discipline} · {person.tier}</small></span><span>{person.course}</span><span>{person.levels}</span><span>{person.track}<Icon name="arrow" /></span></button>)}</article></div>}

    {view === "governance" && <div className="course-view-enter governance-layout"><section><article className="panel decision-intro"><span className="eyebrow">PROGRAMME BOARD DECISIONS</span><h2>Coverage that must be resolved before finalisation</h2><p>The coordination workbook is a proposal—not a final organisation chart. These items require academic governance decisions before assignments are treated as authoritative.</p></article><div className="risk-cards"><article className="panel critical"><div><Icon name="alert" /><span>Critical coverage gap</span></div><h3>Dedicated AI/ML subject-matter expertise</h3><p>CS101 and Levels 2, 7, 13 and 18 require modelling depth beyond data engineering and MLOps infrastructure.</p><b>Recommended action</b><span>Appoint an internal or academic/industry AI/ML SME.</span></article><article className="panel critical"><div><Icon name="alert" /><span>Specialist coverage gap</span></div><h3>Security and penetration-testing expertise</h3><p>Level 14 covers OWASP, CEH and penetration testing; current DevSecOps and privacy coverage is partial.</p><b>Recommended action</b><span>Add a security mentor for the CEH and penetration-testing pathway.</span></article></div><article className="panel open-decisions"><PanelHeading label="OPEN GOVERNANCE ITEMS" title="Clarifications required" meta="Programme Board" />{[["Assessment ownership", "Confirm who owns official credit-bearing marks versus industry mentoring and sprint coordination."], ["Resource allocation", "Confirm weekly allocation for members who appear across multiple Levels and coordination tiers."], ["Student success remit", "Confirm HR responsibility for placement logistics and recovery/counselling touchpoints."], ["Mobile pathway", "Confirm whether student products target mobile and whether a specific certification is required."]].map((item, index) => <div key={item[0]}><span>0{index + 1}</span><p><b>{item[0]}</b>{item[1]}</p><i>Decision pending</i></div>)}</article></section><aside><article className="panel coverage-card"><PanelHeading label="CONFIRMED COVERAGE" title="Recently strengthened" meta="3 areas" /><div><span><Icon name="check" /><p><b>Quality assurance</b>Ajitha V S owns test automation and quality gates across Levels 8, 9 and 15.</p></span><span><Icon name="check" /><p><b>Frontend depth</b>Abhi Krishnan R and Prasanth Lal S N support UX, frontend and integration across Levels 4, 5 and 9.</p></span><span><Icon name="check" /><p><b>Mobile delivery</b>Bibin Babu supports cross-platform product work in Levels 5, 17 and 18.</p></span></div></article><article className="panel governance-boundary"><Icon name="shield" /><h3>Academic governance boundary</h3><p>CDIPD members are currently represented as coordinators and mentors. University academic faculty remain the presumed owners of credit-bearing assessment until formally ratified.</p><span>Academic score remains separate from gamification.</span></article></aside></div>}
  </>;
}

interface WorkboardAssignment {
  id: string;
  title: string;
  role: string;
  reviewer: string;
  workflow: string;
  evidenceCount: string;
  reviewDate: string;
  question: string;
  summary: string;
  cognitive: string;
  stage: string;
  requiredEvidence: string;
  briefTitle: string;
  briefDesc: string;
  dependencies: string;
  outcomes: string;
  criteria: Array<[string, string]>;
  artifacts: Array<[string, string]>;
  history: Array<[string, string, string]>;
}

const WORKBOARD_ASSIGNMENTS: Record<string, WorkboardAssignment> = {
  "DS-907": {
    id: "DS-907",
    title: "End-to-end quality-gate revision",
    role: "Quality Engineer",
    reviewer: "Ajitha V S",
    workflow: "Revision required",
    evidenceCount: "4 / 6",
    reviewDate: "05 Sep (Urgent) · 20 Sep (Final)",
    question: "Can you stabilize the failing E2E quality gates under concurrent load?",
    summary: "Resolve token refresh and transaction rollback failures in Playwright, update the operational runbook, and attach verifiable execution traces.",
    cognitive: "Analyze → Evaluate → Create",
    stage: "Active experimentation",
    requiredEvidence: "Playwright failure trace · corrected test script · updated runbook · PR review",
    briefTitle: "Repair and defend automated quality-gate resilience",
    briefDesc: "Ajitha V S identified two unstable test scenarios during Sprint 04 quality gate review: token refresh timeout under Firefox and non-idempotent rollback. Rerun full traces with video recording and link to the revised pull request.",
    dependencies: "Docker Compose test environment · DUK@360 mock token service · Playwright v1.45",
    outcomes: "PO4 (DevOps & Testing) · PSO4 (Secure & Quality Systems)",
    criteria: [
      ["Needs revision", "Workflow is unreliable, failure traces are incomplete or setup cannot be reproduced locally."],
      ["Meets industry standard", "Token refresh and transaction rollback pass reliably in CI; traces and root-cause notes are attached."],
      ["Exceeds expectations", "Automated retry policy, network throttling assertions and concurrency stress harness verified with zero regressions."]
    ],
    artifacts: [
      ["Playwright E2E failure trace (v2)", "Revision required"],
      ["Corrected Playwright script (PR-45)", "Under review"],
      ["Token refresh idempotency test suite", "Draft"],
      ["Transaction rollback verification report", "Draft"],
      ["Local deployment runbook (v1.2)", "Accepted"]
    ],
    history: [
      ["02 Sep · 16:40", "Revision requested", "Ajitha V S identified two unstable failure scenarios in Firefox and rollback paths."],
      ["02 Sep · 14:15", "Quality gate evaluation", "QA coordinator review conducted on initial Sprint 04 pull request."],
      ["01 Sep · 09:30", "Submission created", "Playwright report attached from Sprint 04 automated run."]
    ]
  },
  "DS-904": {
    id: "DS-904",
    title: "Full-stack integration and test readiness",
    role: "Full-Stack Engineer",
    reviewer: "Krishnasree K",
    workflow: "Faculty review",
    evidenceCount: "5 / 7",
    reviewDate: "14 September",
    question: "Can the integrated product withstand a professional live demonstration?",
    summary: "Connect the responsive client, versioned API and PostgreSQL data layer; prove priority workflows, failure handling, role boundaries and reproducible local operation.",
    cognitive: "Analyze → Evaluate → Create",
    stage: "Active experimentation",
    requiredEvidence: "OpenAPI · PR · migrations · E2E report · runbook",
    briefTitle: "Build and defend a reliable full-stack product slice",
    briefDesc: "Deliver the authenticated project-submission journey across the Next.js client, versioned services and PostgreSQL. The solution must reproduce locally and demonstrate expected and failure paths.",
    dependencies: "Approved API contract · mock identity adapter · PostgreSQL 16",
    outcomes: "PO2 · PO3 · PO4 · PO8",
    criteria: [
      ["Needs revision", "Workflow is unreliable, evidence is incomplete or setup cannot be reproduced."],
      ["Meets industry standard", "Priority and failure paths are verified, traceable and independently reproducible."],
      ["Exceeds expectations", "Secure boundaries, observability and resilient recovery are justified with evidence."]
    ],
    artifacts: [
      ["OpenAPI 3.1 contract", "Accepted"],
      ["PR-42 · integration implementation", "Accepted"],
      ["PostgreSQL migration set", "Under review"],
      ["Playwright E2E trace", "Revision required"],
      ["Local deployment runbook", "Accepted"]
    ],
    history: [
      ["02 Sep · 16:40", "Revision requested", "Ajitha V S identified two unstable failure scenarios."],
      ["01 Sep · 11:20", "Evidence reviewed", "OpenAPI contract and integration pull request accepted."],
      ["30 Aug · 18:05", "Submission created", "Five professional artifacts linked to DS-904."]
    ]
  },
  "DS-905": {
    id: "DS-905",
    title: "API contract and PostgreSQL integration",
    role: "Backend Engineer",
    reviewer: "Soorya S Kumar",
    workflow: "Under review",
    evidenceCount: "6 / 6",
    reviewDate: "15 September",
    question: "Are API contracts hardened with schema validation, transactions, and error contracts?",
    summary: "Establish strict OpenAPI 3.1 specifications, idempotent database migrations, transaction rollback semantics, and structured HTTP error responses.",
    cognitive: "Analyze → Evaluate → Create",
    stage: "Concrete experience",
    requiredEvidence: "OpenAPI 3.1 spec · Prisma/Drizzle migrations · Postman contract tests · DB seed script",
    briefTitle: "Harden backend contracts and data integrity",
    briefDesc: "Design and document all student and evaluation endpoints with versioning, pagination, and error schemas. Verify relational consistency in PostgreSQL.",
    dependencies: "PostgreSQL 16 container · DUK@360 identity claims specification",
    outcomes: "PO3 (Data Systems) · PSO1 (AI-Ready Systems)",
    criteria: [
      ["Needs revision", "Endpoints lack schema validation, unhandled exceptions leak stack traces, or migrations are not reversible."],
      ["Meets industry standard", "All endpoints adhere strictly to OpenAPI 3.1 with standardized error responses and automated migration rollback."],
      ["Exceeds expectations", "Database connection pooling, query indexing benchmarks, and audit trail tables implemented."]
    ],
    artifacts: [
      ["OpenAPI 3.1 specification (v1.2)", "Accepted"],
      ["Database migration script set", "Under review"],
      ["Postman contract test collection", "Accepted"],
      ["PostgreSQL transaction test harness", "Under review"],
      ["Schema architecture decision record", "Accepted"]
    ],
    history: [
      ["03 Sep · 10:15", "Contract submitted", "Soorya S Kumar commenced review of PostgreSQL migrations."],
      ["01 Sep · 16:00", "Artifacts updated", "Added negative assertion tests to Postman collection."],
      ["28 Aug · 12:30", "Submission created", "OpenAPI spec and migration scripts uploaded."]
    ]
  },
  "DS-906": {
    id: "DS-906",
    title: "AWS SAA-C03 certification evidence",
    role: "Cloud Associate",
    reviewer: "Arun Nadh G",
    workflow: "Verification pending",
    evidenceCount: "2 / 3",
    reviewDate: "18 September",
    question: "Has professional cloud architectural competency been verified via external certification?",
    summary: "Provide verifiable score reports and Credly badge validation for AWS Certified Solutions Architect - Associate (SAA-C03).",
    cognitive: "Remember → Understand → Apply",
    stage: "Reflective observation",
    requiredEvidence: "Official score report PDF · Credly badge verification link · Candidate ID record",
    briefTitle: "External industry cloud competency validation",
    briefDesc: "Submit official AWS certification credentials. Faculty verifies the authenticity of the digital badge via Credly/AWS Certification portal.",
    dependencies: "AWS Certification account · Credly public badge link",
    outcomes: "PO2 (Cloud Architecture) · PO8 (Professional Delivery)",
    criteria: [
      ["Needs revision", "Verification link is invalid, score report is obscured, or certificate has expired."],
      ["Meets industry standard", "Active AWS SAA-C03 certification verified via authenticated Credly badge link."],
      ["Exceeds expectations", "Demonstrated hands-on CDK/Terraform infrastructure repository mapped to AWS architectural pillars."]
    ],
    artifacts: [
      ["AWS SAA-C03 Score Report PDF", "Accepted"],
      ["Credly Digital Badge verification link", "Verification pending"],
      ["Infrastructure IaC mapping document", "Draft"]
    ],
    history: [
      ["02 Sep · 11:00", "Verification submitted", "Credly badge link submitted for Arun Nadh G verification."],
      ["29 Aug · 14:20", "Score report accepted", "Score report verified by faculty advisor."]
    ]
  }
};

function Workboard({
  openEvidence,
  notify,
  onNavigate,
  selectedAssignmentId = "DS-907",
  onSelectAssignment,
}: {
  openEvidence: (assignment?: string) => void;
  notify: (message: string) => void;
  onNavigate?: (page: string, assignmentId?: string) => void;
  selectedAssignmentId?: string;
  onSelectAssignment?: (id: string) => void;
}) {
  const [assignmentView, setAssignmentView] = useState("Brief");
  const [activeId, setActiveId] = useState(selectedAssignmentId);

  useEffect(() => {
    if (selectedAssignmentId && selectedAssignmentId !== activeId) {
      setActiveId(selectedAssignmentId);
    }
  }, [selectedAssignmentId]);

  const rows = [
    ["DS-904", "Full-stack integration and test readiness", "Full-Stack Engineer", "Krishnasree K", "Faculty review", "5 / 7", "14 Sep"],
    ["DS-905", "API contract and PostgreSQL integration", "Backend Engineer", "Soorya S Kumar", "Under review", "6 / 6", "15 Sep"],
    ["DS-906", "AWS SAA-C03 certification evidence", "Cloud Associate", "Arun Nadh G", "Verification pending", "2 / 3", "18 Sep"],
    ["DS-907", "End-to-end quality-gate revision", "Quality Engineer", "Ajitha V S", "Revision required", "4 / 6", "20 Sep"]
  ];

  const handleSelect = (id: string) => {
    setActiveId(id);
    onSelectAssignment?.(id);
    notify(`${id} assignment loaded on workbench`);
  };

  const current = WORKBOARD_ASSIGNMENTS[activeId] ?? WORKBOARD_ASSIGNMENTS["DS-907"];

  return <>
    <PageHeader
      eyebrow="WORK BOARD · PROJECT-IMMERSIVE LEARNING"
      title="Full-stack assignments, Sprint work and evidence"
      description="Complete outcome-mapped engineering work with explicit contracts, dependencies, professional artifacts and faculty review."
      action="Record learning evidence"
      onAction={() => openEvidence(current.id)}
    />
    {/* New Student Onboarding Banner: How Work Board connects to Dashboard & Portfolio */}
    <article className="panel workboard-onboarding-card">
      <div className="wb-onboard-content">
        <span className="eyebrow">NEW STUDENT REFERENCE · WORK BOARD VS PORTFOLIO</span>
        <h2>Your Active Engineering Execution Workbench</h2>
        <p>
          While your <strong>Overview Dashboard</strong> is your strategic cockpit (priorities & points), and your <strong>Evidence & Portfolio</strong> is your cumulative degree showcase, this <strong>Work Board</strong> is your in-flight workshop: inspect the technical brief, check grading rubrics, attach code deliverables (PRs, migrations, test traces), and submit for faculty review.
        </p>
        <div className="wb-step-flow">
          <span className="wb-flow-pill"><Icon name="book" /> 1. Read Brief</span>
          <span className="wb-arrow" aria-hidden="true">→</span>
          <span className="wb-flow-pill"><Icon name="target" /> 2. Check Rubric Criteria</span>
          <span className="wb-arrow" aria-hidden="true">→</span>
          <span className="wb-flow-pill"><Icon name="file" /> 3. Attach Artifacts</span>
          <span className="wb-arrow" aria-hidden="true">→</span>
          <span className="wb-flow-pill accent"><Icon name="check" /> 4. Submit for Review</span>
        </div>
      </div>
      {onNavigate && (
        <div className="wb-header-nav-actions">
          <button type="button" className="wb-overview-jump" onClick={() => onNavigate("Overview")} title="Return to Dashboard Overview">
            ← Return to Dashboard Overview
          </button>
          <button type="button" className="wb-overview-jump secondary" onClick={() => onNavigate("Evidence & Portfolio")} title="View your cumulative Evidence Portfolio">
            View Evidence Portfolio →
          </button>
        </div>
      )}
    </article>

    <article className="panel mission-command">
      <div>
        <span className="eyebrow">SELECTED ASSIGNMENT · {current.id}</span>
        <h2>{current.question}</h2>
        <p>{current.summary}</p>
      </div>
      <dl>
        <div><dt>Project role</dt><dd>{current.role}</dd></div>
        <div><dt>Cognitive focus</dt><dd>{current.cognitive}</dd></div>
        <div><dt>Learning stage</dt><dd>{current.stage}</dd></div>
        <div><dt>Required evidence</dt><dd>{current.requiredEvidence}</dd></div>
      </dl>
    </article>

    <article className="panel assignment-workspace">
      <div className="assignment-tabs" role="tablist" aria-label="Assignment workspace">
        {["Brief", "Criteria", "Artifacts", "History"].map((item) => (
          <button
            role="tab"
            aria-selected={assignmentView === item}
            className={assignmentView === item ? "active" : ""}
            key={item}
            onClick={() => setAssignmentView(item)}
          >
            {item}
          </button>
        ))}
      </div>
      {assignmentView === "Brief" && (
        <div className="assignment-view">
          <div>
            <span className="eyebrow">CLIENT BRIEF</span>
            <h3>{current.briefTitle}</h3>
            <p>{current.briefDesc}</p>
          </div>
          <dl>
            <div><dt>Official review</dt><dd>{current.reviewDate}</dd></div>
            <div><dt>Dependencies</dt><dd>{current.dependencies}</dd></div>
            <div><dt>Outcomes</dt><dd>{current.outcomes}</dd></div>
          </dl>
        </div>
      )}
      {assignmentView === "Criteria" && (
        <div className="criterion-list">
          {current.criteria.map((item) => (
            <span key={item[0]}>
              <b>{item[0]}</b>
              <p>{item[1]}</p>
            </span>
          ))}
        </div>
      )}
      {assignmentView === "Artifacts" && (
        <div className="artifact-list">
          {current.artifacts.map((item) => (
            <button key={item[0]} onClick={() => notify(`${item[0]} opened`)}>
              <Icon name="file" />
              <span>
                <b>{item[0]}</b>
                <small>{item[1]}</small>
              </span>
              <Icon name="arrow" />
            </button>
          ))}
          <div className="wb-portfolio-bridge">
            <div className="wb-pb-text">
              <Icon name="shield" />
              <div>
                <b>Connected to Evidence & Portfolio</b>
                <p>Deliverables accepted during faculty review are automatically archived in your permanent Evidence & Portfolio, mapped to PO1–PO8 competencies.</p>
              </div>
            </div>
            {onNavigate && (
              <button
                type="button"
                className="wb-pb-btn"
                onClick={() => onNavigate("Evidence & Portfolio")}
                title="View your verified degree portfolio"
              >
                Inspect Evidence Portfolio (18 Ready) →
              </button>
            )}
          </div>
        </div>
      )}
      {assignmentView === "History" && (
        <div className="history-list">
          {current.history.map((item) => (
            <span key={item[0]}>
              <time>{item[0]}</time>
              <b>{item[1]}</b>
              <p>{item[2]}</p>
            </span>
          ))}
        </div>
      )}
      <div className="assignment-actions">
        <button onClick={() => notify(`Draft progress saved for ${current.id}`)}>Save progress</button>
        <button onClick={() => openEvidence(current.id)}>Attach evidence</button>
        <button className="primary-button" onClick={() => notify(`${current.id} submission sent for faculty review`)}>
          Submit for review <Icon name="arrow" />
        </button>
      </div>
    </article>

    <FilterBar placeholder="Search assignment or engineering evidence" />
    <article className="panel data-table">
      <div className="table-head">
        <span>Assignment</span>
        <span>Role</span>
        <span>Reviewer</span>
        <span>Workflow</span>
        <span>Evidence</span>
        <span>Review</span>
      </div>
      {rows.map((row) => {
        const isSelected = row[0] === current.id;
        return (
          <button
            key={row[0]}
            className={isSelected ? "active-assignment-row" : ""}
            aria-selected={isSelected}
            onClick={() => handleSelect(row[0])}
            title={`Select ${row[0]} to load its brief and artifacts into workbench`}
          >
            <span>
              <b>{row[0]} · {row[1]}</b>
              <small>Semester II Full-Stack Engineering {isSelected ? "· Active on workbench" : ""}</small>
            </span>
            <span>{row[2]}</span>
            <span>{row[3]}</span>
            <span><i className={`status ${row[4].toLowerCase().replaceAll(" ", "-")}`}>{row[4]}</i></span>
            <span>{row[5]}</span>
            <span><b>{row[6]}</b><Icon name="arrow" /></span>
          </button>
        );
      })}
    </article>
  </>;
}

function EvidenceLibrary({
  openEvidence,
  notify,
  onNavigate,
}: {
  openEvidence: () => void;
  notify: (message: string) => void;
  onNavigate?: (page: string, assignmentId?: string) => void;
}) {
  const [filter, setFilter] = useState<"all" | "Accepted" | "Under review" | "Revision required">("all");

  const evidence = [
    {
      title: "PR-42 · Frontend–backend integration",
      type: "Engineering artifact",
      description: "Reviewed code connecting the Next.js client to the versioned REST services",
      status: "Accepted",
      outcomes: "Create · PO2 · PSO1",
      assignmentId: "DS-904",
      assignmentTitle: "DS-904 Full-Stack Integration",
      reviewer: "Krishnasree K",
      tileClass: "t0",
    },
    {
      title: "OpenAPI 3.1 contract",
      type: "API specification",
      description: "Endpoints, schemas, authorization rules and error semantics",
      status: "Accepted",
      outcomes: "Evaluate · PO3 · PSO2",
      assignmentId: "DS-904",
      assignmentTitle: "DS-904 / DS-905 API Contract",
      reviewer: "Soorya S Kumar",
      tileClass: "t1",
    },
    {
      title: "PostgreSQL migration set",
      type: "Data engineering",
      description: "Versioned schema, constraints, seed data and rollback procedure",
      status: "Under review",
      outcomes: "Create · PO3",
      assignmentId: "DS-905",
      assignmentTitle: "DS-905 PostgreSQL Integration",
      reviewer: "Soorya S Kumar",
      tileClass: "t2",
    },
    {
      title: "Playwright end-to-end report",
      type: "Quality evidence",
      description: "Priority journeys, trace files and documented failure reproduction",
      status: "Revision required",
      outcomes: "Evaluate · PO4 · PSO4",
      assignmentId: "DS-907",
      assignmentTitle: "DS-907 Quality Gate Revision",
      reviewer: "Ajitha V S",
      tileClass: "t3",
      needsRevision: true,
    },
    {
      title: "Local deployment runbook",
      type: "Operational document",
      description: "Environment, secrets, Docker Compose, health checks and recovery steps",
      status: "Accepted",
      outcomes: "Create · PO4 · PO8",
      assignmentId: "DS-904",
      assignmentTitle: "DS-904 Deployment Readiness",
      reviewer: "Krishnasree K",
      tileClass: "t4",
    },
    {
      title: "Sprint 04 integration retrospective",
      type: "Reflective practice",
      description: "Root causes, team decisions, learning and next experiment",
      status: "Accepted",
      outcomes: "Reflect · PO8",
      assignmentId: "DS-907",
      assignmentTitle: "Sprint 04 Retrospective",
      reviewer: "Ajitha V S",
      tileClass: "t5",
    },
  ];

  const filtered = filter === "all" ? evidence : evidence.filter((item) => item.status === filter);

  return (
    <>
      <PageHeader
        eyebrow="EVIDENCE & PORTFOLIO · DEGREE SHOWCASE"
        title="A verifiable full-stack engineering portfolio"
        description="Each artifact connects an implementation decision to its contract, test evidence, mapped outcome, review history and revision status."
        action="Add learning evidence"
        onAction={openEvidence}
      />

      {/* New Student Onboarding Banner: Portfolio vs Work Board */}
      <article className="panel evidence-onboarding-card">
        <div className="ev-onboard-content">
          <span className="eyebrow">NEW STUDENT REFERENCE · PORTFOLIO VS WORK BOARD</span>
          <h2>Your Cumulative Verified Engineering Showcase</h2>
          <p>
            While your <strong>Work Board</strong> is where you actively execute and submit sprint assignments (DS-904, DS-907), this <strong>Evidence & Portfolio</strong> is your permanent repository of verified deliverables. Each accepted artifact here is permanently mapped to university Programme Outcomes (PO1–PO8) and serves as audited proof of your competence for viva defence, academic marks, and employer portfolios.
          </p>
          <div className="ev-triad-flow">
            <span className="ev-flow-pill"><Icon name="grid" /> 1. Dashboard: Cockpit & Alerts</span>
            <span className="ev-arrow" aria-hidden="true">→</span>
            <span className="ev-flow-pill"><Icon name="brief" /> 2. Work Board: Active Execution</span>
            <span className="ev-arrow" aria-hidden="true">→</span>
            <span className="ev-flow-pill accent"><Icon name="file" /> 3. Portfolio: Permanent Showcase</span>
          </div>
        </div>
        {onNavigate && (
          <div className="ev-onboard-actions">
            <button
              type="button"
              className="wb-overview-jump"
              onClick={() => onNavigate("Work Board")}
              title="Jump to active execution workbench"
            >
              <Icon name="brief" /> Open Work Board Workbench →
            </button>
            <button
              type="button"
              className="wb-overview-jump secondary"
              onClick={() => onNavigate("Overview")}
              title="Return to Dashboard Overview"
            >
              ← Return to Dashboard
            </button>
          </div>
        )}
      </article>

      <div className="evidence-summary">
        <span><b>22</b>Required evidence items</span>
        <span><b>18</b>Ready</span>
        <span><b>2</b>In review</span>
        <span><b>2</b>Quality gaps</span>
      </div>

      {/* Interactive Filter Pills */}
      <div className="evidence-filter-bar" role="group" aria-label="Filter evidence by status">
        <button
          type="button"
          className={`ev-filter-pill ${filter === "all" ? "active" : ""}`}
          onClick={() => setFilter("all")}
        >
          All Artifacts ({evidence.length})
        </button>
        <button
          type="button"
          className={`ev-filter-pill ${filter === "Accepted" ? "active" : ""}`}
          onClick={() => setFilter("Accepted")}
        >
          Accepted ({evidence.filter((e) => e.status === "Accepted").length})
        </button>
        <button
          type="button"
          className={`ev-filter-pill ${filter === "Under review" ? "active" : ""}`}
          onClick={() => setFilter("Under review")}
        >
          In Review ({evidence.filter((e) => e.status === "Under review").length})
        </button>
        <button
          type="button"
          className={`ev-filter-pill ${filter === "Revision required" ? "active" : ""}`}
          onClick={() => setFilter("Revision required")}
        >
          Quality Gaps ({evidence.filter((e) => e.status === "Revision required").length})
        </button>
      </div>

      <div className="card-grid">
        {filtered.map((item) => (
          <article className="panel evidence-card" key={item.title}>
            <div>
              <span className={`file-tile ${item.tileClass}`}><Icon name="file" /></span>
              <i className={`status ${item.status.toLowerCase().replaceAll(" ", "-")}`}>{item.status}</i>
            </div>
            <div className="evidence-origin-row">
              <small>{item.type}</small>
              <span className="evidence-source-pill" title={`Originated in assignment ${item.assignmentId}`}>
                <Icon name="brief" /> {item.assignmentId}
              </span>
            </div>
            <h3>{item.title}</h3>
            <p>{item.description}</p>
            <div className="mapped-outcomes">{item.outcomes}</div>

            {/* If Revision Required, provide direct jump to fix on Work Board */}
            {item.needsRevision && onNavigate ? (
              <button
                type="button"
                className="evidence-fix-btn"
                onClick={() => onNavigate("Work Board", item.assignmentId)}
                title={`Open ${item.assignmentId} on Work Board to resolve quality gap`}
              >
                <Icon name="alert" /> Fix on Work Board ({item.assignmentId}) →
              </button>
            ) : (
              <button
                type="button"
                onClick={() => notify(`${item.title} opened`)}
              >
                Inspect evidence trail <Icon name="arrow" />
              </button>
            )}
          </article>
        ))}
      </div>
    </>
  );
}

function OutcomesPage({ notify, onNavigate, openEvidence }: { notify?: (msg: string) => void; onNavigate?: (page: string, assignmentId?: string) => void; openEvidence?: (assignment?: string) => void }) {
  const [categoryFilter, setCategoryFilter] = useState<"all" | "core" | "specialized">("all");
  const [statusFilter, setStatusFilter] = useState<"all" | "demonstrated" | "advancing" | "gap">("all");

  const competencies = [
    {
      title: "Cloud-Native Full Stack",
      code: "PO2",
      type: "core",
      typeLabel: "Core PO",
      desc: "Architect a scalable client, service and data-layer solution with explicit boundaries.",
      state: "Demonstrated",
      evidence: "PR-42 · architecture decision record",
      source: "DS-904",
      statusKey: "demonstrated",
    },
    {
      title: "Backend & Data Systems",
      code: "PO3",
      type: "core",
      typeLabel: "Core PO",
      desc: "Design distributed backend services, PostgreSQL persistence and reliable data flows.",
      state: "Advancing",
      evidence: "OpenAPI contract · migration set",
      source: "DS-904",
      statusKey: "advancing",
    },
    {
      title: "Delivery Automation & QA",
      code: "PO4",
      type: "core",
      typeLabel: "Core PO",
      desc: "Implement automated test, CI/CD and operational feedback workflows.",
      state: "Evidence gap",
      evidence: "Playwright report · revision required",
      source: "DS-907",
      statusKey: "gap",
    },
    {
      title: "Professional Delivery & Defence",
      code: "PO8",
      type: "core",
      typeLabel: "Core PO",
      desc: "Demonstrate an integrated solution with traceable decisions and technical communication.",
      state: "Advancing",
      evidence: "Runbook accepted · live demo scheduled",
      source: "DS-904",
      statusKey: "advancing",
    },
    {
      title: "Distributed Transaction Resilience",
      code: "PSO1",
      type: "specialized",
      typeLabel: "Specialized PSO",
      desc: "Ensure distributed transaction isolation, token refresh durability and failure recovery.",
      state: "Evidence gap",
      evidence: "Failure trace · token recovery open",
      source: "DS-907",
      statusKey: "gap",
    },
    {
      title: "Quality-Gate Automation",
      code: "PSO4",
      type: "specialized",
      typeLabel: "Specialized PSO",
      desc: "Enforce end-to-end regression testing and containerized test automation pipelines.",
      state: "Advancing",
      evidence: "Chromium & Firefox CI runs",
      source: "DS-907",
      statusKey: "advancing",
    },
  ];

  const filtered = competencies.filter((item) => {
    if (categoryFilter === "core" && item.type !== "core") return false;
    if (categoryFilter === "specialized" && item.type !== "specialized") return false;
    if (statusFilter !== "all" && item.statusKey !== statusFilter) return false;
    return true;
  });

  return (
    <>
      <PageHeader
        eyebrow="SKILLS & OUTCOMES"
        title="Full-stack evidence mapped to programme capabilities"
        description="Progress is demonstrated through reviewed professional artifacts mapped to the published Programme Outcomes and Programme-Specific Outcomes."
      />

      <article className="panel outcomes-demystifier-card">
        <div className="outcomes-demystifier-header">
          <div className="outcomes-demystifier-icon">
            <Icon name="target" />
          </div>
          <div>
            <span className="eyebrow">UNDERSTANDING OUTCOMES · LEVEL 9</span>
            <h2>How Your Code Maps to Degree Competencies</h2>
            <p>
              In MSDSP, you don&apos;t just pass tests; you build verifiable engineering evidence audited against ABET / NBA graduate standards.
            </p>
          </div>
        </div>
        <div className="outcomes-triad-grid">
          <div className="outcome-triad-item">
            <div className="triad-item-badge core">PO1–PO8</div>
            <b>Programme Outcomes</b>
            <p>Universal engineering abilities: problem analysis, system architecture, modern tooling, professional ethics, and communication.</p>
          </div>
          <div className="outcome-triad-item">
            <div className="triad-item-badge spec">PSO1–PSO4</div>
            <b>Specialized Outcomes</b>
            <p>MSDSP cloud-native capabilities: distributed services, data pipelines, resilient transactions, and delivery automation.</p>
          </div>
          <div className="outcome-triad-item">
            <div className="triad-item-badge audit">Audited Proof</div>
            <b>Verifiable Artifacts</b>
            <p>Accepted pull requests and test traces graduate directly to your Evidence &amp; Portfolio to prove competency for viva and placements.</p>
          </div>
        </div>
      </article>

      <article className="panel career-path">
        <div>
          <span className="eyebrow">CURRENT OUTCOME COVERAGE</span>
          <h2>Integrate · Verify · Demonstrate</h2>
          <p>Coverage is an advisory learning view derived from accepted evidence. It does not replace the academic result, certification record or progression decision.</p>
        </div>
        <div className="career-steps">
          <span className="complete"><i><Icon name="check" /></i><b>PO2</b><small>Cloud-native full stack</small></span>
          <span className="current"><i>03</i><b>PO3</b><small>Backend and data systems</small></span>
          <span><i>04</i><b>PO4</b><small>Quality gates in progress</small></span>
        </div>
      </article>

      <div className="outcomes-controls-card">
        <div className="outcomes-progress-strip">
          <div className="outcomes-progress-info">
            <b>Level 9 Active Coverage: 4 / 6 Competencies Addressed (67%)</b>
            <span>2 gaps pending resolution in DS-907</span>
          </div>
          <div className="outcomes-progress-track">
            <div className="outcomes-progress-fill" style={{ width: "67%" }} />
          </div>
        </div>

        <div className="outcomes-filter-bar">
          <div className="outcomes-filter-group" role="group" aria-label="Outcome category">
            <button
              type="button"
              className={`ev-filter-pill ${categoryFilter === "all" ? "active" : ""}`}
              onClick={() => { setCategoryFilter("all"); notify?.("Showing all outcomes"); }}
            >
              All Outcomes (6)
            </button>
            <button
              type="button"
              className={`ev-filter-pill ${categoryFilter === "core" ? "active" : ""}`}
              onClick={() => { setCategoryFilter("core"); notify?.("Showing Core POs"); }}
            >
              Core POs (4)
            </button>
            <button
              type="button"
              className={`ev-filter-pill ${categoryFilter === "specialized" ? "active" : ""}`}
              onClick={() => { setCategoryFilter("specialized"); notify?.("Showing Specialized PSOs"); }}
            >
              Specialized PSOs (2)
            </button>
          </div>

          <div className="outcomes-filter-group" role="group" aria-label="Outcome verification status">
            <button
              type="button"
              className={`ev-filter-pill ${statusFilter === "all" ? "active" : ""}`}
              onClick={() => setStatusFilter("all")}
            >
              All Statuses
            </button>
            <button
              type="button"
              className={`ev-filter-pill ${statusFilter === "demonstrated" ? "active" : ""}`}
              onClick={() => setStatusFilter("demonstrated")}
            >
              Demonstrated (1)
            </button>
            <button
              type="button"
              className={`ev-filter-pill ${statusFilter === "advancing" ? "active" : ""}`}
              onClick={() => setStatusFilter("advancing")}
            >
              Advancing (3)
            </button>
            <button
              type="button"
              className={`ev-filter-pill ${statusFilter === "gap" ? "active" : ""}`}
              onClick={() => setStatusFilter("gap")}
            >
              Evidence Gaps (2)
            </button>
          </div>
        </div>
      </div>

      <div className="outcome-grid">
        {filtered.map((item) => (
          <article className="panel outcome-card competency-card" key={item.code}>
            <div className="outcome-card-top">
              <div className="outcome-badge-wrap">
                <span className="outcome-code-tag">{item.code}</span>
                <small className="outcome-category-tag">{item.typeLabel}</small>
              </div>
              <i className={`skill-state ${item.state.toLowerCase().replace(" ", "-")}`}>
                {item.state}
              </i>
            </div>
            <h3>{item.title}</h3>
            <p>{item.desc}</p>
            <div className="skill-evidence">
              <Icon name="file" />
              <span>
                <small>VERIFIABLE EVIDENCE</small>
                <b>{item.evidence}</b>
              </span>
            </div>
            <div className="outcome-card-footer">
              <span className="outcome-source-tag">Source: {item.source}</span>
              {item.state === "Evidence gap" ? (
                <button
                  type="button"
                  className="outcome-action-btn fix-gap"
                  onClick={() => onNavigate?.("Work Board", item.source)}
                >
                  Fix on Work Board ({item.source}) →
                </button>
              ) : item.state === "Demonstrated" ? (
                <button
                  type="button"
                  className="outcome-action-btn view-portfolio"
                  onClick={() => onNavigate?.("Evidence & Portfolio")}
                >
                  Inspect in Portfolio →
                </button>
              ) : (
                <button
                  type="button"
                  className="outcome-action-btn view-board"
                  onClick={() => onNavigate?.("Work Board", item.source)}
                >
                  View on Work Board →
                </button>
              )}
            </div>
          </article>
        ))}
      </div>
    </>
  );
}

function FeedbackPage({
  notify,
  onNavigate,
  openEvidence,
  selectedAssignmentId,
  onSelectAssignment,
}: {
  notify?: (message: string) => void;
  onNavigate?: (page: string, assignmentId?: string) => void;
  openEvidence?: (assignment?: string) => void;
  selectedAssignmentId?: string;
  onSelectAssignment?: (id: string) => void;
}) {
  const [activeTab, setActiveTab] = useState<string>(selectedAssignmentId && ["DS-907", "DS-904", "DS-905"].includes(selectedAssignmentId) ? selectedAssignmentId : "DS-907");
  const [checklistState, setChecklistState] = useState<Record<string, boolean>>({
    "c-1": false,
    "c-2": false,
    "c-3": false,
    "c-4": false,
  });

  const feedbackData: Record<string, {
    id: string;
    title: string;
    reviewer: string;
    reviewerRole: string;
    date: string;
    status: string;
    statusCode: "revision-required" | "under-review" | "verified";
    urgency: string;
    urgent: boolean;
    quote: string;
    working: string;
    mustChange: string;
    purpose: string;
    checklist: { id: string; text: string }[];
    steps: [string, string][];
  }> = {
    "DS-907": {
      id: "DS-907",
      title: "End-to-end quality gate",
      reviewer: "AJITHA V S",
      reviewerRole: "QA & TEST-AUTOMATION COORDINATOR",
      date: "02 SEPTEMBER 2026",
      status: "Revision required · Action required",
      statusCode: "revision-required",
      urgency: "Due in 34 hours · 05 September",
      urgent: true,
      quote: "The main workflow is integrated. The evidence is not yet demonstration-ready because token refresh and transaction rollback remain unstable and the failure traces are incomplete.",
      working: "Clear API contract, reliable primary CRUD path and reproducible local environment.",
      mustChange: "Repair both failure scenarios, add trace artifacts and link the corrected pull request to the test report.",
      purpose: "Demonstrate cloud-native integration, distributed backend quality and delivery automation against PO2, PO3, PO4 and PSO4.",
      checklist: [
        { id: "c-1", text: "Token refresh scenario passes in Chromium and Firefox" },
        { id: "c-2", text: "Transaction rollback trace attached" },
        { id: "c-3", text: "Corrected pull request linked to report" },
        { id: "c-4", text: "Retrospective updated with root cause" },
      ],
      steps: [
        ["Feedback received", "Complete"],
        ["Revision plan", "Current"],
        ["Evidence replaced", "Pending"],
        ["Resubmitted", "Pending"],
        ["Faculty sign-off", "Pending"],
      ],
    },
    "DS-904": {
      id: "DS-904",
      title: "Full-stack integration and test readiness",
      reviewer: "KRISHNASREE K",
      reviewerRole: "LEARNING CYCLE COORDINATOR · LEVEL 9",
      date: "01 SEPTEMBER 2026",
      status: "Under Review · Live Demo Scheduled",
      statusCode: "under-review",
      urgency: "Live Demonstration · 16 September",
      urgent: false,
      quote: "Architecture decision record (ADR) and service decomposition are cleanly executed. Focus next on live fault-injection resilience and runbook clarity for the viva panel.",
      working: "Clean modular service boundaries, well-documented OpenAPI schema, and PostgreSQL migration integrity.",
      mustChange: "Finalize live failover demonstration script and complete local developer onboarding runbook.",
      purpose: "Validates PO2 (Full-stack architecture) and PO8 (Professional technical communication).",
      checklist: [
        { id: "c-1", text: "ADR-04 signed off and committed" },
        { id: "c-2", text: "Local Docker Compose environment verified" },
        { id: "c-3", text: "10-minute live demonstration slide outline drafted" },
        { id: "c-4", text: "Peer code-review comments resolved on PR-42" },
      ],
      steps: [
        ["Brief assigned", "Complete"],
        ["Draft submitted", "Complete"],
        ["Under review", "Current"],
        ["Live demo gate", "Pending"],
        ["Final grading", "Pending"],
      ],
    },
    "DS-905": {
      id: "DS-905",
      title: "API contract & distributed data persistence",
      reviewer: "DIJU M",
      reviewerRole: "STUDENT-TEAM MENTOR · CODE REVIEW",
      date: "28 AUGUST 2026",
      status: "Approved & Verified",
      statusCode: "verified",
      urgency: "Sprint 03 Milestone verified",
      urgent: false,
      quote: "Excellent work on database migration versioning and schema rollback scripts. Team Northstar demonstrated great discipline with pull-request conventions.",
      working: "Zero schema lint errors, automated Prisma migrations, and comprehensive negative-path HTTP status codes.",
      mustChange: "None for this sprint. Maintain this standard into Sprint 04 verification gates.",
      purpose: "Satisfies PO3 (Data systems) and PSO1 (Resilient transaction isolation).",
      checklist: [
        { id: "c-1", text: "PostgreSQL 16 migration scripts committed" },
        { id: "c-2", text: "Negative test cases for duplicate constraints added" },
        { id: "c-3", text: "OpenAPI 3.1 documentation published" },
        { id: "c-4", text: "Peer review approvals logged" },
      ],
      steps: [
        ["Brief assigned", "Complete"],
        ["Draft submitted", "Complete"],
        ["Code review", "Complete"],
        ["Revisions cleared", "Complete"],
        ["Verified & Approved", "Complete"],
      ],
    },
  };

  const current = feedbackData[activeTab] ?? feedbackData["DS-907"];
  const checkedCount = Object.values(checklistState).filter(Boolean).length;
  const progressPercent = Math.round((checkedCount / current.checklist.length) * 100);

  const toggleCheck = (id: string) => {
    setChecklistState((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  return (
    <>
      <PageHeader
        eyebrow="FACULTY FEEDBACK"
        title="Technical critique and iterative rework"
        description="Use faculty and mentor feedback to strengthen integration reliability, evidence traceability and professional demonstration readiness."
      />

      <div className="feedback-assignment-tabs" role="tablist" aria-label="Assignments with feedback">
        {Object.values(feedbackData).map((item) => (
          <button
            key={item.id}
            role="tab"
            type="button"
            aria-selected={activeTab === item.id}
            className={`feedback-tab-card ${activeTab === item.id ? "active" : ""}`}
            onClick={() => {
              setActiveTab(item.id);
              onSelectAssignment?.(item.id);
              notify?.(`Critique for ${item.id} opened`);
            }}
          >
            <div className="fb-tab-header">
              <b>{item.id}</b>
              <i className={`status ${item.statusCode === "revision-required" ? "revision-required" : item.statusCode === "under-review" ? "upcoming" : "accepted"}`}>
                {item.statusCode === "revision-required" ? "Action Required" : item.statusCode === "under-review" ? "Under Review" : "Verified"}
              </i>
            </div>
            <p className="fb-tab-title">{item.title}</p>
            <small className="fb-tab-reviewer">{item.reviewer}</small>
          </button>
        ))}
      </div>

      <article className="panel revision-workflow">
        <PanelHeading
          label={`${current.id} · REVISION WORKFLOW`}
          title={current.title}
          meta={current.urgency}
        />
        <div>
          {current.steps.map((item, index) => (
            <span
              className={item[1] === "Complete" ? "done" : item[1] === "Current" ? "current" : ""}
              key={item[0]}
            >
              <i>{item[1] === "Complete" ? <Icon name="check" /> : index + 1}</i>
              <b>{item[0]}</b>
              <small>{item[1]}</small>
            </span>
          ))}
        </div>
      </article>

      <article className="panel feedback-feature">
        <div className="feedback-header">
          <span className="avatar">
            {current.reviewer.split(" ").map((n) => n[0]).slice(0, 2).join("")}
          </span>
          <div>
            <small>{current.reviewer} · {current.reviewerRole} · {current.date}</small>
            <h2>{current.status}</h2>
          </div>
          <i className={`status ${current.statusCode === "revision-required" ? "revision-required" : current.statusCode === "under-review" ? "upcoming" : "accepted"}`}>
            {current.statusCode === "revision-required" ? "Action required" : current.statusCode === "under-review" ? "Pending Demo" : "Verified"}
          </i>
        </div>

        <blockquote>“{current.quote}”</blockquote>

        <div className="critique-grid">
          <div>
            <small>WHAT IS WORKING</small>
            <p>{current.working}</p>
          </div>
          <div>
            <small>WHAT MUST CHANGE</small>
            <p>{current.mustChange}</p>
          </div>
          <div>
            <small>ACADEMIC PURPOSE</small>
            <p>{current.purpose}</p>
          </div>
        </div>

        <div className="revision-checklist-wrap">
          <div className="revision-checklist-header">
            <b>REVISION CHECKLIST &amp; FIX ITEMS</b>
            <span>{checkedCount} of {current.checklist.length} completed ({progressPercent}%)</span>
          </div>
          <div className="revision-checklist-bar">
            <div className="revision-checklist-fill" style={{ width: `${progressPercent}%` }} />
          </div>
          <div className="revision-checklist">
            {current.checklist.map((item) => (
              <label key={item.id} className={checklistState[item.id] ? "checked" : ""}>
                <input
                  type="checkbox"
                  checked={checklistState[item.id] || false}
                  onChange={() => toggleCheck(item.id)}
                />
                <span>{item.text}</span>
              </label>
            ))}
          </div>
        </div>

        <div className="button-row">
          <button
            type="button"
            className="secondary-btn"
            onClick={() => notify?.(`Clarification request sent to ${current.reviewer}`)}
          >
            <Icon name="message" /> Respond to reviewer
          </button>
          <button
            type="button"
            className="secondary-btn"
            onClick={() => {
              openEvidence?.(current.id);
              notify?.(`Evidence modal opened for ${current.id}`);
            }}
          >
            <Icon name="file" /> Upload Evidence / Traces
          </button>
          <button
            type="button"
            className="primary-button"
            onClick={() => {
              onSelectAssignment?.(current.id);
              onNavigate?.("Work Board", current.id);
            }}
          >
            Execute Revision on Work Board ({current.id}) <Icon name="arrow" />
          </button>
        </div>
      </article>
    </>
  );
}

function StudentCalendar({ notify, onNavigate }: { notify?: (message: string) => void; onNavigate?: (page: string, assignmentId?: string) => void }) {
  const [selectedDay, setSelectedDay] = useState<number>(5);
  const [categoryFilter, setCategoryFilter] = useState<"all" | "official" | "review" | "sprint" | "certification">("all");

  const days = Array.from({ length: 30 }, (_, index) => index + 1);

  type CalendarEvent = {
    id: string;
    label: string;
    category: "official" | "review" | "sprint" | "certification";
    categoryLabel: string;
    time?: string;
    reviewer?: string;
    venue?: string;
    detail: string;
    assignmentId?: string;
    actionLabel?: string;
    actionType?: "workboard" | "feedback";
  };

  const calendarEvents: Record<number, CalendarEvent[]> = {
    3: [
      {
        id: "ev-03",
        label: "Sprint 04 · Verify checkpoint",
        category: "sprint",
        categoryLabel: "Personal Sprint Plan",
        time: "14:00 – 16:00",
        venue: "Engineering Pod Alpha",
        detail: "Execute local Chromium & Firefox test runs and capture failed trace recordings for PR-42.",
        assignmentId: "DS-907",
        actionLabel: "View on Work Board →",
        actionType: "workboard",
      },
    ],
    5: [
      {
        id: "ev-05",
        label: "DS-907 End-to-end quality gate revision due",
        category: "official",
        categoryLabel: "Official Deadline · Faculty Controlled",
        time: "Due 23:59 IST",
        reviewer: "Ajitha V S (QA Coordinator)",
        venue: "Online Submission Gate",
        detail: "Repair token refresh and transaction rollback failure scenarios, attach trace artifacts and link PR-42.",
        assignmentId: "DS-907",
        actionLabel: "Fix on Work Board (DS-907) →",
        actionType: "workboard",
      },
    ],
    14: [
      {
        id: "ev-14",
        label: "DS-904 Faculty review & code signoff",
        category: "official",
        categoryLabel: "Official Milestone",
        time: "11:00 IST",
        reviewer: "Krishnasree K (Level Coordinator)",
        venue: "Faculty Review Chamber 4",
        detail: "Full-stack integration, architecture decision record (ADR) signoff, and PostgreSQL migration integrity.",
        assignmentId: "DS-904",
        actionLabel: "Open DS-904 on Work Board →",
        actionType: "workboard",
      },
    ],
    15: [
      {
        id: "ev-15",
        label: "DS-905 API architecture check",
        category: "review",
        categoryLabel: "Peer & Mentor Review",
        time: "15:30 IST",
        reviewer: "Diju M (Team Mentor)",
        venue: "Studio 2",
        detail: "Review OpenAPI 3.1 specifications and schema rollback scripts before sprint freeze.",
        assignmentId: "DS-905",
        actionLabel: "View on Work Board →",
        actionType: "workboard",
      },
    ],
    16: [
      {
        id: "ev-16",
        label: "Full-stack live demonstration · 10:30",
        category: "review",
        categoryLabel: "Faculty Review Panel",
        time: "10:30 – 11:30 IST",
        reviewer: "Krishnasree K · Ajitha V S",
        venue: "Engineering Studio 2",
        detail: "Demonstrate integrated workflow, automated tests, failure recovery, and reproducible local setup.",
        assignmentId: "DS-904",
        actionLabel: "View Faculty Feedback Brief →",
        actionType: "feedback",
      },
    ],
    18: [
      {
        id: "ev-18",
        label: "AWS evidence verification",
        category: "certification",
        categoryLabel: "External Certification",
        time: "17:00 IST",
        reviewer: "Certification Advisory Board",
        venue: "Credential Verification Portal",
        detail: "Independent verification of AWS Certified Solutions Architect – Associate (SAA-C03) score report.",
        actionLabel: "View Performance Record →",
      },
    ],
    20: [
      {
        id: "ev-20",
        label: "DS-907 final resubmission",
        category: "official",
        categoryLabel: "Official Deadline",
        time: "23:59 IST",
        reviewer: "Ajitha V S",
        venue: "Final Evaluation Gate",
        detail: "Final regression sign-off before Level 10 progression lock.",
        assignmentId: "DS-907",
        actionLabel: "Open Work Board →",
        actionType: "workboard",
      },
    ],
  };

  const selectedEvents = calendarEvents[selectedDay] ?? [];

  return (
    <>
      <PageHeader
        eyebrow="STUDENT CALENDAR · SEPTEMBER"
        title="Plan around official academic commitments"
        description="Faculty deadlines, reviews and certification checks are locked. Personal work-plan events remain editable and never represent attendance."
        action="Add personal work block"
        onAction={() => notify?.("Personal event editor opened")}
      />

      <article className="panel calendar-clarification-card">
        <div className="calendar-clarification-icon">
          <Icon name="shield" />
        </div>
        <div>
          <span className="eyebrow">ACADEMIC WORK PLANNING ONLY</span>
          <b>Calendar is for Academic Commitments — Attendance is Managed in DUK@360</b>
          <p>
            This calendar organizes your sprint milestones, live reviews, and submission deadlines. Daily student attendance, clock-in, and leave records are tracked exclusively in <strong>DUK@360</strong> and are never recorded here.
          </p>
        </div>
      </article>

      <article className="panel calendar-sprint-strip">
        <div className="calendar-sprint-header">
          <span className="eyebrow">LEVEL 9 · SPRINT PROGRESSION TIMELINE</span>
          <b>Active Sprint: Sprint 04 · Verify (01–14 September)</b>
        </div>
        <div className="calendar-sprint-track">
          <div className="sprint-segment done">
            <b>Sprint 01</b>
            <span>Contract (Completed)</span>
          </div>
          <div className="sprint-segment done">
            <b>Sprint 02</b>
            <span>Connect (Completed)</span>
          </div>
          <div className="sprint-segment done">
            <b>Sprint 03</b>
            <span>Persist (Completed)</span>
          </div>
          <div className="sprint-segment current">
            <span className="pulse-dot" />
            <b>Sprint 04 · Verify</b>
            <span>01–14 Sep · Active Sprint</span>
          </div>
          <div className="sprint-segment upcoming">
            <b>Sprint 05 · Demonstrate</b>
            <span>15–21 Sep · Live Demo</span>
          </div>
        </div>
      </article>

      <div className="calendar-filter-bar">
        <button
          type="button"
          className={`ev-filter-pill ${categoryFilter === "all" ? "active" : ""}`}
          onClick={() => setCategoryFilter("all")}
        >
          All Events (7)
        </button>
        <button
          type="button"
          className={`ev-filter-pill ${categoryFilter === "official" ? "active" : ""}`}
          onClick={() => setCategoryFilter("official")}
        >
          Official Deadlines (3)
        </button>
        <button
          type="button"
          className={`ev-filter-pill ${categoryFilter === "review" ? "active" : ""}`}
          onClick={() => setCategoryFilter("review")}
        >
          Reviews &amp; Demos (2)
        </button>
        <button
          type="button"
          className={`ev-filter-pill ${categoryFilter === "sprint" ? "active" : ""}`}
          onClick={() => setCategoryFilter("sprint")}
        >
          Sprint Work (1)
        </button>
        <button
          type="button"
          className={`ev-filter-pill ${categoryFilter === "certification" ? "active" : ""}`}
          onClick={() => setCategoryFilter("certification")}
        >
          Certification (1)
        </button>
      </div>

      <div className="calendar-layout">
        <article className="panel calendar-panel">
          <div className="calendar-toolbar">
            <div>
              <button aria-label="Previous month" onClick={() => notify?.("August 2026 viewed")}><Icon name="chevron" /></button>
              <h2>September 2026</h2>
              <button aria-label="Next month" onClick={() => notify?.("October 2026 viewed")}><Icon name="arrow" /></button>
            </div>
            <button onClick={() => { setSelectedDay(3); notify?.("Today selected (03 September)"); }}>Today</button>
          </div>

          <div className="calendar-legend">
            <span><i className="official" />Official · faculty controlled</span>
            <span><i className="review-dot" />Review &amp; demo panel</span>
            <span><i className="personal" />Personal work plan</span>
            <span><i className="certification" />Certification</span>
          </div>

          <div className="calendar-grid">
            <div className="weekdays">
              {["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map((day) => (
                <b key={day}>{day}</b>
              ))}
            </div>
            <div className="calendar-days">
              <span className="empty" />
              <span className="empty" />
              {days.map((day) => {
                const dayEvs = calendarEvents[day] ?? [];
                const isSelected = selectedDay === day;
                const isToday = day === 3;
                return (
                  <button
                    type="button"
                    className={`calendar-day-btn ${isToday ? "today" : ""} ${isSelected ? "selected-day" : ""} ${dayEvs.length > 0 ? "has-events" : ""}`}
                    key={day}
                    onClick={() => {
                      setSelectedDay(day);
                      notify?.(`${day} September selected`);
                    }}
                  >
                    <time>{day}</time>
                    {dayEvs.map((event) => (
                      <small className={event.category} key={event.id}>
                        {event.category === "official" && <Icon name="shield" />}
                        {event.label}
                      </small>
                    ))}
                  </button>
                );
              })}
            </div>
          </div>

          <div className="calendar-day-drawer">
            <div className="day-drawer-header">
              <div>
                <span className="eyebrow">SELECTED DATE INSPECTION</span>
                <h3>{selectedDay} September 2026</h3>
              </div>
              <span className="day-event-count">
                {selectedEvents.length} {selectedEvents.length === 1 ? "Event" : "Events"}
              </span>
            </div>
            {selectedEvents.length === 0 ? (
              <div className="day-empty-state">
                <p>No official deadlines or events scheduled for {selectedDay} September. You can use this day for personal sprint work.</p>
                <button
                  type="button"
                  className="outcome-action-btn view-board"
                  onClick={() => notify?.("Personal study session added")}
                >
                  + Add Personal Work Block
                </button>
              </div>
            ) : (
              <div className="day-events-list">
                {selectedEvents.map((event) => (
                  <div className="day-event-card" key={event.id}>
                    <div className="day-event-card-top">
                      <span className={`day-event-cat-badge ${event.category}`}>
                        {event.categoryLabel}
                      </span>
                      {event.time && <span className="day-event-time">{event.time}</span>}
                    </div>
                    <h4>{event.label}</h4>
                    <p>{event.detail}</p>
                    <div className="day-event-meta">
                      {event.reviewer && <span><strong>Reviewer:</strong> {event.reviewer}</span>}
                      {event.venue && <span><strong>Venue:</strong> {event.venue}</span>}
                    </div>
                    {event.actionLabel && (
                      <div className="day-event-actions">
                        <button
                          type="button"
                          className="primary-button compact"
                          onClick={() => {
                            if (event.actionType === "feedback") {
                              onNavigate?.("Faculty Feedback");
                            } else if (event.assignmentId) {
                              onNavigate?.("Work Board", event.assignmentId);
                            } else {
                              onNavigate?.("Performance & Results");
                            }
                          }}
                        >
                          {event.actionLabel}
                        </button>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </article>

        <aside className="calendar-side">
          <article className="panel">
            <PanelHeading label="UPCOMING" title="Academic commitments" meta="Next 17 days" />
            <div className="agenda-list">
              {[
                ["05 SEP", "DS-907 revision due", "Official deadline · Due in 34h", "DS-907"],
                ["14 SEP", "DS-904 faculty review", "Krishnasree K · In 9 days", "DS-904"],
                ["16 SEP", "Full-stack live demonstration", "10:30 · Engineering Studio 2", "DS-904"],
                ["18 SEP", "AWS SAA-C03 verification", "Certification record · In 13 days", ""],
              ].map((item) => (
                <button
                  key={item[0]}
                  type="button"
                  onClick={() => {
                    if (item[3]) {
                      onNavigate?.("Work Board", item[3]);
                    } else {
                      onNavigate?.("Performance & Results");
                    }
                  }}
                >
                  <i>{item[0]}</i>
                  <span>
                    <b>{item[1]}</b>
                    <small>{item[2]}</small>
                  </span>
                  <Icon name="arrow" />
                </button>
              ))}
            </div>
          </article>

          <article className="panel calendar-boundary">
            <Icon name="shield" />
            <div>
              <b>Calendar is not attendance</b>
              <p>Events organise academic work. DUK@360 remains the only attendance system.</p>
            </div>
          </article>
        </aside>
      </div>
    </>
  );
}

function StudentInformationCentre({ notify }: { notify: (message: string) => void }) {
  const [section, setSection] = useState("Information");
  const abbreviations = [
    ["MSDSP", "Master of Science in Data Science and Product Development"], ["DUK", "Digital University Kerala"], ["DUK@360", "University system that remains authoritative for attendance"], ["LC", "Learning Cycle; mapped 1:1 to an official Level"], ["PO", "Programme Outcome"], ["PSO", "Programme-Specific Outcome"], ["API", "Application Programming Interface"], ["PR", "Pull Request"], ["E2E", "End-to-End testing"], ["CI/CD", "Continuous Integration and Continuous Delivery"], ["SSO", "Single Sign-On"], ["RBAC", "Role-Based Access Control"], ["CRUD", "Create, Read, Update and Delete"], ["AWS SAA-C03", "AWS Certified Solutions Architect – Associate examination"],
  ];
  const faqs = [
    ["What is a Learning Cycle?", "A Learning Cycle represents one official Level. It normally contains five weekly Sprints and remains within one semester."],
    ["What should I submit as evidence?", "Submit authentic professional artifacts such as specifications, pull requests, migrations, automated test reports, runbooks, demonstrations and reflective records required by the assignment brief."],
    ["Are academic marks and Level points the same?", "No. Academic marks follow the approved Course Plan. Gamification points are a separate, provisional progression overlay and never replace the academic result."],
    ["Does portal activity count as attendance?", "No. Attendance is exclusively managed in DUK@360. Login time, time spent, submission frequency and after-hours work are not attendance."],
    ["What happens when revision is required?", "Review the faculty critique, create a revision plan, replace or add the required evidence, resubmit it and wait for faculty sign-off."],
    ["Does an incomplete external certification block academic progression?", "Not by itself in this prototype. Certification evidence and verification are tracked separately from the academic result."],
    ["Which dates can I change?", "Faculty-controlled deadlines and review events are official and locked. Personal work-plan dates may be adjusted without changing the official deadline."],
  ];
  return <><PageHeader eyebrow="STUDENT REFERENCE" title="Information Centre" description="Programme guidance, frequently asked questions, abbreviations and operating boundaries—kept separate from your active learning workspace." /><article className="information-hero"><div><span>STUDENT GUIDE · MSDSP</span><h2>Find the rule, term or next point of contact</h2><p>Use this reference page when you need programme context. Return to Overview, Work Board or Faculty Feedback when you need to complete an action.</p></div><aside><Icon name="book" /><span><b>Level 9</b><small>Full Stack Integration & Testing</small></span></aside></article><div className="info-section-tabs" role="tablist" aria-label="Information Centre sections">{["Information", "FAQ", "Abbreviations", "Guidance & Support"].map((item) => <button role="tab" aria-selected={section === item} className={section === item ? "active" : ""} key={item} onClick={() => setSection(item)}>{item}</button>)}</div>
    {section === "Information" && <div className="info-overview-grid"><article className="panel info-structure"><PanelHeading label="PROGRAMME STRUCTURE" title="How your learning work is organised" meta="Student view" /><div>{[["01", "Programme", "M.Sc. Data Science and Product Development"], ["02", "Semester", "Four progressive academic stages"], ["03", "Learning Cycle / Level", "Twenty official Levels; five per semester"], ["04", "Weekly Sprint", "Normally five Sprints within each Learning Cycle"], ["05", "Assignment & evidence", "Professional work reviewed against outcomes and rubrics"]].map((item) => <span key={item[0]}><i>{item[0]}</i><p><b>{item[1]}</b><small>{item[2]}</small></p></span>)}</div></article><article className="panel info-navigation"><PanelHeading label="WHERE TO GO" title="Choose the correct workspace" meta="Quick reference" /><div>{[["Overview", "Priorities, current Level, points and upcoming reviews"], ["Work Board", "Assignment brief, criteria, artifacts and submission"], ["Evidence & Portfolio", "Evidence trail, status and outcome mappings"], ["Faculty Feedback", "Revision requirements and resubmission workflow"], ["Performance & Results", "Academic calculation, Level points and certification"]].map((item) => <button key={item[0]} onClick={() => notify(`${item[0]} guidance opened`)}><Icon name="arrow" /><span><b>{item[0]}</b><small>{item[1]}</small></span></button>)}</div></article><article className="panel info-boundary-summary"><Icon name="shield" /><div><span className="eyebrow">ESSENTIAL BOUNDARY</span><h3>Evidence demonstrates learning; activity does not prove attendance</h3><p>MSDSP records assignments, professional artifacts, academic review and progression. DUK@360 remains the authoritative attendance system.</p></div></article></div>}
    {section === "FAQ" && <article className="panel faq-panel"><PanelHeading label="FREQUENTLY ASKED QUESTIONS" title="Student academic and workflow guidance" meta={`${faqs.length} answers`} /><div>{faqs.map((item, index) => <details key={item[0]} open={index === 0}><summary><span>{String(index + 1).padStart(2, "0")}</span><b>{item[0]}</b><Icon name="chevron" /></summary><p>{item[1]}</p></details>)}</div></article>}
    {section === "Abbreviations" && <article className="panel abbreviation-panel"><PanelHeading label="ABBREVIATIONS & TERMS" title="MSDSP academic and engineering glossary" meta={`${abbreviations.length} entries`} /><div className="abbreviation-head"><b>Term</b><b>Meaning</b></div>{abbreviations.map((item) => <div className="abbreviation-row" key={item[0]}><strong>{item[0]}</strong><span>{item[1]}</span></div>)}</article>}
    {section === "Guidance & Support" && <div className="guidance-grid"><article className="panel"><PanelHeading label="ACADEMIC GUIDANCE" title="Who supports each decision" meta="Escalation path" /><div className="support-list">{[["Assignment or rubric clarification", "Assigned faculty member shown in the Work Board"], ["Full-stack integration guidance", "Learning Cycle coordinator or mapped technical mentor"], ["E2E test and quality revision", "Ajitha V S · QA and test-automation coordinator"], ["Official marks or progression", "Authorised academic faculty / Programme Board process"], ["Attendance correction", "DUK@360 support; not the MSDSP portal"]].map((item) => <span key={item[0]}><Icon name="message" /><p><b>{item[0]}</b><small>{item[1]}</small></p></span>)}</div></article><article className="panel operating-boundaries"><PanelHeading label="OPERATING BOUNDARIES" title="What the portal does and does not do" meta="Prototype rules" /><dl><div><dt>Academic result</dt><dd>Course Plan components and faculty-approved evidence</dd></div><div><dt>Gamification</dt><dd>Separate provisional points and Level progression view</dd></div><div><dt>Certifications</dt><dd>Evidence and verification tracked separately</dd></div><div><dt>Official deadlines</dt><dd>Faculty controlled and locked</dd></div><div><dt>Personal planning</dt><dd>Student controlled; does not change official dates</dd></div><div><dt>Attendance</dt><dd>Managed exclusively in DUK@360</dd></div></dl><button onClick={() => notify("Support request form opened")}>Request guidance <Icon name="arrow" /></button></article></div>}
  </>;
}

function PerformancePage({ notify, onNavigate }: { notify?: (message: string) => void; onNavigate?: (page: string, assignmentId?: string) => void }) {
  const [simFixDS907, setSimFixDS907] = useState(false);
  const [simLiveDemo, setSimLiveDemo] = useState(false);

  const baseAcademic = useMemo(() => academicComponents.reduce((sum, [, score, weight]) => sum + score * weight / 100, 0), []);
  const basePoints = 780;

  const simPoints = basePoints + (simFixDS907 ? 30 : 0) + (simLiveDemo ? 80 : 0);
  const simAcademic = baseAcademic + (simLiveDemo ? (90 - 84) * 0.5 : 0) + (simFixDS907 ? (85 - 78) * 0.2 : 0);

  return (
    <>
      <PageHeader
        eyebrow="PERFORMANCE & RESULTS"
        title="Academic evaluation and gamification shown separately"
        description="The Course Plan assessment view, Level 9 gamification points and AWS SAA-C03 verification are distinct records. Draft gamification rules remain subject to Programme Board approval."
      />

      <article className="panel scores-demystifier-card">
        <div className="scores-demystifier-header">
          <div className="scores-demystifier-icon">
            <Icon name="chart" />
          </div>
          <div>
            <span className="eyebrow">DEMYSTIFYING YOUR SCORES · LEVEL 9</span>
            <h2>Understanding Academic Marks vs Quest Points</h2>
            <p>
              Students often ask: <em>&quot;Why are there two different numbers?&quot;</em> MSDSP strictly separates formal university grades from formative sprint gamification.
            </p>
          </div>
        </div>
        <div className="scores-triad-grid">
          <div className="scores-triad-item official">
            <div className="triad-item-badge">Official Grade</div>
            <b>Academic Result ({baseAcademic.toFixed(1)}%)</b>
            <p>
              Governed by DUK University exam regulations. Calculated from 5 weighted Course Plan components. Directly determines your official semester Grade Point Average (GPA) and degree credits.
            </p>
          </div>
          <div className="scores-triad-item gamification">
            <div className="triad-item-badge">Sprint Pace</div>
            <b>Quest Points (780 / 1000 pts)</b>
            <p>
              Agile development velocity metric. Helps you and your mentors track sprint momentum. Unlocks progression bands (Ladder Pass at 700+, Distinction at 900+). <strong>Never affects or lowers your GPA.</strong>
            </p>
          </div>
          <div className="scores-triad-item certification">
            <div className="triad-item-badge">Industry Credential</div>
            <b>AWS SAA-C03 (Pending)</b>
            <p>
              Co-curricular industry credential verified independently. Adds distinct professional value to your placement profile without altering course grading.
            </p>
          </div>
        </div>
      </article>

      <div className="reward-ledger">
        <article className="panel official">
          <span className="eyebrow">ACADEMIC RESULT · COURSE PLAN VIEW</span>
          <div>
            <b>{baseAcademic.toFixed(1)}%</b>
            <i>Current calculation</i>
          </div>
          <p>Weighted academic components supported by reviewed full-stack evidence.</p>
        </article>
        <article className="panel mastery">
          <span className="eyebrow">LEVEL 9 GAMIFICATION · PROVISIONAL</span>
          <div>
            <b>780</b>
            <i>/ 1,000 points</i>
          </div>
          <p>Illustrative points from the shared Level 9 rubric; not an academic mark.</p>
        </article>
        <article className="panel effort">
          <span className="eyebrow">AWS SAA-C03</span>
          <div>
            <b>Pending</b>
            <i>verification</i>
          </div>
          <p>External certification evidence is tracked separately and does not determine the academic result.</p>
        </article>
      </div>

      <article className="panel what-if-simulator-card">
        <div className="simulator-header">
          <div className="sim-title-wrap">
            <span className="eyebrow">INTERACTIVE PROGRESSION SIMULATOR</span>
            <h3>What-If Grade &amp; Points Projector</h3>
            <p>See in real time how closing active revision gaps and nailing upcoming reviews elevates your standing.</p>
          </div>
          <div className="sim-score-badges">
            <div className="sim-score-box">
              <small>PROJECTED POINTS</small>
              <b className={simPoints > basePoints ? "projected" : ""}>{simPoints} / 1000</b>
              <span>{simPoints >= 890 ? "Distinction Pace ⭐" : "Ladder Pass"}</span>
            </div>
            <div className="sim-score-box">
              <small>PROJECTED MARK</small>
              <b className={simAcademic > baseAcademic ? "projected" : ""}>{simAcademic.toFixed(1)}%</b>
              <span>{simAcademic > baseAcademic ? `+${(simAcademic - baseAcademic).toFixed(1)}% boost` : "Base result"}</span>
            </div>
          </div>
        </div>

        <div className="simulator-toggles">
          <label className={`sim-toggle-pill ${simFixDS907 ? "active" : ""}`}>
            <input
              type="checkbox"
              checked={simFixDS907}
              onChange={() => {
                setSimFixDS907(!simFixDS907);
                notify?.(!simFixDS907 ? "Simulator: DS-907 resolution applied (+30 pts)" : "Simulator: DS-907 reset");
              }}
            />
            <div>
              <b>Fix DS-907 Quality Gate (+30 Quest Points)</b>
              <small>Repair token refresh &amp; rollback traces; clears PO4 and PSO1 evidence gap</small>
            </div>
          </label>

          <label className={`sim-toggle-pill ${simLiveDemo ? "active" : ""}`}>
            <input
              type="checkbox"
              checked={simLiveDemo}
              onChange={() => {
                setSimLiveDemo(!simLiveDemo);
                notify?.(!simLiveDemo ? "Simulator: Live Demo distinction applied (+80 pts)" : "Simulator: Live Demo reset");
              }}
            />
            <div>
              <b>Score 90% on Live Demonstration (+80 Quest Points)</b>
              <small>16 Sep Live Demo with Krishnasree K; boosts Live Project component to 90%</small>
            </div>
          </label>
        </div>

        {simPoints >= 890 && (
          <div className="distinction-unlocked-banner">
            <Icon name="award" />
            <div>
              <b>🎉 Distinction Band Projection Unlocked! ({simPoints} / 1000 pts)</b>
              <p>Completing both items elevates you into the top 90%+ performance band for Level 9 graduation honours.</p>
            </div>
          </div>
        )}
      </article>

      <article className="panel calculation-panel">
        <PanelHeading
          label="WEIGHTED ACADEMIC CALCULATION"
          title="Every contribution remains visible"
          meta="Gamification and attendance excluded"
        />
        <div className="calculation-table">
          <div>
            <b>Assessment component</b>
            <b>Supporting Evidence / Task</b>
            <b>Score</b>
            <b>Weight</b>
            <b>Contribution</b>
          </div>
          {[
            ["Live Project Work", "DS-904 Full-Stack Capstone & PR-42", 84, 50, "DS-904"],
            ["Product Milestones", "DS-905 API & DS-907 Quality Gate", 78, 20, "DS-907"],
            ["Documentation & Process", "Architecture Decision Record (ADR-04)", 88, 10, "DS-904"],
            ["Continuous Evaluation", "Sprint commits, pull-request code reviews", 81, 10, "DS-904"],
            ["Theory Examination", "Continuous Internal Assessment (CIA)", 76, 10, ""],
          ].map(([label, source, score, weight, navId]) => (
            <div key={String(label)}>
              <span>{String(label)}</span>
              <span className="calc-source-pill">
                {navId ? (
                  <button
                    type="button"
                    className="calc-link-btn"
                    onClick={() => onNavigate?.("Work Board", String(navId))}
                    title={`View ${source} on Work Board`}
                  >
                    {String(source)} →
                  </button>
                ) : (
                  <span>{String(source)}</span>
                )}
              </span>
              <span>{score}%</span>
              <span>{weight}%</span>
              <strong>{(Number(score) * Number(weight) / 100).toFixed(1)}</strong>
            </div>
          ))}
          <div className="total">
            <b>Current academic result</b>
            <span />
            <span />
            <span>100%</span>
            <strong>{baseAcademic.toFixed(1)}%</strong>
          </div>
        </div>
      </article>

      <article className="panel points-ledger">
        <PanelHeading
          label="LEVEL 9 POINTS LEDGER · PROVISIONAL"
          title="How 780 of 1,000 points are evidenced"
          meta="Shared Level 9 rubric"
        />
        <div className="points-head">
          <b>Component</b>
          <b>Evidence basis</b>
          <b>Verification</b>
          <b>Awarded</b>
        </div>
        {levelNinePoints.map((item) => (
          <div className="points-row" key={item.component}>
            <span>
              <b>{item.component}</b>
              <small>{item.maximum} maximum</small>
            </span>
            <span>{item.evidence}</span>
            <i className={`status ${item.status.toLowerCase()}`}>{item.status}</i>
            <strong>{item.awarded} / {item.maximum}</strong>
          </div>
        ))}
        <div className="points-total">
          <b>Total provisional points</b>
          <span>Academic result and attendance excluded</span>
          <strong>780 / 1,000</strong>
        </div>
      </article>

      <article className="panel certification-record">
        <PanelHeading
          label="ONLINE CERTIFICATION RECORD"
          title="AWS Certified Solutions Architect – Associate"
          meta="SAA-C03"
        />
        <div>
          <span><small>Provider</small><b>Amazon Web Services</b></span>
          <span><small>Enrolment</small><b>Record not supplied</b></span>
          <span><small>Learning modules</small><b>Record not supplied</b></span>
          <span><small>Assessment evidence</small><b>Supplied · independent verification pending</b></span>
          <span><small>Academic effect</small><b>Tracked separately; does not determine academic result</b></span>
        </div>
      </article>

      <article className="panel mastery-rules">
        <PanelHeading label="RESULT BOUNDARIES" title="What each record means" meta="Prototype governance" />
        <div>
          <span><Icon name="chart" /><p><b>Academic result</b>Course Plan components, rubric criteria and faculty-approved evidence.</p></span>
          <span><Icon name="award" /><p><b>Gamification points</b>Motivational overlay from the draft Level 9 rubric; never substituted for marks.</p></span>
          <span><Icon name="file" /><p><b>Certification status</b>AWS SAA-C03 evidence and independent verification status.</p></span>
          <span><Icon name="shield" /><p><b>Excluded signals</b>Attendance, login frequency, time spent and after-hours activity.</p></span>
        </div>
      </article>

      <article className="panel progression-panel">
        <PanelHeading
          label="DRAFT GAMIFICATION BANDS"
          title="Progression overlay from the shared rubric"
          meta="Programme Board approval pending"
        />
        <div>
          {[
            ["0–49%", "Snake Zone", "Structured recovery"],
            ["50–69%", "Conditional Pass", "Remedial evidence"],
            ["70–89%", "Ladder Pass", "★ Current: 780 pts · Progress to next level"],
            ["90–100%", "Distinction", "Distinction honors · 120 pts to unlock"],
          ].map((x, i) => (
            <span className={i === 2 ? "active current-ladder" : ""} key={x[0]}>
              <b>{x[0]}</b>
              <strong>{x[1]}</strong>
              <small>{x[2]}</small>
            </span>
          ))}
        </div>
      </article>
    </>
  );
}

function MentorWorkspace({ page, cycle, mentorKind, notify }: { page: string; cycle: Cycle; mentorKind: MentorKind; notify: (message: string) => void }) {
  if (page === "My Allocations") return <MentorAllocations cycle={cycle} mentorKind={mentorKind} notify={notify} />;
  if (page === "Learners & Teams") return <MentorLearners cycle={cycle} mentorKind={mentorKind} notify={notify} />;
  if (page === "Sprint Workspace") return <MentorSprintWorkspace cycle={cycle} mentorKind={mentorKind} notify={notify} />;
  if (page === "Evidence Review") return <MentorReviewQueue cycle={cycle} mentorKind={mentorKind} notify={notify} />;
  if (page === "Feedback & Revisions") return <MentorRevisionPage notify={notify} />;
  if (page === "Mentoring Records") return <MentoringRecords cycle={cycle} mentorKind={mentorKind} notify={notify} />;
  if (page === "Competency & Calibration") return <MentorCompetencyPage cycle={cycle} mentorKind={mentorKind} notify={notify} />;
  if (page === "Escalations") return <MentorEscalations cycle={cycle} mentorKind={mentorKind} notify={notify} />;
  if (page === "Recommendation Tracker") return <MentorRecommendationPage cycle={cycle} mentorKind={mentorKind} notify={notify} />;
  if (page === "Calendar") return <MentorCalendar cycle={cycle} mentorKind={mentorKind} notify={notify} />;
  if (page === "Course Details") return <CourseDetails notify={notify} />;
  return <MentorOverview cycle={cycle} mentorKind={mentorKind} notify={notify} />;
}

const mentorProfiles = {
  domain: { name: "Ajitha V S", initials: "AV", label: "Domain Mentor · QA & Testing", authority: "Specialist review and recommendation", levels: "Levels 8 · 9 · 15", track: "Test automation · CI/CD testing · QA sign-off" },
  team: { name: "Diju M", initials: "DM", label: "Student-Team Mentor · Code Review", authority: "Continuous team guidance and referral", levels: "Levels 8–12", track: "Sprint builds · code review · peer-review facilitation" },
} as const;

function mentorAllocation(cycle: Cycle, mentorKind: MentorKind) {
  if (mentorKind === "domain" && cycle.level === 10) return { active: false, coordinator: "Arun Nadh G", focus: "No active QA allocation", scope: "Ajitha V S is mapped to Levels 8, 9 and 15. Level 10 support requires a formal referral from the Level Coordinator.", sprint: "Allocation not assigned" };
  if (cycle.level === 8) return mentorKind === "domain"
    ? { active: true, coordinator: "Soorya S Kumar", focus: "API quality and test automation", scope: "Review negative-path API evidence, CI test execution and Postman verification for Level 8.", sprint: "Sprint 05 · Demonstrate" }
    : { active: true, coordinator: "Soorya S Kumar", focus: "Build mentoring and code review", scope: "Guide the assigned team through API implementation, pull-request revisions and professional code-review practice.", sprint: "Sprint 05 · Demonstrate" };
  if (cycle.level === 9) return mentorKind === "domain"
    ? { active: true, coordinator: "Krishnasree K", focus: "Quality engineering and test automation", scope: "Prioritise API and E2E evidence, failure recovery, reproducibility and technical communication.", sprint: "Sprint 04 · Verify" }
    : { active: true, coordinator: "Krishnasree K", focus: "Full-stack build and code-review guidance", scope: "Maintain team momentum, review integration decisions, surface blockers and refer specialist evidence to the Domain Mentor.", sprint: "Sprint 04 · Verify" };
  return { active: true, coordinator: "Arun Nadh G", focus: mentorKind === "domain" ? "Specialist support by referral" : "Deployment-readiness mentoring", scope: mentorKind === "domain" ? "No standing Level 10 allocation. Review only evidence formally referred by the Level Coordinator." : "Guide local deployment, runbook quality, issue closure and the Semester II demonstration hand-off.", sprint: "Sprint 01 · Prepare" };
}

function MentorNoAllocation({ cycle, notify }: { cycle: Cycle; notify: (message: string) => void }) {
  return <article className="panel mentor-empty"><Icon name="shield" /><div><span className="eyebrow">NO STANDING ALLOCATION</span><h2>No active mentor responsibility for {cycle.id}</h2><p>Ajitha V S is mapped to Levels 8, 9 and 15 in the proposed coordination plan. Work for this Learning Cycle appears only after a Level Coordinator referral.</p></div><button onClick={() => notify("Specialist referral request opened")}>Request specialist referral <Icon name="arrow" /></button></article>;
}

function MentorAllocations({ cycle, mentorKind, notify }: { cycle: Cycle; mentorKind: MentorKind; notify: (message: string) => void }) {
  const profile = mentorProfiles[mentorKind];
  const selected = mentorAllocation(cycle, mentorKind);
  const allocations = mentorKind === "domain"
    ? [["LC-08", "API quality and CI testing", "Support", "Accepted", "6 hrs/week"], ["LC-09", "E2E quality and QA sign-off", "Domain reviewer", "Accepted", "8 hrs/week"], ["LC-15", "Product hardening", "QA coordinator", "Upcoming", "TBC"]]
    : [["LC-08", "Backend build and code review", "Team mentor", "Accepted", "6 hrs/week"], ["LC-09", "Integration and PR review", "Team mentor", "Accepted", "8 hrs/week"], ["LC-10", "Local deployment readiness", "Continuity mentor", "Proposed", "4 hrs/week"], ["LC-11–12", "API and microservices builds", "Build mentor", "Planned", "TBC"]];
  return <><PageHeader eyebrow="MENTOR GOVERNANCE" title="My allocations and authority" description="Confirm the exact Learning Cycles, learners, specialist scope and weekly capacity assigned through the coordination plan." action="Review allocation" onAction={() => notify(`${cycle.id} allocation record opened`)} /><section className="mentor-role-card"><div><span className="avatar">{profile.initials}</span><span><small>{profile.label}</small><h2>{profile.name}</h2><p>{profile.track}</p></span></div><dl><div><dt>Coordination tier</dt><dd>{mentorKind === "domain" ? "Tier 2 · Domain Mentor Pod" : "Tier 3 · Student-Team Mentor"}</dd></div><div><dt>Authority</dt><dd>{profile.authority}</dd></div><div><dt>Mapped Levels</dt><dd>{profile.levels}</dd></div><div><dt>Current cycle</dt><dd>{selected.active ? "Active allocation" : "Referral only"}</dd></div></dl></section><article className="panel mentor-allocation-table"><PanelHeading label="FORMAL ALLOCATION REGISTER" title="Responsibility, status and planned capacity" meta="Programme Board proposal" /><div className="mentor-allocation-head"><b>Learning Cycle</b><b>Assigned outcome</b><b>Role</b><b>Status</b><b>Capacity</b><b /></div>{allocations.map((item) => <button key={item[0]} onClick={() => notify(`${item[0]} allocation opened`)}><strong>{item[0]}</strong><span>{item[1]}</span><span>{item[2]}</span><i className={`status ${item[3].toLowerCase()}`}>{item[3]}</i><span>{item[4]}</span><Icon name="arrow" /></button>)}</article><article className="panel allocation-controls"><Icon name="shield" /><div><b>Allocation acceptance is auditable</b><p>Every assignment records the coordinator, effective dates, learner/team scope, expected contribution, weekly capacity and acceptance history.</p></div><button onClick={() => notify("Allocation acceptance history opened")}>View history</button></article></>;
}

function MentorOverview({ cycle, mentorKind, notify }: { cycle: Cycle; mentorKind: MentorKind; notify: (message: string) => void }) {
  const profile = mentorProfiles[mentorKind];
  const allocation = mentorAllocation(cycle, mentorKind);
  if (!allocation.active) return <><PageHeader eyebrow={`MENTOR WORKSPACE · ${cycle.id}`} title={`Good afternoon, ${profile.name}`} description="Your dashboard shows only formally assigned work or specialist referrals for the selected Learning Cycle." /><MentorNoAllocation cycle={cycle} notify={notify} /><MentorLifecycle notify={notify} /></>;
  const actions = mentorKind === "domain"
    ? [["High", "Anakha Rajesh", "Verify revised Playwright failure traces", "DS-907 · specialist review", "Today"], ["High", "Team Northstar", "Review integration pull request PR-42", "DS-904 · QA gate", "Today"], ["Medium", "Alfin", "Clarify API contract evidence gap", "DS-905 · test evidence", "05 Sep"], ["Standard", "Annamma", "Confirm demonstration quality gate", "Live demo · readiness", "06 Sep"]]
    : [["High", "Team Northstar", "Resolve integration blocker before QA referral", "DS-904 · team support", "Today"], ["High", "Anakha Rajesh", "Agree revision plan for PR-42", "DS-907 · mentoring", "Today"], ["Medium", "Alfin", "Prepare API contract for specialist review", "DS-905 · team check", "05 Sep"], ["Standard", "Dhanush Girish", "Complete team allocation and baseline", "Onboarding", "06 Sep"]];
  return <><PageHeader eyebrow={`MENTOR WORKSPACE · ${cycle.id}`} title={`Good afternoon, ${profile.name}`} description={mentorKind === "domain" ? "Provide specialist QA judgement across assigned teams and return evidence-backed recommendations to the Level Coordinator." : "Guide assigned learners continuously, maintain team momentum and refer specialist evidence when domain judgement is required."} action={mentorKind === "domain" ? "Open next review" : "Open team checkpoint"} onAction={() => notify(`${actions[0][2]} opened`)} /><section className="mentor-command"><div><span className="mentor-live"><i /> {allocation.sprint.toUpperCase()}</span><p>{cycle.semester} · {cycle.id} · Official Level {cycle.level}</p><h2>{allocation.focus}</h2><p>{allocation.scope}</p><div className="mentor-tags"><span>Coordinator · {allocation.coordinator}</span><span>{profile.label}</span><span>5 cohort learners</span><span>{profile.levels}</span></div></div><aside><span className="avatar">{profile.initials}</span><div><small>MENTOR AUTHORITY</small><b>{profile.authority}</b><p>Final marks, official deadlines and progression publication remain with the Course Head.</p></div></aside></section><div className="metric-grid"><Metric icon="users" label={mentorKind === "domain" ? "Learners in scope" : "Assigned learners"} value="5" meta="Approved five-student cohort" trend="4 active · 1 pending" tone="cyan" /><Metric icon="review" label={mentorKind === "domain" ? "Specialist reviews" : "Team checkpoints"} value="5" meta="Two high priority" trend="Oldest · 1 day" tone="indigo" /><Metric icon="message" label="Active revisions" value="3" meta="Two due this week" trend="1 resubmitted" tone="violet" /><Metric icon="shield" label="Open escalations" value="1" meta="Coordinator response due" trend="Within SLA" tone="gold" /></div><div className="primary-grid"><article className="panel mentor-action-centre"><PanelHeading label="NEXT MENTOR ACTIONS" title={mentorKind === "domain" ? "Evidence requiring specialist judgement" : "Team interventions requiring follow-through"} meta="4 open" /><div>{actions.map((item, index) => <button key={item[1] + item[2]} onClick={() => notify(`${item[2]} opened`)}><i className={`priority p${index}`}>{item[0]}</i><span className="avatar">{item[1].split(" ").map((part) => part[0]).slice(0, 2).join("")}</span><span><b>{item[2]}</b><small>{item[1]} · {item[3]}</small></span><em>{item[4]}</em><Icon name="arrow" /></button>)}</div></article><aside className="side-stack"><article className="panel mentor-sprint-pulse"><PanelHeading label={allocation.sprint.toUpperCase()} title="Assigned cohort readiness" meta="Current week" /><div className="mentor-pulse-ring"><b>{cycle.progress}%</b><span>cycle readiness</span></div><dl><div><dt>On track</dt><dd>2 learners</dd></div><div><dt>Revision</dt><dd>2 learners</dd></div><div><dt>Escalation</dt><dd>1 learner</dd></div></dl></article><article className="panel mentor-boundary"><Icon name="shield" /><div><b>Evidence-based mentoring</b><p>Review work quality and learning evidence. Attendance, login activity and time spent remain outside MSDSP.</p></div></article></aside></div><MentorLifecycle notify={notify} /><article className="panel course-flow"><PanelHeading label="LEVEL 0 COURSE WORKFLOW" title="Governance, mentoring and evidence flow" meta="Role boundary view" /><div className="course-flow-track"><span><i>01</i><b>Programme Board</b><small>Rules and approval</small></span><em><Icon name="arrow" /></em><span><i>02</i><b>Course Head</b><small>Configure and govern</small></span><em><Icon name="arrow" /></em><span className="portal"><i>03</i><b>Level Coordinator</b><small>Allocate and resolve</small></span><em><Icon name="arrow" /></em><span className="active"><i>04</i><b>Mentor Team</b><small>Guide, review and refer</small></span><em><Icon name="arrow" /></em><span><i>05</i><b>Student / Team</b><small>Create and defend evidence</small></span></div><footer><Icon name="shield" /><p><b>DUK@360 remains external</b>Attendance does not enter mentoring, academic or gamification decisions.</p></footer></article></>;
}

function MentorLifecycle({ notify }: { notify: (message: string) => void }) {
  return <article className="panel mentor-lifecycle"><PanelHeading label="MENTOR DELIVERY CYCLE" title="Allocation to Course Head recommendation" meta="Current stage · Evidence review" /><div>{[["01", "Allocate", "Accepted"], ["02", "Calibrate", "Complete"], ["03", "Mentor", "Active"], ["04", "Review", "Current"], ["05", "Recommend", "Next"], ["06", "Close", "Pending"]].map((item, index) => <button key={item[0]} className={index < 3 ? "done" : index === 3 ? "current" : ""} onClick={() => notify(`${item[1]} stage opened`)}><i>{index < 3 ? <Icon name="check" /> : item[0]}</i><span><b>{item[1]}</b><small>{item[2]}</small></span></button>)}</div></article>;
}

function MentorLearners({ cycle, mentorKind, notify }: { cycle: Cycle; mentorKind: MentorKind; notify: (message: string) => void }) {
  const allocation = mentorAllocation(cycle, mentorKind);
  if (!allocation.active) return <><PageHeader eyebrow={`MENTOR ALLOCATION · ${cycle.id}`} title="Learners and teams" description="Only learners connected to a formal allocation or specialist referral are displayed." /><MentorNoAllocation cycle={cycle} notify={notify} /></>;
  const learnerDetails: Array<[string, string, string, number, string]> = [["Individual", "DS-905 contract review", "OpenAPI evidence", 62, "Support needed"], ["Team Northstar", "DS-907 revision", "Playwright traces", 84, "Revision"], ["Team Orion", "DS-904 integration", "Demo readiness", 91, "On track"], ["Team Vector", "DS-904 integration", "Rollback evidence", 70, "Watch"], ["Team allocation pending", "Mentor onboarding", "Initial evidence review", 0, "Allocation pending"]];
  const learners: Array<[string, string, string, string, number, string]> = prototypeCohort.map((name, index) => [name, ...learnerDetails[index]]);
  return <><PageHeader eyebrow={`MENTOR ALLOCATION · ${cycle.id}`} title="Assigned learners and product teams" description={mentorKind === "domain" ? "View learners whose QA evidence requires specialist review. Continuous team ownership remains with the Student-Team Mentor." : "Maintain continuous learner support, team actions and specialist referrals using evidence—not attendance or online activity."} action="Record mentor note" onAction={() => notify("Structured mentoring record opened")} /><article className="panel allocation-summary"><div><span className="eyebrow">ACTIVE ALLOCATION</span><h2>Level {cycle.level} · {cycle.title}</h2><p>{allocation.scope}</p></div><dl><div><dt>Accepted</dt><dd>4 learners</dd></div><div><dt>Pending allocation</dt><dd>1 learner</dd></div><div><dt>Responsibility</dt><dd>{mentorKind === "domain" ? "Specialist evidence review" : "Continuous team mentoring"}</dd></div><div><dt>Escalation owner</dt><dd>{allocation.coordinator}</dd></div></dl></article><FilterBar placeholder="Search assigned learner or team" /><div className="mentor-learner-grid">{learners.map((item) => <article className="panel mentor-learner" key={item[0]}><header><span className="avatar">{item[0].split(" ").map((part) => part[0]).slice(0, 2).join("")}</span><i className={`status ${item[5].toLowerCase().replaceAll(" ", "-")}`}>{item[5]}</i></header><h3>{item[0]}</h3><p>{item[1]}</p><dl><div><dt>Current work</dt><dd>{item[2]}</dd></div><div><dt>{mentorKind === "domain" ? "Review scope" : "Mentor focus"}</dt><dd>{item[3]}</dd></div><div><dt>Evidence ready</dt><dd>{item[4]}%</dd></div></dl><div className="mini-progress"><i style={{ width: `${item[4]}%` }} /></div><button onClick={() => notify(`${item[0]} mentoring record opened`)}>Open mentoring record <Icon name="arrow" /></button></article>)}</div></>;
}

function MentorSprintWorkspace({ cycle, mentorKind, notify }: { cycle: Cycle; mentorKind: MentorKind; notify: (message: string) => void }) {
  const allocation = mentorAllocation(cycle, mentorKind);
  if (!allocation.active) return <><PageHeader eyebrow={`SPRINT MENTORING · ${cycle.id}`} title="Sprint workspace" description="Work appears after a formal specialist referral." /><MentorNoAllocation cycle={cycle} notify={notify} /></>;
  const work = [["Anakha Rajesh", "Token refresh and rollback scenarios", "Revision", "Ajitha V S", "05 Sep"], ["Alfin", "OpenAPI error-contract verification", "Mentoring", "Ajitha V S", "05 Sep"], ["Annamma", "Live demonstration rehearsal", "Scheduled", "Ajitha V S", "06 Sep"], ["Annrosna", "PostgreSQL rollback evidence", "Evidence gap", "Sridas D · Ajitha V S", "07 Sep"], ["Dhanush Girish", "Initial allocation and evidence baseline", "Pending", "Course Head", "TBC"]];
  return <><PageHeader eyebrow={`SPRINT MENTORING · ${cycle.id}`} title={allocation.sprint} description={`${allocation.focus}. ${allocation.scope}`} action="Add mentoring checkpoint" onAction={() => notify("Checkpoint editor opened")} /><article className="panel sprint-mentor-map"><PanelHeading label={`${cycle.id} · ${cycle.weeks}`} title="Five connected workplace Sprints" meta={mentorProfiles[mentorKind].label} /><div>{sprintData.map((item, index) => <button key={item.no} className={index < 3 ? "done" : index === 3 ? "current" : ""} onClick={() => notify(`Sprint ${item.no} opened`)}><i>{index < 3 ? <Icon name="check" /> : item.no}</i><span><small>{item.state}</small><b>{item.name}</b><p>{item.detail}</p></span></button>)}</div></article><article className="panel mentor-work-table"><PanelHeading label="MENTORING WORK PLAN" title="Current learner and team interventions" meta="4 active items" /><div className="mentor-work-head"><b>Learner / team</b><b>Mentoring outcome</b><b>Status</b><b>Mentor</b><b>Review</b></div>{work.map((item) => <button key={item[0]} onClick={() => notify(`${item[0]} Sprint work opened`)}><span><b>{item[0]}</b><small>Level {cycle.level} · {allocation.sprint}</small></span><span>{item[1]}</span><i className={`status ${item[2].toLowerCase().replaceAll(" ", "-")}`}>{item[2]}</i><span>{mentorKind === "domain" ? item[3] : "Diju M"}</span><strong>{item[4]} <Icon name="arrow" /></strong></button>)}</article><article className="panel mentor-sop"><Icon name="shield" /><div><span className="eyebrow">MENTORING SOP</span><h3>Challenge decisions; do not implement the student’s solution</h3><p>Use questions, artifact review and targeted examples to develop Analyze, Evaluate and Create capabilities. Record the evidence gap and expected verification method.</p></div></article></>;
}

function MentorReviewQueue({ cycle, mentorKind, notify }: { cycle: Cycle; mentorKind: MentorKind; notify: (message: string) => void }) {
  const allocation = mentorAllocation(cycle, mentorKind);
  if (!allocation.active) return <><PageHeader eyebrow={`EVIDENCE REVIEW · ${cycle.id}`} title="Evidence review workbench" description="Specialist evidence appears only after a formal referral." /><MentorNoAllocation cycle={cycle} notify={notify} /></>;
  const rows = [["High", "Anakha Rajesh", "Playwright failure trace", "DS-907", "Resubmitted", "Today"], ["High", "Alfin", "PR-42 integration review", "DS-904", "New", "Today"], ["Medium", "Annamma", "OpenAPI error contract", "DS-905", "New", "05 Sep"], ["Standard", "Annrosna", "Demo readiness pack", "DS-904", "New", "06 Sep"], ["Standard", "Dhanush Girish", "Initial evidence baseline", "Allocation", "Pending", "TBC"]];
  return <><PageHeader eyebrow={`EVIDENCE REVIEW · ${cycle.id}`} title="Evidence review workbench" description={mentorKind === "domain" ? "Apply the shared technical standard, annotate artifacts and return a specialist judgement to the Level Coordinator." : "Check completeness, coach the learner and refer specialist evidence when domain validation is required."} action="Start next review" onAction={() => notify("Playwright failure trace review opened")} /><section className="review-workbench"><article className="panel review-document"><header><span><small>ACTIVE REVIEW · DS-907</small><h2>Playwright failure and recovery trace</h2><p>Anakha Rajesh · Version 3 · Submitted 04 Sep, 09:42</p></span><i className="status resubmitted">Resubmitted</i></header><div className="artifact-provenance"><span><Icon name="file" /><p><b>playwright-report-v3.zip</b><small>SHA-256 recorded · supersedes Version 2</small></p></span><button onClick={() => notify("Version comparison opened")}>Compare versions</button></div><div className="annotation-stream"><span><i>01</i><p><b>Token refresh scenario</b><small>Passing trace supplied; previous failure resolved.</small></p></span><span><i>02</i><p><b>Transaction rollback</b><small>Database state is restored, but the assertion does not prove idempotency.</small></p></span></div></article><aside className="panel review-rubric"><PanelHeading label="RUBRIC DECISION" title="Criterion-level judgement" meta="PO4 · Evaluate" /><div>{[["Needs Revision", "Evidence is incomplete or not independently reproducible"], ["Meets Industry Standard", "Expected and failure paths are verified"], ["Exceeds Expectations", "Trade-offs, risks and recovery are independently defended"]].map((item, index) => <button className={index === 0 ? "selected" : ""} key={item[0]} onClick={() => notify(`${item[0]} selected`)}><i>{index + 1}</i><span><b>{item[0]}</b><small>{item[1]}</small></span></button>)}</div><label>Mentor rationale<textarea defaultValue="Rollback evidence is reproducible. Add an idempotency assertion and attach the corrected trace before sign-off." /></label><button className="primary-button" onClick={() => notify("Evidence-linked revision issued")}>Issue revision request <Icon name="arrow" /></button></aside></section><FilterBar placeholder="Search learner, team or evidence" /><article className="panel mentor-review-table"><div className="mentor-review-head"><b>Priority</b><b>Learner and evidence</b><b>Assignment</b><b>State</b><b>Due</b><b /></div>{rows.map((item, index) => <button key={item[1] + item[2]} onClick={() => notify(`${item[2]} review opened`)}><i className={`priority p${Math.min(index, 3)}`}>{item[0]}</i><span><b>{item[2]}</b><small>{item[1]}</small></span><span>{item[3]}</span><i className={`status ${item[4].toLowerCase()}`}>{item[4]}</i><span>{item[5]}</span><strong>Review <Icon name="arrow" /></strong></button>)}</article><article className="panel review-criteria-strip"><PanelHeading label={`LEVEL ${cycle.level} TECHNICAL REVIEW`} title="Observable evidence standards" meta="Shared rubric" /><div>{[["Integration", "Reliable client, API and data flow"], ["Quality", "Expected and failure paths verified"], ["Reproducibility", "Independent local setup succeeds"], ["Professional judgement", "Decisions and trade-offs defended"]].map((item) => <span key={item[0]}><Icon name="check" /><p><b>{item[0]}</b><small>{item[1]}</small></p></span>)}</div></article></>;
}

function MentorRevisionPage({ notify }: { notify: (message: string) => void }) {
  const cases = [["DS-907", "Anakha Rajesh", "Token refresh and transaction rollback", "Revision plan", "05 Sep"], ["DS-905", "Alfin", "Missing negative-path API evidence", "Feedback issued", "06 Sep"], ["DS-904", "Annrosna", "Rollback procedure not reproducible", "Resubmitted", "07 Sep"]];
  return <><PageHeader eyebrow="FEEDBACK & REVISIONS" title="Turn technical critique into verifiable improvement" description="Issue specific, evidence-linked feedback and track each revision without overwriting the original submission." action="Create revision request" onAction={() => notify("Revision request editor opened")} /><article className="panel revision-pipeline"><PanelHeading label="STANDARD REVISION FLOW" title="Feedback to mentor sign-off" meta="Auditable versions" /><div>{[["01", "Feedback issued"], ["02", "Student acknowledges"], ["03", "Revision plan"], ["04", "Evidence replaced"], ["05", "Resubmitted"], ["06", "Mentor sign-off"]].map((item, index) => <span className={index < 2 ? "done" : index === 2 ? "current" : ""} key={item[0]}><i>{index < 2 ? <Icon name="check" /> : item[0]}</i><b>{item[1]}</b></span>)}</div></article><div className="mentor-revision-grid">{cases.map((item, index) => <article className={`panel mentor-revision-card r${index}`} key={item[0]}><header><span>{item[0]}</span><i className={`status ${item[3].toLowerCase().replaceAll(" ", "-")}`}>{item[3]}</i></header><h3>{item[1]}</h3><p>{item[2]}</p><dl><div><dt>Required verification</dt><dd>{index === 0 ? "Passing Playwright traces and corrected PR" : index === 1 ? "Postman negative-path report" : "Successful rollback reproduction"}</dd></div><div><dt>Due</dt><dd>{item[4]}</dd></div></dl><button onClick={() => notify(`${item[0]} revision opened`)}>Open revision trail <Icon name="arrow" /></button></article>)}</div></>;
}

function MentoringRecords({ cycle, mentorKind, notify }: { cycle: Cycle; mentorKind: MentorKind; notify: (message: string) => void }) {
  const allocation = mentorAllocation(cycle, mentorKind);
  if (!allocation.active) return <><PageHeader eyebrow={`MENTORING RECORDS · ${cycle.id}`} title="Mentoring records" description="Records appear only for formally assigned mentoring or specialist referrals." /><MentorNoAllocation cycle={cycle} notify={notify} /></>;
  const records = mentorKind === "domain"
    ? [["04 Sep · 11:30", "Anakha Rajesh", "QA evidence clinic", "2 actions", "Acknowledged"], ["03 Sep · 15:00", "Team Northstar", "E2E failure triage", "3 actions", "In progress"], ["02 Sep · 10:15", "Alfin", "API contract review", "1 action", "Due 05 Sep"]]
    : [["04 Sep · 09:30", "Team Northstar", "Daily blocker review", "2 actions", "In progress"], ["03 Sep · 14:00", "Anakha Rajesh", "Revision planning", "3 actions", "Acknowledged"], ["02 Sep · 16:15", "Dhanush Girish", "Allocation onboarding", "1 action", "Pending"]];
  return <><PageHeader eyebrow={`MENTORING RECORDS · ${cycle.id}`} title="Professional mentoring record" description="Capture objectives, observations, agreed actions, ownership and learner acknowledgement for every material intervention." action="Create mentoring record" onAction={() => notify("New mentoring record opened")} /><section className="mentoring-record-layout"><article className="panel mentoring-records"><PanelHeading label="RECENT INTERVENTIONS" title="Auditable mentoring history" meta={`${records.length} records`} /><div>{records.map((item) => <button key={item[0] + item[1]} onClick={() => notify(`${item[1]} mentoring record opened`)}><time>{item[0]}</time><span><b>{item[2]}</b><small>{item[1]} · {item[3]}</small></span><i className={`status ${item[4].toLowerCase().replaceAll(" ", "-")}`}>{item[4]}</i><Icon name="arrow" /></button>)}</div></article><aside className="panel mentoring-record-form"><PanelHeading label="STRUCTURED RECORD" title="Required fields" meta="Draft" /><dl><div><dt>Objective</dt><dd>Verify rollback evidence and agree the next revision</dd></div><div><dt>Observation</dt><dd>Recovery works; idempotency evidence remains incomplete</dd></div><div><dt>Student action</dt><dd>Add assertion and attach a new Playwright trace</dd></div><div><dt>Mentor action</dt><dd>Review the resubmission within one working day</dd></div><div><dt>Due and owner</dt><dd>05 Sep · Anakha Rajesh</dd></div><div><dt>Acknowledgement</dt><dd>Recorded 04 Sep · 12:04</dd></div></dl><button onClick={() => notify("Mentoring record version history opened")}>View change history <Icon name="arrow" /></button></aside></section><article className="panel revision-pipeline"><PanelHeading label="REVISION CONTROL" title="Feedback to mentor sign-off" meta="Original evidence retained" /><div>{[["01", "Feedback issued"], ["02", "Student acknowledges"], ["03", "Revision plan"], ["04", "Evidence replaced"], ["05", "Resubmitted"], ["06", "Mentor sign-off"]].map((item, index) => <span className={index < 2 ? "done" : index === 2 ? "current" : ""} key={item[0]}><i>{index < 2 ? <Icon name="check" /> : item[0]}</i><b>{item[1]}</b></span>)}</div></article></>;
}

function MentorCompetencyPage({ cycle, mentorKind, notify }: { cycle: Cycle; mentorKind: MentorKind; notify: (message: string) => void }) {
  const allocation = mentorAllocation(cycle, mentorKind);
  if (!allocation.active) return <><PageHeader eyebrow={`COMPETENCY & CALIBRATION · ${cycle.id}`} title="Competency evidence" description="Calibration remains visible, while learner evidence requires a formal specialist referral." /><MentorNoAllocation cycle={cycle} notify={notify} /></>;
  const outcomes = [["PO2", "Cloud-native full-stack systems", "PR-42 · architecture decision record", "Demonstrated"], ["PO3", "Distributed backend and data systems", "OpenAPI contract · PostgreSQL migrations", "Advancing"], ["PO4", "DevOps, CI/CD and automated quality", "Playwright report · revision open", "Evidence gap"], ["PO8", "Industry readiness and professional competence", "Runbook accepted · demonstration scheduled", "Advancing"]];
  return <><PageHeader eyebrow={`COMPETENCY & CALIBRATION · ${cycle.id}`} title="Validate professional capability through artifacts" description="Inspect learner-specific evidence, apply a shared standard and record calibration decisions before making recommendations." action="Join calibration" onAction={() => notify("Calibration session opened")} /><article className="panel competency-calibration"><div><Icon name="target" /><span><small>MENTOR CALIBRATION · VERSION 2.1</small><h2>Analyze · Evaluate · Create</h2><p>Apply the same observable standard across teams. Last calibrated with {allocation.coordinator} on 02 September.</p></span></div><button onClick={() => notify("Calibration guide opened")}>Open anchor examples <Icon name="arrow" /></button></article><article className="panel calibration-matrix"><PanelHeading label="SHARED PERFORMANCE STANDARD" title="Artifact quality anchors" meta="Applies to all mentors" /><div>{[["Needs Revision", "Cannot be reproduced, lacks required proof, or does not explain the decision"], ["Meets Industry Standard", "Works reliably, satisfies the brief and is supported by auditable evidence"], ["Exceeds Expectations", "Demonstrates independent validation, risk awareness and defensible trade-offs"]].map((item, index) => <span key={item[0]}><i>{index + 1}</i><p><b>{item[0]}</b><small>{item[1]}</small></p></span>)}</div></article><div className="mentor-competency-grid">{outcomes.map((item) => <article className="panel" key={item[0]}><header><span>{item[0]}</span><i className={`status ${item[3].toLowerCase().replaceAll(" ", "-")}`}>{item[3]}</i></header><h3>{item[1]}</h3><div className="competency-proof"><Icon name="file" /><span><small>EVIDENCE BASIS</small><b>{item[2]}</b></span></div><dl><div><dt>Learners mapped</dt><dd>{item[0] === "PO4" ? "5" : "4"}</dd></div><div><dt>Awaiting review</dt><dd>{item[0] === "PO4" ? "3" : "1"}</dd></div></dl><button onClick={() => notify(`${item[0]} learner-by-competency matrix opened`)}>Open learner matrix <Icon name="arrow" /></button></article>)}</div></>;
}

function MentorEscalations({ cycle, mentorKind, notify }: { cycle: Cycle; mentorKind: MentorKind; notify: (message: string) => void }) {
  const allocation = mentorAllocation(cycle, mentorKind);
  if (!allocation.active) return <><PageHeader eyebrow={`ESCALATIONS · ${cycle.id}`} title="Mentor escalations" description="Specialist escalations appear only after a formal referral." /><MentorNoAllocation cycle={cycle} notify={notify} /></>;
  const issues = mentorKind === "domain"
    ? [["Technical quality", "Annrosna · rollback remains non-reproducible", "High", allocation.coordinator, "Response due today", "Open"], ["Evidence integrity", "Alfin · API report lacks environment metadata", "Medium", "Diju M", "Mentor action · 05 Sep", "Assigned"], ["Specialist capacity", "Two QA reviews overlap the live demonstration", "Low", "Ajitha V S", "Replan by 06 Sep", "Monitoring"]]
    : [["Technical blocker", "Team Northstar · token refresh blocks demonstration", "High", "Ajitha V S", "Specialist review today", "Referred"], ["Allocation", "Dhanush Girish · team assignment not confirmed", "Medium", allocation.coordinator, "Decision due 05 Sep", "Open"], ["Dependency", "API contract approval blocks client integration", "Medium", "Soorya S Kumar", "Review due 06 Sep", "Assigned"]];
  return <><PageHeader eyebrow={`ESCALATIONS · ${cycle.id}`} title="Resolve mentoring risks before they affect progression" description="Record the issue, evidence, severity, accountable owner, response deadline and resolution. Attendance concerns remain in DUK@360." action="Raise escalation" onAction={() => notify("Escalation form opened")} /><div className="metric-grid"><Metric icon="shield" label="Open escalations" value="3" meta="One high priority" trend="All within SLA" tone="gold" /><Metric icon="users" label="Coordinator actions" value="1" meta={allocation.coordinator} trend="Response due today" tone="indigo" /><Metric icon="review" label="Specialist referrals" value={mentorKind === "domain" ? "2" : "1"} meta="Evidence-linked" trend="No attendance signals" tone="cyan" /><Metric icon="message" label="Resolved this cycle" value="4" meta="Resolution evidence retained" trend="Median · 1.2 days" tone="violet" /></div><article className="panel escalation-register"><PanelHeading label="ESCALATION REGISTER" title="Issue ownership and service level" meta={allocation.coordinator} /><div className="escalation-head"><b>Category</b><b>Issue and evidence</b><b>Severity</b><b>Owner</b><b>Required response</b><b>Status</b><b /></div>{issues.map((item) => <button key={item[0] + item[1]} onClick={() => notify(`${item[0]} escalation opened`)}><strong>{item[0]}</strong><span>{item[1]}</span><i className={`priority ${item[2] === "High" ? "p0" : item[2] === "Medium" ? "p2" : "p3"}`}>{item[2]}</i><span>{item[3]}</span><span>{item[4]}</span><i className={`status ${item[5].toLowerCase()}`}>{item[5]}</i><Icon name="arrow" /></button>)}</article><article className="panel escalation-path"><PanelHeading label="CONTROLLED ESCALATION PATH" title="Keep decisions with the correct authority" meta="Role boundary" /><div>{[["01", "Mentor records issue", "Artifact, learner impact and attempted intervention"], ["02", "Level Coordinator responds", "Assign support, adjust mentoring or refer onward"], ["03", "Course Head decides", "Academic exception, deadline or progression action"], ["04", "Mentor verifies closure", "Resolution evidence and learner communication"]].map((item) => <span key={item[0]}><i>{item[0]}</i><p><b>{item[1]}</b><small>{item[2]}</small></p></span>)}</div></article></>;
}

function MentorRecommendationPage({ cycle, mentorKind, notify }: { cycle: Cycle; mentorKind: MentorKind; notify: (message: string) => void }) {
  const allocation = mentorAllocation(cycle, mentorKind);
  if (!allocation.active) return <><PageHeader eyebrow={`RECOMMENDATION TRACKER · ${cycle.id}`} title="Evaluation recommendations" description="Recommendations appear only for formally assigned evidence." /><MentorNoAllocation cycle={cycle} notify={notify} /></>;
  const recommendations = [["Alfin", "DS-905", "Targeted rework required", "Not ready", "Draft"], ["Anakha Rajesh", "DS-904 / DS-907", "Meets standard after revision", "780 / 1,000 provisional", "Draft"], ["Annamma", "DS-904", "Demonstration ready", "Awaiting live demo", "Submitted"], ["Annrosna", "DS-905", "Evidence incomplete", "Not ready", "Returned"], ["Dhanush Girish", "Allocation pending", "No recommendation yet", "Not assessed", "Pending"]];
  return <><PageHeader eyebrow={`RECOMMENDATION TRACKER · ${cycle.id}`} title="Submit and follow evidence-backed recommendations" description={mentorKind === "domain" ? "Submit specialist competency judgements to the Level Coordinator and track the Course Head decision." : "Consolidate learner progress, specialist input and unresolved risks before recommending the next action."} action="Create recommendation" onAction={() => notify("Recommendation editor opened")} /><article className="panel recommendation-boundary"><Icon name="shield" /><div><span className="eyebrow">AUTHORITY CONTROL</span><h2>Recommendation is not publication</h2><p>Academic marks, official progression decisions and deadline changes cannot be finalised from the Mentor workspace.</p></div><span><b>Course Head approval</b><small>Required</small></span></article><article className="panel recommendation-stages"><PanelHeading label="APPROVAL WORKFLOW" title="Recommendation status" meta="Versioned and auditable" /><div>{[["01", "Draft"], ["02", "Submitted"], ["03", "Coordinator checked"], ["04", "Course Head decision"], ["05", "Closed"]].map((item, index) => <span className={index < 2 ? "done" : index === 2 ? "current" : ""} key={item[0]}><i>{index < 2 ? <Icon name="check" /> : item[0]}</i><b>{item[1]}</b></span>)}</div></article><article className="panel recommendation-table"><div className="recommendation-head"><b>Learner / team</b><b>Evidence scope</b><b>Mentor judgement</b><b>Level {cycle.level} position</b><b>Status</b><b /></div>{recommendations.map((item) => <button key={item[0]} onClick={() => notify(`${item[0]} recommendation opened`)}><span><b>{item[0]}</b><small>Level {cycle.level}</small></span><span>{item[1]}</span><span>{item[2]}</span><span>{item[3]}</span><i className={`status ${item[4].toLowerCase()}`}>{item[4]}</i><strong>Open <Icon name="arrow" /></strong></button>)}</article><article className="panel recommendation-checks"><PanelHeading label="REQUIRED BEFORE SUBMISSION" title="Recommendation quality controls" meta="5 checks" /><div>{["Criterion rating is supported by named evidence", "Student acknowledgement is visible", "Revision history and unresolved gaps are visible", "Academic and gamification records remain separate", `Rationale identifies the required action from ${allocation.coordinator} or the Course Head`].map((item) => <label key={item}><input type="checkbox" />{item}</label>)}</div></article></>;
}

function MentorCalendar({ cycle, mentorKind, notify }: { cycle: Cycle; mentorKind: MentorKind; notify: (message: string) => void }) {
  const allocation = mentorAllocation(cycle, mentorKind);
  if (!allocation.active) return <><PageHeader eyebrow={`MENTOR CALENDAR · ${cycle.id}`} title="Reviews and mentoring checkpoints" description="No standing allocation is scheduled for this Learning Cycle." /><MentorNoAllocation cycle={cycle} notify={notify} /></>;
  const agenda = mentorKind === "domain"
    ? [["04 SEP · 14:30", "Anakha Rajesh · DS-907 review", "QA evidence review"], ["05 SEP · 10:00", "Alfin · API test clinic", "Specialist checkpoint"], ["06 SEP · 15:00", "Annamma · quality-gate rehearsal", "Readiness review"], ["14 SEP · 11:30", "DS-904 faculty review", "Official checkpoint"], ["16 SEP · 10:30", "Full-stack live demonstration", `Panel · ${allocation.coordinator} and Ajitha V S`], ["18 SEP · 12:00", "CI/CD test-evidence calibration", "QA track review"]]
    : [["04 SEP · 09:30", "Team Northstar · blocker review", "Team checkpoint"], ["05 SEP · 11:00", "Alfin · API contract follow-up", "Mentoring checkpoint"], ["06 SEP · 14:00", "Dhanush Girish · onboarding", "Allocation checkpoint"], ["14 SEP · 11:30", "DS-904 faculty review", "Official checkpoint"], ["16 SEP · 10:30", "Full-stack live demonstration", `Panel · ${allocation.coordinator} and mentor team`], ["18 SEP · 15:00", "Sprint retrospective", "Team learning review"]];
  return <><PageHeader eyebrow={`MENTOR CALENDAR · ${cycle.id}`} title="Reviews, mentoring checkpoints and demonstrations" description="Plan assigned mentoring work around faculty-controlled academic dates. Calendar activity is not attendance." action="Add mentor checkpoint" onAction={() => notify("Mentor checkpoint editor opened")} /><div className="mentor-calendar-layout"><article className="panel mentor-agenda"><PanelHeading label="UPCOMING COMMITMENTS" title={`Level ${cycle.level} mentor schedule`} meta={mentorProfiles[mentorKind].name} /><div>{agenda.map((item, index) => <button key={item[0]} onClick={() => notify(`${item[1]} opened`)}><time>{item[0]}</time><i className={index > 2 ? "official" : "mentor"}>{index > 2 ? <Icon name="shield" /> : <Icon name="message" />}</i><span><b>{item[1]}</b><small>{item[2]}</small></span><Icon name="arrow" /></button>)}</div></article><aside className="side-stack"><article className="panel calendar-load"><PanelHeading label="WEEKLY REVIEW LOAD" title="Capacity view" meta="04–10 Sep" /><div>{[["Thu", 3], ["Fri", 4], ["Sat", 2], ["Sun", 0], ["Mon", 3]].map((item) => <span key={String(item[0])}><b>{item[0]}</b><i><em style={{ height: `${Number(item[1]) * 18}%` }} /></i><small>{item[1]}</small></span>)}</div></article><article className="panel mentor-boundary"><Icon name="shield" /><div><b>Capacity and authority are explicit</b><p>Planned mentoring load is separate from attendance. Only the Course Head can change official academic deadlines.</p></div></article></aside></div></>;
}

function FacultyWorkspace({ page, cycle, notify }: { page: string; cycle: Cycle; notify: (message: string) => void }) {
  if (page === "Course Details") return <CourseDetails notify={notify} />;
  if (page === "Programme Workflow") return <ProgrammeWorkflow notify={notify} />;
  if (page === "Course Coordination") return <CourseCoordination notify={notify} />;
  if (page === "Learning Cycle Planning") return <CyclePlanning cycle={cycle} notify={notify} />;
  if (page === "Assignment Management") return <AssignmentStudio notify={notify} />;
  if (page === "Student Monitor") return <CohortMonitor notify={notify} />;
  if (page === "Activity Review") return <ReviewQueue notify={notify} />;
  if (page === "Academic Evaluation") return <EvaluationPage notify={notify} />;
  if (page === "Reports & Analytics") return <AnalyticsPage />;
  return <FacultyOverview cycle={cycle} notify={notify} />;
}

function FacultyOverview({ cycle, notify }: { cycle: Cycle; notify: (message: string) => void }) {
  return <><PageHeader eyebrow="COURSE HEAD ACADEMIC WORKSPACE" title="Good afternoon, Dr. Ajith Kumar" description="Govern Level 9 delivery, mentor allocation, academic decisions and final publication across the full-stack learning cycle." action="Open review queue" onAction={() => notify("Review queue opened")} /><section className="faculty-brief"><div><span className="eyebrow">SELECTED LEARNING CYCLE</span><h2>{cycle.id} · {cycle.title}</h2><p>{cycle.semester} · Official Level {cycle.level} · {cycle.weeks}</p></div><div className="faculty-team"><span className="avatar-group"><i>KK</i><i>PL</i><i>AV</i></span><span><small>COORDINATION TEAM</small><b>4 mapped members</b></span></div><div><small>CURRENT REVIEW WINDOW</small><b>Sprint 04 · Verify</b><span>Closes 16 September</span></div></section><div className="metric-grid"><Metric icon="users" label="Active learners" value="5" meta="Approved prototype cohort" trend="4 allocated · 1 pending" tone="cyan" /><Metric icon="review" label="Awaiting review" value="5" meta="Two high priority" trend="1 resubmitted" tone="indigo" /><Metric icon="alert" label="Quality gaps" value="3" meta="Across three learners" trend="2 demonstration blockers" tone="violet" /><Metric icon="check" label="Demo ready" value="1" meta="All evidence inputs available" trend="Faculty approval pending" tone="gold" /></div><div className="primary-grid"><article className="panel decision-list"><PanelHeading label="ACADEMIC ACTION CENTRE" title="Decisions requiring faculty judgement" meta="5 open" />{[["High", "Team Northstar", "Review integration pull request", "Code and evidence review", "8 min"], ["High", "Anakha Rajesh", "Resolve end-to-end quality gap", "QA support", "10 min"], ["Medium", "Team Orion", "Approve live demonstration readiness", "Progression review", "12 min"], ["Standard", "Dhanush Girish", "Verify local deployment runbook", "Academic review", "6 min"]].map((x, i) => <button key={x[1]} onClick={() => notify(`${x[2]} opened`)}><i className={`priority p${i}`}>{x[0]}</i><span className="avatar">{x[1].slice(0, 2).toUpperCase()}</span><span><b>{x[2]}</b><small>{x[1]} · {x[3]}</small></span><em>{x[4]}</em><Icon name="arrow" /></button>)}</article><aside className="side-stack"><article className="panel cohort-pulse"><PanelHeading label="COHORT PULSE" title="Integration readiness" meta="Live view" /><div className="donut"><div><b>40%</b><span>on track</span></div></div><div className="legend"><span><i />On track <b>2</b></span><span><i />Watch <b>1</b></span><span><i />Rework <b>2</b></span></div></article><article className="panel boundary-card"><Icon name="shield" /><div><b>Learning work, not surveillance</b><p>Monitoring is based on deliverables, test evidence and academic decisions. Attendance and time spent remain outside MSDSP.</p></div></article></aside></div><article className="panel workflow-panel"><PanelHeading label="LEARNING CYCLE GOVERNANCE" title="Traceable academic workflow" meta="Sprint 04 of 05" /><div className="faculty-workflow">{[["01", "Plan", "Integration scope"], ["02", "Assign", "Professional artifacts"], ["03", "Monitor", "Quality signals"], ["04", "Review", "Technical judgement"], ["05", "Evaluate", "Official result"], ["06", "Report", "Cycle insight"]].map((x, i) => <button key={x[0]} className={i < 3 ? "done" : i === 3 ? "current" : ""} onClick={() => notify(`${x[1]} workspace opened`)}><i>{i < 3 ? <Icon name="check" /> : x[0]}</i><span><b>{x[1]}</b><small>{x[2]}</small></span></button>)}</div></article></>;
}

function CyclePlanning({ cycle, notify }: { cycle: Cycle; notify: (message: string) => void }) {
  const rows = [["API contract and client adapter", "Krishnasree K · Prasanth Lal S N", 5, 26, 100, "Complete"], ["PostgreSQL integration", "Krishnasree K · Sridas D", 19, 34, 82, "Active"], ["End-to-end quality gates", "Ajitha V S", 43, 30, 58, "Active"], ["Full-stack live demonstration", "Level 9 mentor panel", 68, 19, 15, "Upcoming"], ["Level gate evaluation", "Academic faculty", 84, 13, 0, "Upcoming"]] as const;
  return <><PageHeader eyebrow="LEARNING CYCLE PLANNING" title={`${cycle.id} · ${cycle.title}`} description="Coordinate integration work, quality gates, dependencies, ownership and the live demonstration review window." action="Add academic work" onAction={() => notify("Planning item opened")} /><div className="planning-controls"><div><button className="active">Timeline</button><button>Schedule</button></div><label>Ownership<select><option>All coordinators</option><option>Krishnasree K</option><option>Prasanth Lal S N</option><option>Ajitha V S</option></select></label><button className="save-button" onClick={() => notify("Cycle plan saved")}>Save plan</button></div><article className="panel gantt"><div className="gantt-head"><b>Academic work & ownership</b>{["01 Sep", "05 Sep", "09 Sep", "13 Sep", "17 Sep", "21 Sep"].map((date) => <span key={date}>{date}</span>)}<i>Status</i></div>{rows.map((row, i) => <div className="gantt-row" key={row[0]}><span><b>{row[0]}</b><small>{row[1]}</small></span><div><i className={`bar b${i}`} style={{ left: `${row[2]}%`, width: `${row[3]}%` }}><em style={{ width: `${row[4]}%` }} /></i></div><button onClick={() => notify(`${row[0]} opened`)}>{row[5]}</button></div>)}</article><div className="planning-grid"><article className="panel"><PanelHeading label="SPRINT ARCHITECTURE" title="Five connected full-stack sprints" meta={cycle.weeks} /><div className="compact-sprints">{sprintData.map((x, i) => <span key={x.no} className={i < 3 ? "done" : i === 3 ? "active" : ""}><b>{x.no} · {x.name}</b><small>{x.detail}</small></span>)}</div></article><article className="panel mapping-card"><PanelHeading label="ACADEMIC MAPPING" title="Courses, units and outcomes" meta="Level 9" /><dl><div><dt>CS102</dt><dd>Full Stack Architecture & Cloud-Native Development</dd><span>PO2 · PSO1</span></div><div><dt>CS103</dt><dd>Modern Backend Systems & Data Engineering</dd><span>PO3</span></div><div><dt>CS104</dt><dd>API Design & Microservices Orchestration</dd><span>PO3 · PSO2</span></div><div><dt>CS105</dt><dd>DevOps & Automated Pipelines</dd><span>PO4 · PSO4</span></div></dl></article></div></>;
}

function AssignmentStudio({ notify }: { notify: (message: string) => void }) {
  return <><PageHeader eyebrow="ASSIGNMENT MANAGEMENT · AUTHENTIC ASSESSMENT" title="Design an outcome-mapped full-stack assignment" description="Connect academic intent to an authentic engineering brief, constraints, dependencies, professional artifacts and transparent review criteria." action="Create assignment" onAction={() => notify("New assignment opened")} /><article className="panel assignment-form"><div className="form-intro"><span>DS-904</span><div><h2>Full-stack integration and test readiness</h2><p>Draft assignment · Level 9 Full Stack Integration & Testing</p></div><i className="status upcoming">Draft</i></div><div className="form-grid"><label className="wide">Client brief and engineering decision<textarea defaultValue="Integrate the student-facing product journey with versioned backend services and PostgreSQL persistence. Demonstrate authenticated CRUD workflows, failure recovery, automated quality gates and a reproducible local environment." /></label><label>Project role<select><option>Full-Stack Engineer</option><option>Backend Engineer</option><option>Quality Engineer</option></select></label><label>Collaboration mode<select><option>Cross-functional team assignment</option><option>Individual assignment</option></select></label><label>Advanced cognitive focus<select><option>Analyze → Evaluate → Create</option><option>Evaluate → Create</option></select></label><label>Experiential stage<select><option>Active Experimentation</option><option>Concrete Experience</option></select></label><label>Mapped outcomes<input defaultValue="PO2, PO3, PO4, PO8, PSO1, PSO4" /></label><label>Assessment component<select><option>Live Project Work · 50%</option><option>Product Milestones · 20%</option></select></label><label className="wide">Required professional evidence<input defaultValue="OpenAPI specification, reviewed pull request, PostgreSQL migrations, automated API and E2E reports, local deployment runbook" /></label><label className="wide">Constraints and dependencies<input defaultValue="DUK@360 SSO boundary, RBAC, secrets, accessibility, API versioning, transactional integrity and rollback" /></label></div><div className="industry-rubric compact"><div><span>NEEDS REVISION</span><p>Integration is unreliable, contracts are inconsistent, quality evidence is incomplete or the solution cannot be reproduced.</p></div><div className="standard"><span>MEETS INDUSTRY STANDARD</span><p>Priority workflows operate reliably, tests verify expected and failure paths, and documentation supports independent setup.</p></div><div className="exceeds"><span>EXCEEDS EXPECTATIONS</span><p>Demonstrates resilient integration, observability, secure boundaries and evidence-led technical judgement beyond the brief.</p></div></div><div className="rubric-preview"><div><small>INTEGRATION</small><b>Frontend–backend integration</b><span>25%</span></div><div><small>QUALITY</small><b>End-to-end test suite</b><span>20%</span></div><div><small>CERTIFICATION</small><b>AWS SAA-C03</b><span>20%</span></div><div><small>DEMONSTRATION</small><b>Full-stack live demo</b><span>20%</span></div><div><small>PRACTICE</small><b>Code review & documentation</b><span>15%</span></div></div><div className="button-row"><button onClick={() => notify("Draft saved")}>Save draft</button><button className="primary-button" onClick={() => notify("Assignment published")}>Publish assignment <Icon name="arrow" /></button></div></article></>;
}

function CohortMonitor({ notify }: { notify: (message: string) => void }) {
  const people = [["Alfin", "Individual", 62, 9, "Intervention"], ["Anakha Rajesh", "Team Northstar", 84, 12, "On track"], ["Annamma", "Team Orion", 91, 14, "On track"], ["Annrosna", "Team Vector", 70, 10, "Watch"], ["Dhanush Girish", "Team allocation pending", 0, 0, "Allocation pending"]];
  return <><PageHeader eyebrow="COHORT MONITOR" title="Evidence-based learning signals" description="Identify academic support needs from work quality, evidence coverage and review history—not attendance or online activity." /><div className="monitor-grid">{people.map((x) => <article className="panel learner-card" key={String(x[0])}><div><span className="avatar">{String(x[0]).slice(0, 2).toUpperCase()}</span><i className={`status ${String(x[4]).toLowerCase().replace(" ", "-")}`}>{x[4]}</i></div><h3>{x[0]}</h3><p>{x[1]}</p><div className="learner-metrics"><span>Evidence<b>{x[2]}%</b></span><span>Outcomes<b>{x[3]}/16</b></span></div><div className="mini-progress"><i style={{ width: `${x[2]}%` }} /></div><button onClick={() => notify(`${x[0]} academic record opened`)}>Inspect academic record <Icon name="arrow" /></button></article>)}</div></>;
}

function ReviewQueue({ notify }: { notify: (message: string) => void }) {
  const rows = [["High", "Anakha Rajesh", "Playwright failure trace", "DS-907", "Resubmitted", "4 Sep"], ["High", "Alfin", "Full-stack integration pull request", "DS-904", "New", "4 Sep"], ["Medium", "Annamma", "OpenAPI and Postman contract pack", "DS-905", "New", "5 Sep"], ["Standard", "Annrosna", "Local deployment runbook", "DS-904", "New", "6 Sep"], ["Standard", "Dhanush Girish", "Initial evidence baseline", "Allocation", "Pending", "TBC"]];
  return <><PageHeader eyebrow="ACADEMIC REVIEW QUEUE" title="Evidence awaiting judgement" description="Review evidence against the assignment purpose, rubric and mapped outcomes. Submission time establishes chronology only." /><FilterBar placeholder="Search learner or evidence" /><article className="panel review-table"><div className="review-head"><span>Priority</span><span>Learner & evidence</span><span>Assignment</span><span>Submission</span><span>Due</span><span /></div>{rows.map((x, i) => <button key={x[1]} onClick={() => notify(`${x[2]} review opened`)}><i className={`priority p${Math.min(i, 3)}`}>{x[0]}</i><span><b>{x[2]}</b><small>{x[1]}</small></span><span>{x[3]}</span><span><i className="status upcoming">{x[4]}</i></span><span>{x[5]}</span><strong>Review <Icon name="arrow" /></strong></button>)}</article></>;
}

function EvaluationPage({ notify }: { notify: (message: string) => void }) {
  return <><PageHeader eyebrow="ACADEMIC EVALUATION · EVIDENCE BASED" title="Record a transparent academic judgement" description="Evaluate full-stack project evidence against explicit criteria. Academic marks, provisional gamification points and AWS certification status remain separate." action="Publish evaluation" onAction={() => notify("Publication confirmation opened")} /><div className="evaluation-grid"><article className="panel evaluation-form"><PanelHeading label="SELECTED LEARNER · ASSIGNMENT DS-904" title="Anakha Rajesh · Full-stack integration and test readiness" meta="18 ready evidence items" />{academicComponents.map(([name, score, weight]) => <label className="score-input" key={name}><span><b>{name}</b><small>Course Plan weight · {weight}%</small></span><input type="number" defaultValue={score} min="0" max="100" /><em>{(score * weight / 100).toFixed(1)} contribution</em></label>)}</article><aside className="panel evaluation-summary"><span className="eyebrow">ACADEMIC RESULT · CURRENT VIEW</span><div><b>82.4%</b><i>Ready for review</i></div><dl><div><dt>Cognitive evidence</dt><dd>Analyze · Evaluate · Create</dd></div><div><dt>Evidence ready</dt><dd>18 of 22</dd></div><div><dt>Gamification points</dt><dd>780 · provisional</dd></div><div><dt>Revision gaps</dt><dd>2 quality gates</dd></div></dl><label>Academic rationale<textarea placeholder="Explain the evidence, judgement and any required revision" /></label><button className="primary-button" onClick={() => notify("Evaluation draft saved")}>Save evaluation draft</button><p><Icon name="shield" /> Attendance, login activity, certification and gamification are excluded from this mark.</p></aside></div><article className="panel rubric-matrix"><PanelHeading label="EVIDENCE RUBRIC" title="Observable full-stack performance descriptors" meta="Applied to each criterion" /><div className="industry-rubric"><div><span>NEEDS REVISION</span><b>Unreliable or unverifiable integration</b><p>Contracts, failure handling, test evidence or setup instructions are incomplete.</p></div><div className="standard"><span>MEETS INDUSTRY STANDARD</span><b>Reliable, testable and reproducible</b><p>Priority workflows and failure paths are verified, traceable and suitable for project use.</p></div><div className="exceeds"><span>EXCEEDS EXPECTATIONS</span><b>Resilient professional engineering</b><p>Integrates observability, secure boundaries and evidence-led optimisation into a transferable solution.</p></div></div></article></>;
}

function AnalyticsPage() {
  return <><PageHeader eyebrow="LEARNING CYCLE ANALYTICS" title="Cohort integration evidence and academic progression" description="Use aggregate insight to strengthen full-stack delivery, quality support and evaluation readiness." /><div className="analytics-grid"><article className="panel chart-card"><PanelHeading label="ACADEMIC TREND" title="Cohort mean across Semester II Levels" meta="Current mean · 82%" /><div className="chart-bars">{[["LC-06", 71], ["LC-07", 75], ["LC-08", 79], ["LC-09", 82], ["LC-10", 0]].map(([label, value], i) => <span key={String(label)} className={i === 4 ? "forecast" : ""}><i style={{ height: `${value || 52}%` }}><b>{value || "—"}</b></i><small>{label}</small></span>)}</div></article><article className="panel insight-card"><PanelHeading label="CYCLE INSIGHT" title="Where faculty attention matters" meta="LC-09" /><div><span><i className="cyan" /><p><b>82% integration evidence ready</b>Most teams can demonstrate their primary full-stack workflow.</p></span><span><i className="violet" /><p><b>Failure recovery is the weakest quality signal</b>Transactional rollback and token refresh have the highest evidence gaps.</p></span><span><i className="gold" /><p><b>Four learners require targeted rework</b>Support is triggered by test failures and review history.</p></span></div></article></div><div className="analytics-stats"><Metric icon="file" label="Integration coverage" value="82%" meta="Cohort-wide" trend="+7% vs LC-08" tone="cyan" /><Metric icon="target" label="Outcome coverage" value="79%" meta="PO2, PO3, PO4, PO8" trend="PO4 below target" tone="violet" /><Metric icon="check" label="Demo ready" value="11" meta="Learners with all gates" trend="3 fully approved" tone="gold" /><Metric icon="users" label="Rework plans" value="4" meta="Active interventions" trend="QA mentor assigned" tone="indigo" /></div></>;
}
