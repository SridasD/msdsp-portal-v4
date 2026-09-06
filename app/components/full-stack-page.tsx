"use client";

import { useMemo, useState } from "react";
import { Icon, Metric, PageHeader, PanelHeading } from "./portal-primitives";

interface FullStackPageProps {
  notify?: (message: string) => void;
  onNavigate?: (page: string, assignmentId?: string) => void;
  openEvidence?: (assignment?: string) => void;
  isFaculty?: boolean;
}

interface SubActivity {
  id: string;
  title: string;
  description: string;
  cognitiveLevel: "Analyze" | "Evaluate" | "Create";
  deliverable: string;
  status: "Completed" | "In progress" | "Revision" | "Upcoming";
  assignmentRef?: string;
  outcomes: string[];
}

interface Activity {
  id: string;
  title: string;
  sprint: string;
  sprintName: string;
  duration: string;
  course: string;
  courseCode: string;
  summary: string;
  subActivities: SubActivity[];
}

const activitiesData: Activity[] = [
  {
    id: "ACT-01",
    title: "System Blueprint & API Contract Design",
    sprint: "Sprint 01",
    sprintName: "Contract",
    duration: "Week 42",
    course: "Full Stack Architecture & Cloud-Native Development",
    courseCode: "CS102",
    summary: "Establish multi-tier architecture, system topology, OpenAPI 3.1 RESTful contracts, relational entity models, and token security boundaries.",
    subActivities: [
      {
        id: "SUB-1.1",
        title: "Multi-Tier System Blueprint & Component Topology",
        description: "Author Architecture Decision Record (ADR-04) and C4 component diagrams mapping frontend, backend, and PostgreSQL database boundaries.",
        cognitiveLevel: "Analyze",
        deliverable: "ADR-04 document & C4 component diagram",
        status: "Completed",
        assignmentRef: "DS-904",
        outcomes: ["PO2", "PSO1"],
      },
      {
        id: "SUB-1.2",
        title: "OpenAPI 3.1 RESTful Contract & Error Specification",
        description: "Formulate machine-readable REST API contracts specifying endpoints, query parameters, request bodies, and RFC 7807 problem details.",
        cognitiveLevel: "Create",
        deliverable: "openapi.yaml specification & Postman collection",
        status: "Completed",
        assignmentRef: "DS-905",
        outcomes: ["PO3", "PSO2"],
      },
      {
        id: "SUB-1.3",
        title: "Relational Data Schema & Entity-Relationship Modeling",
        description: "Design 3NF normalized schema, foreign key constraints, indexing strategies, and reproducible baseline seed fixtures.",
        cognitiveLevel: "Analyze",
        deliverable: "PostgreSQL ERD diagram & schema DDL",
        status: "Completed",
        assignmentRef: "DS-905",
        outcomes: ["PO3"],
      },
      {
        id: "SUB-1.4",
        title: "Security & Authentication Boundary Protocol",
        description: "Define OAuth2/JWT bearer flow, RBAC policies, token expiration windows, and secret rotation guidelines.",
        cognitiveLevel: "Evaluate",
        deliverable: "Security architecture blueprint & token specification",
        status: "Completed",
        assignmentRef: "DS-904",
        outcomes: ["PO2", "PO6"],
      },
    ],
  },
  {
    id: "ACT-02",
    title: "Frontend Engineering & Responsive Interface",
    sprint: "Sprint 02",
    sprintName: "Connect (Client)",
    duration: "Week 43",
    course: "Full Stack Architecture & Cloud-Native Development",
    courseCode: "CS102",
    summary: "Implement accessible Next.js / React component architecture, server/client state management, type-safe API clients, and responsive UI.",
    subActivities: [
      {
        id: "SUB-2.1",
        title: "App Shell, Navigation & Design Token System",
        description: "Build accessible application layout shells, dark/light theme tokens, responsive sidebar navigation, and reusable UI primitives.",
        cognitiveLevel: "Create",
        deliverable: "React component library & CSS design tokens",
        status: "Completed",
        assignmentRef: "DS-904",
        outcomes: ["PO2", "PO8"],
      },
      {
        id: "SUB-2.2",
        title: "State Management & React Server/Client Boundaries",
        description: "Manage server component streaming, optimistic client UI updates, and caching boundaries with TanStack Query / SWR.",
        cognitiveLevel: "Create",
        deliverable: "Server actions & client state controllers",
        status: "Completed",
        assignmentRef: "DS-904",
        outcomes: ["PO2"],
      },
      {
        id: "SUB-2.3",
        title: "Type-Safe API Client Integration & Form Validation",
        description: "Generate TypeScript types from OpenAPI schemas and integrate Zod-validated mutation forms with graceful error feedback.",
        cognitiveLevel: "Evaluate",
        deliverable: "Typed HTTP client adapter & Zod form validation",
        status: "Completed",
        assignmentRef: "DS-904",
        outcomes: ["PO2", "PO3"],
      },
      {
        id: "SUB-2.4",
        title: "Accessibility (WCAG 2.1 AA) & Keyboard Navigation",
        description: "Audit and implement skip links, ARIA landmark roles, accessible color contrast, and complete keyboard navigation traps.",
        cognitiveLevel: "Evaluate",
        deliverable: "Axe accessibility audit report & ARIA compliance proof",
        status: "Completed",
        assignmentRef: "DS-904",
        outcomes: ["PO8"],
      },
    ],
  },
  {
    id: "ACT-03",
    title: "Backend Services & Business Logic Implementation",
    sprint: "Sprint 02",
    sprintName: "Connect (Server)",
    duration: "Week 43",
    course: "Modern Backend Systems & Data Engineering",
    courseCode: "CS103",
    summary: "Construct modular REST API routes, domain services, JWT auth guard middleware, and structured observability logging.",
    subActivities: [
      {
        id: "SUB-3.1",
        title: "RESTful Controller & Route Handler Layer",
        description: "Implement versioned route controllers (`/api/v1/...`) strictly complying with OpenAPI request/response schema specifications.",
        cognitiveLevel: "Create",
        deliverable: "Controller code & HTTP route modules",
        status: "Completed",
        assignmentRef: "DS-905",
        outcomes: ["PO3", "PSO2"],
      },
      {
        id: "SUB-3.2",
        title: "Service Layer & Domain Business Validation",
        description: "Encapsulate business rules, domain invariants, idempotent processing, and decoupled data transfer objects (DTOs).",
        cognitiveLevel: "Create",
        deliverable: "Domain service classes & business validation suites",
        status: "Completed",
        assignmentRef: "DS-905",
        outcomes: ["PO3"],
      },
      {
        id: "SUB-3.3",
        title: "Authentication Middleware & RBAC Permission Guards",
        description: "Implement JWT verification middleware, token claims inspection, role authorization guards, and sliding token refresh.",
        cognitiveLevel: "Evaluate",
        deliverable: "Auth middleware & role guard interceptors",
        status: "In progress",
        assignmentRef: "DS-907",
        outcomes: ["PO2", "PO6"],
      },
      {
        id: "SUB-3.4",
        title: "Structured Logging, Correlation IDs & Tracing",
        description: "Inject UUID correlation IDs across client-server hops with structured JSON logging and centralized error formatting.",
        cognitiveLevel: "Analyze",
        deliverable: "Structured logger & global error middleware",
        status: "Completed",
        assignmentRef: "DS-904",
        outcomes: ["PO4", "PO8"],
      },
    ],
  },
  {
    id: "ACT-04",
    title: "Data Layer Persistence & Transaction Resilience",
    sprint: "Sprint 03",
    sprintName: "Persist",
    duration: "Week 44",
    course: "Modern Backend Systems & Data Engineering",
    courseCode: "CS103",
    summary: "Manage PostgreSQL schema migrations, connection pooling, ACID transaction isolation, rollback proof, and Redis caching.",
    subActivities: [
      {
        id: "SUB-4.1",
        title: "Database Migration Pipeline & Seed Fixtures",
        description: "Author Drizzle/Flyway versioned migrations and automated rollback scripts with deterministic test seed datasets.",
        cognitiveLevel: "Create",
        deliverable: "Migration scripts (up/down) & seed script",
        status: "Completed",
        assignmentRef: "DS-905",
        outcomes: ["PO3", "PSO1"],
      },
      {
        id: "SUB-4.2",
        title: "Query Optimization, Indexing & Connection Pooling",
        description: "Tune queries using EXPLAIN ANALYZE, build composite B-tree indexes, and configure PgBouncer connection pool limits.",
        cognitiveLevel: "Analyze",
        deliverable: "Query performance benchmark & index migration",
        status: "Completed",
        assignmentRef: "DS-904",
        outcomes: ["PO3", "PO7"],
      },
      {
        id: "SUB-4.3",
        title: "ACID Transaction Isolation & Rollback Verification",
        description: "Implement multi-table atomic transactions ensuring zero orphaned records upon failure; capture rollback evidence.",
        cognitiveLevel: "Evaluate",
        deliverable: "Transaction rollback proof & idempotency tests",
        status: "In progress",
        assignmentRef: "DS-907",
        outcomes: ["PO3", "PSO1"],
      },
      {
        id: "SUB-4.4",
        title: "Cache Layer & Invalidation Strategies",
        description: "Implement Redis cache-aside pattern for heavy dashboard aggregations with stale-while-revalidate invalidation.",
        cognitiveLevel: "Analyze",
        deliverable: "Redis caching service & cache hit ratio metrics",
        status: "Completed",
        assignmentRef: "DS-904",
        outcomes: ["PO3"],
      },
    ],
  },
  {
    id: "ACT-05",
    title: "Automated Testing, Quality Gates & Regression Verification",
    sprint: "Sprint 04",
    sprintName: "Verify",
    duration: "Week 45",
    course: "DevOps & Automated Pipelines",
    courseCode: "CS105",
    summary: "Execute unit and API integration suites, Playwright multi-browser automation, token refresh failure recovery, and CI/CD quality gates.",
    subActivities: [
      {
        id: "SUB-5.1",
        title: "Unit & API Contract Test Suites",
        description: "Implement comprehensive Vitest/Jest unit tests and supertest API integration suites testing happy and error paths.",
        cognitiveLevel: "Evaluate",
        deliverable: "Vitest test suite & 85%+ coverage report",
        status: "Completed",
        assignmentRef: "DS-905",
        outcomes: ["PO4", "PSO4"],
      },
      {
        id: "SUB-5.2",
        title: "Playwright End-to-End Browser Automation",
        description: "Automate user journeys across Chromium and Firefox testing full submission, filtering, and role-switching flows.",
        cognitiveLevel: "Create",
        deliverable: "Playwright test suite & HTML report artifact",
        status: "Revision",
        assignmentRef: "DS-907",
        outcomes: ["PO4", "PSO4"],
      },
      {
        id: "SUB-5.3",
        title: "Failure Recovery & Edge Case Testing",
        description: "Inject network dropouts, simulate expired auth tokens, and test transactional rollbacks capturing trace recordings.",
        cognitiveLevel: "Evaluate",
        deliverable: "Playwright failure/recovery traces (trace.zip)",
        status: "Revision",
        assignmentRef: "DS-907",
        outcomes: ["PO4", "PSO1"],
      },
      {
        id: "SUB-5.4",
        title: "CI/CD Pipeline Quality Gate Enforcement",
        description: "Configure GitHub Actions workflows enforcing linting, unit tests, and Playwright regressions prior to PR merging.",
        cognitiveLevel: "Analyze",
        deliverable: ".github/workflows/ci.yml & passing badge",
        status: "Completed",
        assignmentRef: "DS-904",
        outcomes: ["PO4"],
      },
    ],
  },
  {
    id: "ACT-06",
    title: "Containerization, Deployment & Live Demonstration",
    sprint: "Sprint 05",
    sprintName: "Demonstrate",
    duration: "Week 46",
    course: "DevOps & Automated Pipelines",
    courseCode: "CS105",
    summary: "Author multi-stage Dockerfiles, Docker Compose local orchestration, reproducible runbooks, and defend the solution in a faculty viva.",
    subActivities: [
      {
        id: "SUB-6.1",
        title: "Multi-Stage Dockerfile Optimization",
        description: "Build minimal Alpine-based container images with separate build and runtime stages, executing under non-root users.",
        cognitiveLevel: "Create",
        deliverable: "Production Dockerfile & security scan report",
        status: "Completed",
        assignmentRef: "DS-904",
        outcomes: ["PO4"],
      },
      {
        id: "SUB-6.2",
        title: "Multi-Container Local Orchestration",
        description: "Compose frontend, backend, PostgreSQL, and Redis with internal networking, persistent volumes, and health checks.",
        cognitiveLevel: "Create",
        deliverable: "docker-compose.yml & verified health endpoints",
        status: "Completed",
        assignmentRef: "DS-904",
        outcomes: ["PO2", "PO4"],
      },
      {
        id: "SUB-6.3",
        title: "Reproducible Production Runbook & Local Setup",
        description: "Author comprehensive markdown runbook documenting prerequisites, environment configurations, and disaster recovery.",
        cognitiveLevel: "Analyze",
        deliverable: "RUNBOOK.md & verified peer reproduction signoff",
        status: "Completed",
        assignmentRef: "DS-904",
        outcomes: ["PO8"],
      },
      {
        id: "SUB-6.4",
        title: "Live Technical Demonstration & Viva Defense",
        description: "Present the full-stack system live to faculty review panel, demonstrate failure recovery under injection, and defend architectural trade-offs.",
        cognitiveLevel: "Evaluate",
        deliverable: "Live demo recording, slide deck & faculty evaluation rubric",
        status: "Upcoming",
        assignmentRef: "DS-904",
        outcomes: ["PO8", "PSO1", "PSO4"],
      },
    ],
  },
];

const fullStackCourses = [
  {
    code: "CS102",
    title: "Full Stack Architecture & Cloud-Native Development",
    semester: "Semester I & II",
    credits: 4,
    lead: "Sridas D / Prasanth Lal S N",
    description: "Multi-tier architecture, client-side rendering with React/Next.js, API orchestration, state hydration, responsive web design, and accessibility.",
    skills: ["React 19 / Next.js", "TypeScript", "Tailwind CSS", "Architecture Decision Records", "WCAG 2.1 AA"],
    certifications: ["Meta Front-End Developer", "Google UX Design"],
    outcomes: ["PO2", "PO8", "PSO1"],
  },
  {
    code: "CS103",
    title: "Modern Backend Systems & Data Engineering",
    semester: "Semester II",
    credits: 4,
    lead: "Anoop Raj R V / Soorya S Kumar",
    description: "Relational database modeling, PostgreSQL schema design, Drizzle ORM, ACID transactional integrity, connection pooling, and Redis caching.",
    skills: ["PostgreSQL 16", "Drizzle ORM / Prisma", "ACID Transactions", "Redis Cache", "Database Migrations"],
    certifications: ["Docker Certified Associate", "MongoDB Associate Developer"],
    outcomes: ["PO3", "PSO1"],
  },
  {
    code: "CS104",
    title: "API Design & Microservices Orchestration",
    semester: "Semester II & III",
    credits: 4,
    lead: "Krishnasree K / Soorya S Kumar",
    description: "OpenAPI 3.1 contract-first design, RESTful standards, error payload formatting (RFC 7807), API gateways, service decomposition, and auth middleware.",
    skills: ["OpenAPI 3.1", "RESTful Architecture", "OAuth2 / JWT Bearer", "Postman Collections", "Rate Limiting"],
    certifications: ["Postman API Fundamentals Student Expert"],
    outcomes: ["PO3", "PSO2"],
  },
  {
    code: "CS105",
    title: "DevOps & Automated Pipelines",
    semester: "Semester II",
    credits: 4,
    lead: "Arun Nadh G / Ajitha V S",
    description: "Automated end-to-end browser testing with Playwright, continuous integration with GitHub Actions, containerization with Docker, and quality gates.",
    skills: ["Playwright E2E Automation", "GitHub Actions CI/CD", "Docker & Docker Compose", "Quality Gates", "Linux Systems"],
    certifications: ["AWS Certified Solutions Architect – Associate (SAA-C03)", "GitHub Actions"],
    outcomes: ["PO4", "PSO4"],
  },
];

const skillDomains = [
  {
    name: "Frontend UI & Interaction",
    badge: "Client Tier",
    skills: [
      { name: "React 19 & Next.js Server Components", level: "Advanced", po: "PO2" },
      { name: "TypeScript Type-Safety & Generics", level: "Advanced", po: "PO2" },
      { name: "CSS Variables & Tailwind Token Architecture", level: "Proficient", po: "PO2" },
      { name: "WCAG 2.1 AA Accessibility & Keyboard Nav", level: "Proficient", po: "PO8" },
      { name: "Client State & Optimistic UI Updates", level: "Proficient", po: "PO2" },
    ],
  },
  {
    name: "Backend & API Engineering",
    badge: "Service Tier",
    skills: [
      { name: "OpenAPI 3.1 Contract-First Architecture", level: "Advanced", po: "PO3" },
      { name: "Node.js / Express / Next.js API Routes", level: "Advanced", po: "PO3" },
      { name: "OAuth2.0, JWT Tokens & RBAC Security", level: "Advanced", po: "PO2" },
      { name: "RFC 7807 Standardized Error Contracts", level: "Proficient", po: "PO3" },
      { name: "Structured JSON Logging & Correlation IDs", level: "Proficient", po: "PO4" },
    ],
  },
  {
    name: "Data Systems & Persistence",
    badge: "Data Tier",
    skills: [
      { name: "PostgreSQL 16 Relational Modeling (3NF)", level: "Advanced", po: "PO3" },
      { name: "ACID Transaction Isolation & Rollback", level: "Mastery", po: "PSO1" },
      { name: "Automated Database Migrations & Seeding", level: "Advanced", po: "PO3" },
      { name: "Query Optimization & Index Tuning", level: "Proficient", po: "PO7" },
      { name: "Redis Cache-Aside Pattern & TTL Invalidation", level: "Proficient", po: "PO3" },
    ],
  },
  {
    name: "DevOps, QA & Test Automation",
    badge: "Quality Tier",
    skills: [
      { name: "Playwright E2E Multi-Browser Automation", level: "Advanced", po: "PO4" },
      { name: "Failure Injection & Trace Diagnostic Analysis", level: "Advanced", po: "PSO4" },
      { name: "GitHub Actions CI/CD Pipeline Automation", level: "Proficient", po: "PO4" },
      { name: "Docker Containerization & Multi-Stage Builds", level: "Proficient", po: "PO4" },
      { name: "Docker Compose Local Stack Orchestration", level: "Proficient", po: "PO2" },
    ],
  },
];

export function FullStackPage({ notify, onNavigate, openEvidence, isFaculty }: FullStackPageProps) {
  const [activeTab, setActiveTab] = useState<"activities" | "courses" | "skills">("activities");
  const [sprintFilter, setSprintFilter] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [expandedActivities, setExpandedActivities] = useState<Record<string, boolean>>({
    "ACT-01": false,
    "ACT-02": false,
    "ACT-03": false,
    "ACT-04": false,
    "ACT-05": true,
    "ACT-06": false,
  });

  const toggleActivity = (id: string) => {
    setExpandedActivities((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const expandAll = () => {
    const allExpanded = activitiesData.reduce((acc, a) => ({ ...acc, [a.id]: true }), {});
    setExpandedActivities(allExpanded);
  };

  const collapseAll = () => {
    const allCollapsed = activitiesData.reduce((acc, a) => ({ ...acc, [a.id]: false }), {});
    setExpandedActivities(allCollapsed);
  };

  // Filter activities
  const filteredActivities = useMemo(() => {
    return activitiesData.filter((act) => {
      if (sprintFilter !== "all" && act.sprint !== sprintFilter) return false;
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchesMain =
          act.title.toLowerCase().includes(q) ||
          act.summary.toLowerCase().includes(q) ||
          act.course.toLowerCase().includes(q) ||
          act.sprintName.toLowerCase().includes(q);
        const matchesSub = act.subActivities.some(
          (sub) =>
            sub.title.toLowerCase().includes(q) ||
            sub.description.toLowerCase().includes(q) ||
            sub.deliverable.toLowerCase().includes(q)
        );
        return matchesMain || matchesSub;
      }
      return true;
    });
  }, [sprintFilter, searchQuery]);

  const totalSubActivities = activitiesData.reduce((sum, a) => sum + a.subActivities.length, 0);
  const completedSubActivities = activitiesData.reduce(
    (sum, a) => sum + a.subActivities.filter((s) => s.status === "Completed").length,
    0
  );
  const inProgressSubActivities = activitiesData.reduce(
    (sum, a) => sum + a.subActivities.filter((s) => s.status === "In progress" || s.status === "Revision").length,
    0
  );

  return (
    <>
      <PageHeader
        eyebrow="CURRICULUM ARCHITECTURE · FULL STACK DEVELOPMENT"
        title="Full Stack Engineering: Activities, Courses & Skills"
        description="Comprehensive pedagogical breakdown of the Full Stack Development lifecycle in the MSDSP programme, organized into sequential engineering activities, mapped course modules, and verifiable competency outcomes."
        action={isFaculty ? "Export Course Blueprint" : "Open Evidence & Portfolio"}
        onAction={() => {
          if (isFaculty) {
            notify?.("Full Stack Course Blueprint exported to PDF/JSON");
          } else {
            onNavigate?.("Evidence & Portfolio");
          }
        }}
      />

      {/* Pedagogical Framing Banner */}
      <section className="panel fs-pedagogy-card">
        <div className="fs-pedagogy-grid">
          <div className="fs-pedagogy-main">
            <span className="eyebrow">MSDSP WORK-IMMERSIVE LEARNING MODEL</span>
            <h2>Practical-First Full Stack Progression</h2>
            <p>
              In Digital University Kerala&apos;s MSDSP programme, Full Stack Development is not taught through passive lectures or standalone tutorials.
              Instead, students engineer an authentic enterprise product across <strong>5 Weekly Sprints</strong> in <strong>Level 9 (LC-09)</strong>,
              advancing from architectural contract to live defense while demonstrating mastery across four connected core courses.
            </p>
            <div className="fs-pill-row">
              <span className="fs-tag"><Icon name="layers" /> Level 9 · LC-09 Active</span>
              <span className="fs-tag"><Icon name="book" /> CS102 · CS103 · CS104 · CS105</span>
              <span className="fs-tag"><Icon name="target" /> Bloom: Analyze → Evaluate → Create</span>
              <span className="fs-tag"><Icon name="shield" /> ABET/NBA: PO2, PO3, PO4, PO8, PSO1, PSO4</span>
            </div>
          </div>
          <div className="fs-pedagogy-stats">
            <div className="fs-stat-box">
              <b>{activitiesData.length}</b>
              <small>Core Activities</small>
            </div>
            <div className="fs-stat-box">
              <b>{totalSubActivities}</b>
              <small>Sub-Activities</small>
            </div>
            <div className="fs-stat-box accent">
              <b>{fullStackCourses.length}</b>
              <small>Mapped Courses</small>
            </div>
            <div className="fs-stat-box">
              <b>16+</b>
              <small>Verifiable Artifacts</small>
            </div>
          </div>
        </div>
      </section>

      {/* Top Metrics Row */}
      <div className="metric-grid">
        <Metric
          icon="layers"
          label="Activity Progress"
          value={`${Math.round((completedSubActivities / totalSubActivities) * 100)}%`}
          meta={`${completedSubActivities} of ${totalSubActivities} sub-activities complete`}
          trend={`${inProgressSubActivities} in active review`}
          tone="indigo"
        />
        <Metric
          icon="book"
          label="Core Full Stack Courses"
          value="4 Courses"
          meta="16 Credits total"
          trend="CS102, CS103, CS104, CS105"
          tone="cyan"
        />
        <Metric
          icon="target"
          label="Outcome Coverage"
          value="7 Competencies"
          meta="PO2, PO3, PO4, PO8, PSO1, PSO2, PSO4"
          trend="2 quality gates active"
          tone="violet"
        />
        <Metric
          icon="award"
          label="Mapped Certifications"
          value="5 Credentials"
          meta="AWS SAA, Meta FE, Docker, Postman"
          trend="Audited independently"
          tone="gold"
        />
      </div>

      {/* Navigation Tabs */}
      <div className="fs-tab-bar" role="tablist" aria-label="Full Stack Views">
        <button
          type="button"
          role="tab"
          aria-selected={activeTab === "activities"}
          className={`fs-tab-btn ${activeTab === "activities" ? "active" : ""}`}
          onClick={() => setActiveTab("activities")}
        >
          <Icon name="brief" /> Activities & Sub-Activities ({totalSubActivities})
        </button>
        <button
          type="button"
          role="tab"
          aria-selected={activeTab === "courses"}
          className={`fs-tab-btn ${activeTab === "courses" ? "active" : ""}`}
          onClick={() => setActiveTab("courses")}
        >
          <Icon name="book" /> Mapped Courses ({fullStackCourses.length})
        </button>
        <button
          type="button"
          role="tab"
          aria-selected={activeTab === "skills"}
          className={`fs-tab-btn ${activeTab === "skills" ? "active" : ""}`}
          onClick={() => setActiveTab("skills")}
        >
          <Icon name="target" /> Competencies & Skills Matrix
        </button>
      </div>

      {/* TAB 1: ACTIVITIES & SUB-ACTIVITIES */}
      {activeTab === "activities" && (
        <>
          {/* Controls and Filters */}
          <div className="fs-filter-strip">
            <div className="fs-sprint-filters">
              <span className="filter-label">SPRINT FILTER:</span>
              {[
                { id: "all", label: "All Sprints (6 Activities)" },
                { id: "Sprint 01", label: "01 · Contract" },
                { id: "Sprint 02", label: "02 · Connect" },
                { id: "Sprint 03", label: "03 · Persist" },
                { id: "Sprint 04", label: "04 · Verify (Current)" },
                { id: "Sprint 05", label: "05 · Demonstrate" },
              ].map((item) => (
                <button
                  type="button"
                  key={item.id}
                  className={`ev-filter-pill ${sprintFilter === item.id ? "active" : ""}`}
                  onClick={() => setSprintFilter(item.id)}
                >
                  {item.label}
                </button>
              ))}
            </div>

            <div className="fs-action-controls">
              <input
                type="search"
                className="fs-search-input"
                placeholder="Search activity, sub-task, or artifact…"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                aria-label="Search full stack activities"
              />
              <button type="button" className="secondary-btn small" onClick={expandAll}>
                Expand All
              </button>
              <button type="button" className="secondary-btn small" onClick={collapseAll}>
                Collapse All
              </button>
            </div>
          </div>

          {/* Activities List */}
          <div className="fs-activities-container">
            {filteredActivities.map((activity) => {
              const isExpanded = expandedActivities[activity.id] ?? false;
              const subCount = activity.subActivities.length;
              const completedCount = activity.subActivities.filter((s) => s.status === "Completed").length;

              return (
                <article className="panel fs-activity-card" key={activity.id}>
                  {/* Activity Header */}
                  <header className="fs-activity-header" onClick={() => toggleActivity(activity.id)}>
                    <div className="fs-header-left">
                      <span className="fs-act-num">{activity.id}</span>
                      <div>
                        <div className="fs-act-meta">
                          <span className="sprint-badge">{activity.sprint}: {activity.sprintName}</span>
                          <span className="course-tag">{activity.courseCode} · {activity.course}</span>
                          <span className="duration-tag">{activity.duration}</span>
                        </div>
                        <h2 className="fs-act-title">{activity.title}</h2>
                        <p className="fs-act-summary">{activity.summary}</p>
                      </div>
                    </div>

                    <div className="fs-header-right">
                      <div className="fs-progress-badge">
                        <span>{completedCount}/{subCount} Sub-tasks</span>
                        <div className="fs-mini-bar">
                          <i style={{ width: `${(completedCount / subCount) * 100}%` }} />
                        </div>
                      </div>
                      <button
                        type="button"
                        className={`fs-accordion-toggle ${isExpanded ? "expanded" : ""}`}
                        aria-label={isExpanded ? "Collapse activity" : "Expand activity"}
                        aria-expanded={isExpanded}
                      >
                        <Icon name="chevron" />
                      </button>
                    </div>
                  </header>

                  {/* Sub-Activities Body */}
                  {isExpanded && (
                    <div className="fs-subactivities-body">
                      <div className="fs-sub-header">
                        <span>SUB-ACTIVITY &amp; SCOPE</span>
                        <span>BLOOM COGNITIVE</span>
                        <span>MAPPED DELIVERABLE ARTIFACT</span>
                        <span>COMPETENCIES</span>
                        <span>STATUS &amp; ACTIONS</span>
                      </div>

                      <div className="fs-sub-list">
                        {activity.subActivities.map((sub) => (
                          <div className={`fs-sub-item ${sub.status.toLowerCase().replace(" ", "-")}`} key={sub.id}>
                            <div className="fs-sub-col-main">
                              <span className="sub-id-pill">{sub.id}</span>
                              <div>
                                <b>{sub.title}</b>
                                <p>{sub.description}</p>
                              </div>
                            </div>

                            <div className="fs-sub-col-bloom">
                              <span className={`bloom-pill ${sub.cognitiveLevel.toLowerCase()}`}>
                                {sub.cognitiveLevel}
                              </span>
                            </div>

                            <div className="fs-sub-col-deliverable">
                              <span className="deliverable-text">
                                <Icon name="file" /> {sub.deliverable}
                              </span>
                            </div>

                            <div className="fs-sub-col-outcomes">
                              {sub.outcomes.map((po) => (
                                <span className="po-badge" key={po}>{po}</span>
                              ))}
                            </div>

                            <div className="fs-sub-col-status">
                              <span className={`status ${sub.status.toLowerCase().replace(" ", "-")}`}>
                                {sub.status}
                              </span>
                              {sub.assignmentRef && onNavigate && (
                                <button
                                  type="button"
                                  className="fs-link-btn"
                                  onClick={() => onNavigate("Work Board", sub.assignmentRef)}
                                  title={`Open ${sub.assignmentRef} on Work Board`}
                                >
                                  {sub.assignmentRef} →
                                </button>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>

                      {/* Bridge Card within Activity */}
                      <footer className="fs-activity-footer">
                        <div className="fs-footer-text">
                          <Icon name="shield" />
                          <span>
                            Evidence from <strong>{activity.title}</strong> is reviewed under assignment{" "}
                            <strong>{activity.subActivities[0]?.assignmentRef ?? "DS-904"}</strong> by Faculty &amp; Mentors.
                          </span>
                        </div>
                        <div className="fs-footer-actions">
                          {openEvidence && (
                            <button
                              type="button"
                              className="secondary-btn small"
                              onClick={() => openEvidence(activity.subActivities[0]?.assignmentRef)}
                            >
                              <Icon name="upload" /> Upload Evidence
                            </button>
                          )}
                          {onNavigate && (
                            <button
                              type="button"
                              className="primary-button small"
                              onClick={() => onNavigate("Work Board", activity.subActivities[0]?.assignmentRef)}
                            >
                              Work Board Execution <Icon name="arrow" />
                            </button>
                          )}
                        </div>
                      </footer>
                    </div>
                  )}
                </article>
              );
            })}
          </div>
        </>
      )}

      {/* TAB 2: MAPPED COURSES */}
      {activeTab === "courses" && (
        <div className="fs-courses-grid">
          {fullStackCourses.map((course) => (
            <article className="panel fs-course-card" key={course.code}>
              <header className="fs-course-header">
                <div className="fs-course-badge">
                  <b>{course.code}</b>
                  <small>{course.credits} Credits</small>
                </div>
                <div>
                  <span className="eyebrow">{course.semester} · CORE DISCIPLINE</span>
                  <h3>{course.title}</h3>
                  <p className="fs-lead-meta">Faculty Lead: <strong>{course.lead}</strong></p>
                </div>
              </header>

              <p className="fs-course-desc">{course.description}</p>

              <div className="fs-course-section">
                <small className="fs-section-label">KEY FULL STACK SKILLS DEVELOPED</small>
                <div className="fs-skill-tags">
                  {course.skills.map((skill) => (
                    <span className="skill-chip" key={skill}>{skill}</span>
                  ))}
                </div>
              </div>

              <div className="fs-course-section">
                <small className="fs-section-label">INDUSTRY CERTIFICATION ALIGNMENT</small>
                <div className="fs-cert-list">
                  {course.certifications.map((cert) => (
                    <span className="cert-chip" key={cert}>
                      <Icon name="award" /> {cert}
                    </span>
                  ))}
                </div>
              </div>

              <footer className="fs-course-footer">
                <div>
                  <small>PROGRAMME OUTCOMES</small>
                  <div className="fs-po-list">
                    {course.outcomes.map((po) => (
                      <span className="po-badge" key={po}>{po}</span>
                    ))}
                  </div>
                </div>
                {onNavigate && (
                  <button
                    type="button"
                    className="calc-link-btn"
                    onClick={() => onNavigate("Course Details")}
                  >
                    View Official Syllabus →
                  </button>
                )}
              </footer>
            </article>
          ))}
        </div>
      )}

      {/* TAB 3: SKILLS MATRIX */}
      {activeTab === "skills" && (
        <div className="fs-skills-matrix-container">
          <div className="panel fs-skills-intro">
            <div className="fs-skills-intro-icon">
              <Icon name="target" />
            </div>
            <div>
              <span className="eyebrow">COMPETENCY FRAMEWORK · VERIFIABLE CAPABILITIES</span>
              <h2>Full Stack Engineering Competencies (PO2, PO3, PO4, PSO1, PSO4)</h2>
              <p>
                In accordance with ABET and NBA outcome-based accreditation standards, proficiency levels are awarded solely through reviewed code commits, passing Playwright reports, OpenAPI schemas, and live viva demonstrations—never through self-reported quizzes or attendance.
              </p>
            </div>
          </div>

          <div className="fs-skills-grid">
            {skillDomains.map((domain) => (
              <article className="panel fs-skill-domain-card" key={domain.name}>
                <header className="fs-domain-header">
                  <div>
                    <span className="domain-tier-badge">{domain.badge}</span>
                    <h3>{domain.name}</h3>
                  </div>
                  <Icon name="check" />
                </header>

                <div className="fs-skill-list">
                  {domain.skills.map((skill) => (
                    <div className="fs-skill-row" key={skill.name}>
                      <div>
                        <b>{skill.name}</b>
                        <small>Mapped Outcome: <span className="po-badge mini">{skill.po}</span></small>
                      </div>
                      <span className={`proficiency-pill ${skill.level.toLowerCase()}`}>
                        {skill.level}
                      </span>
                    </div>
                  ))}
                </div>
              </article>
            ))}
          </div>

          <article className="panel fs-matrix-bridge">
            <div>
              <span className="eyebrow">SEPARATE ACADEMIC &amp; COMPETENCY RECORDS</span>
              <h3>How Competency Transits to Degree Accreditation</h3>
              <p>
                When your pull requests, Playwright traces, and PostgreSQL schemas are verified by your faculty panel (Krishnasree K, Ajitha V S, and Sridas D), they are archived in your permanent <strong>Evidence &amp; Portfolio</strong> to defend in your Semester IV Viva Voce.
              </p>
            </div>
            {onNavigate && (
              <div className="fs-matrix-buttons">
                <button
                  type="button"
                  className="primary-button"
                  onClick={() => onNavigate("Skills & Outcomes")}
                >
                  Inspect Active Outcome Map →
                </button>
                <button
                  type="button"
                  className="secondary-btn"
                  onClick={() => onNavigate("Evidence & Portfolio")}
                >
                  View 18 Verified Artifacts
                </button>
              </div>
            )}
          </article>
        </div>
      )}
    </>
  );
}
