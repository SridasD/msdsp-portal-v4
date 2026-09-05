export type CycleStatus = "Active" | "Upcoming" | "Completed";

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
