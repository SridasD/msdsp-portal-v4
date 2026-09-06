export type CycleStatus = "Active" | "Upcoming" | "Completed";
export type Role = "student" | "courseHead" | "mentor";
export type MentorKind = "domain" | "team";
export type Theme = "light" | "dark" | "system";

export type Cycle = {
  id: string;
  semester: string;
  level: number;
  title: string;
  weeks: string;
  status: CycleStatus;
  progress: number;
};

export const cycles: Cycle[] = [
  { id: "LC-08", semester: "Semester II", level: 8, title: "Electives, APIs & Certification", weeks: "Weeks 37–41", status: "Completed", progress: 100 },
  { id: "LC-09", semester: "Semester II", level: 9, title: "Full Stack Integration & Testing", weeks: "Weeks 42–46", status: "Active", progress: 72 },
  { id: "LC-10", semester: "Semester II", level: 10, title: "Local Deploy & Semester II Evaluation", weeks: "Weeks 47–52", status: "Upcoming", progress: 0 },
];

export const academicComponents = [
  ["Live Project Work", 84, 50],
  ["Product Milestones", 78, 20],
  ["Documentation & Process", 88, 10],
  ["Continuous Evaluation", 81, 10],
  ["Theory Examination", 76, 10],
] as const;

export const prototypeCohort = ["Alfin", "Anakha Rajesh", "Annamma", "Annrosna", "Dhanush Girish"] as const;

export const workspaceNavigation = {
  student: ["Overview", "Work Board", "Evidence & Portfolio", "Skills & Outcomes", "Faculty Feedback", "Calendar", "Performance & Results", "Information Centre"],
  courseHead: ["Overview", "Course Details", "Programme Workflow", "Course Coordination", "Learning Cycle Planning", "Assignment Management", "Student Monitor", "Activity Review", "Academic Evaluation", "Reports & Analytics"],
  mentor: ["Overview", "My Allocations", "Learners & Teams", "Sprint Workspace", "Evidence Review", "Mentoring Records", "Competency & Calibration", "Escalations", "Recommendation Tracker", "Calendar", "Course Details"],
} as const;

export const workspaceIcons: Record<string, string> = {
  Overview: "grid",
  "Course Details": "book",
  "Programme Workflow": "network",
  "Course Coordination": "network",
  "Work Board": "brief",
  "Evidence & Portfolio": "file",
  "Skills & Outcomes": "target",
  "Faculty Feedback": "message",
  Calendar: "calendar",
  "Information Centre": "book",
  "Performance & Results": "chart",
  "Learning Cycle Planning": "calendar",
  "Assignment Management": "brief",
  "Student Monitor": "users",
  "Activity Review": "review",
  "Academic Evaluation": "chart",
  "Reports & Analytics": "report",
  "My Allocations": "layers",
  "Learners & Teams": "users",
  "Sprint Workspace": "layers",
  "Evidence Review": "review",
  "Mentoring Records": "message",
  "Competency & Calibration": "target",
  Escalations: "shield",
  "Recommendation Tracker": "chart",
};

export const sprintData = [
  { no: "01", name: "Contract", detail: "OpenAPI contract and integration boundaries", state: "Completed" },
  { no: "02", name: "Connect", detail: "Frontend, backend and authentication flow", state: "Completed" },
  { no: "03", name: "Persist", detail: "PostgreSQL schema, validation and migrations", state: "Completed" },
  { no: "04", name: "Verify", detail: "API, integration and end-to-end quality gates", state: "In progress" },
  { no: "05", name: "Demonstrate", detail: "Live full-stack review and technical defence", state: "Next" },
] as const;

export const levelNinePoints = [
  { component: "Frontend–backend integration", evidence: "PR-42 · OpenAPI contract", awarded: 230, maximum: 250, status: "Verified" },
  { component: "End-to-end test suite", evidence: "Playwright report · revision open", awarded: 170, maximum: 200, status: "Revision" },
  { component: "AWS SAA-C03", evidence: "Certificate evidence · pending review", awarded: 160, maximum: 200, status: "Provisional" },
  { component: "Full-stack live demonstration", evidence: "Demonstration scheduled · 16 Sep", awarded: 120, maximum: 200, status: "Scheduled" },
  { component: "Code review & documentation", evidence: "Reviewed PR · local runbook", awarded: 100, maximum: 150, status: "Verified" },
] as const;

export const programmeRules = {
  creditTotal: {
    decisionId: "PR-004",
    displayValue: "80",
    status: "Open",
    label: "Proposed total",
  },
  academicAggregation: {
    decisionId: "PR-005",
    status: "Open",
  },
  gamificationMaximum: {
    decisionId: "PR-006",
    status: "Open",
  },
  progressionScore: {
    decisionId: "PR-007",
    status: "Open",
  },
} as const;
