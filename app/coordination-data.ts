export type CoordinationLevel = {
  level: number;
  semester: number;
  title: string;
  lead: string;
  support: string;
  certification: string;
  gap?: boolean;
};

export type Coordinator = {
  name: string;
  designation: string;
  discipline: string;
  tier: "Coordination Committee" | "Domain Mentor Pod" | "Student-Team Mentor";
  role: string;
  course: string;
  levels: string;
  track: string;
};

export const semesterCoordination = [
  { semester: 1, label: "Semester I", focus: "Research, UX, frontend and architecture blueprint", leads: "Vyga V R · Abhi Krishnan R · Sridas D", support: "UI/UX pod · onboarding and student success" },
  { semester: 2, label: "Semester II", focus: "Backend, data, APIs, full-stack integration and testing", leads: "Soorya S Kumar · Krishnasree K · Anoop Raj R V", support: "Data, Cloud/DevOps, frontend and QA pods" },
  { semester: 3, label: "Semester III", focus: "Microservices, cloud, MLOps, security and hardening", leads: "Arun Nadh G · Anoop Raj R V · Nidheesh G", support: "Cloud/DevOps, Data and QA pods" },
  { semester: 4, label: "Semester IV", focus: "Final product, industry placement, evaluation and viva", leads: "Arun Kumar B. · Sridas D · evaluation panel", support: "Coordination committee, placement/HR and mobile mentor" },
];

export const levelCoordination: CoordinationLevel[] = [
  { level: 1, semester: 1, title: "Orientation & Foundations", lead: "Vyga V R", support: "Soorya Krishnan G · Smitha Surendran", certification: "Git & GitHub" },
  { level: 2, semester: 1, title: "AI & Architecture Deep Dive", lead: "Sridas D", support: "AI/ML SME required", certification: "—", gap: true },
  { level: 3, semester: 1, title: "Electives & Market Research", lead: "Vyga V R", support: "Abhi Krishnan R", certification: "Agile Scrum" },
  { level: 4, semester: 1, title: "Tech Stack, UX & Certification", lead: "Abhi Krishnan R", support: "Prasanth Lal S N · Arun Nadh G", certification: "AWS CLF · Google UX" },
  { level: 5, semester: 1, title: "Blueprint & Semester I Evaluation", lead: "Sridas D", support: "Abhi Krishnan R · Prasanth Lal S N · Bibin Babu", certification: "Meta Front-End" },
  { level: 6, semester: 2, title: "Backend Foundations & Data", lead: "Anoop Raj R V", support: "Soorya S Kumar · Nidheesh G", certification: "Docker" },
  { level: 7, semester: 2, title: "AI Model Training & DevOps", lead: "AI/ML SME required", support: "Anoop Raj R V · Arun Nadh G", certification: "MongoDB · TensorFlow", gap: true },
  { level: 8, semester: 2, title: "Electives, APIs & Certification", lead: "Soorya S Kumar", support: "Diju M · Ajitha V S", certification: "GitHub Actions · Postman" },
  { level: 9, semester: 2, title: "Full Stack Integration & Testing", lead: "Krishnasree K", support: "Sridas D · Prasanth Lal S N · Ajitha V S", certification: "AWS SAA" },
  { level: 10, semester: 2, title: "Local Deploy & Semester II Evaluation", lead: "Arun Nadh G", support: "Arun Kumar B.", certification: "—" },
  { level: 11, semester: 3, title: "API Design & Microservices", lead: "Soorya S Kumar", support: "Sridas D", certification: "—" },
  { level: 12, semester: 3, title: "Third-Party Integration & Certifications", lead: "Krishnasree K", support: "Arun Nadh G · Diju M", certification: "CKA · GCP ACE" },
  { level: 13, semester: 3, title: "Cloud Deployment & MLOps", lead: "Arun Nadh G", support: "Anoop Raj R V", certification: "Databricks MLOps" },
  { level: 14, semester: 3, title: "Security, Governance & Live Product", lead: "Arun Nadh G", support: "Nidheesh G · Security SME required", certification: "CEH", gap: true },
  { level: 15, semester: 3, title: "Product Hardening & Semester III Evaluation", lead: "Arun Nadh G", support: "Arun Kumar B. · Ajitha V S", certification: "AWS DevOps Pro" },
  { level: 16, semester: 4, title: "Final Project Scoping", lead: "Arun Kumar B.", support: "Vyga V R · Smitha Surendran", certification: "Azure AI-102" },
  { level: 17, semester: 4, title: "Product Build & Certification Sprint", lead: "Soorya Krishnan G", support: "Soorya S Kumar · Krishnasree K · Bibin Babu", certification: "Certified Scrum Master" },
  { level: 18, semester: 4, title: "Advanced Features & Expert Review", lead: "Sridas D", support: "AI/ML SME required · Diju M · Bibin Babu", certification: "AWS ML Specialty", gap: true },
  { level: 19, semester: 4, title: "Report & Industry Evaluation", lead: "Arun Kumar B.", support: "Vyga V R · Smitha Surendran", certification: "Google Professional DE" },
  { level: 20, semester: 4, title: "Final Viva & Convocation", lead: "Arun Kumar B.", support: "Sridas D · Arun Nadh G", certification: "CMMI Associate" },
];

export const coordinators: Coordinator[] = [
  { name: "Sridas D", designation: "Software Solution Architect", discipline: "Solution Architecture", tier: "Coordination Committee", role: "Programme Solution Architect / technical coordinator", course: "CS102 Architecture", levels: "L2 · L5 · L9 · L18", track: "Architecture reviews and blueprint sign-off" },
  { name: "Arun Kumar Balakrishnan", designation: "Senior Project Manager – Enterprise Systems", discipline: "Programme Governance", tier: "Coordination Committee", role: "Programme governance and industry-evaluation lead", course: "Capstone / Process", levels: "L16–L20", track: "CMMI Associate · documentation and process" },
  { name: "Soorya Krishnan G", designation: "Software Project Manager, CDIPD", discipline: "Agile / Sprint Cadence", tier: "Coordination Committee", role: "Agile and sprint-cadence coordinator", course: "Weekly sprints", levels: "All Levels · L17", track: "Agile Scrum · Certified Scrum Master" },
  { name: "Vyga V R", designation: "Senior Business Analyst", discipline: "Requirements / Research", tier: "Coordination Committee", role: "Requirements, market and user-research coordinator", course: "Research / Product", levels: "L1 · L3 · L4 · L16 · L19", track: "Market research and industry liaison" },
  { name: "Smitha Surendran", designation: "Manager – HR", discipline: "Programme Administration / Student Success", tier: "Coordination Committee", role: "Onboarding, placement and student-success coordinator", course: "Non-academic / Placement", levels: "L1 · L16–L20", track: "Student success · placement · cohort engagement" },
  { name: "Anoop Raj R V", designation: "Technical Lead – Database Systems", discipline: "Data / Database Engineering", tier: "Domain Mentor Pod", role: "Data and data-engineering coordinator", course: "CS103 Backend & Data", levels: "L6 · L7 · L13", track: "MongoDB · Google Professional DE" },
  { name: "Nidheesh G", designation: "Database Administrator", discipline: "Database Administration", tier: "Domain Mentor Pod", role: "Database and data-governance support", course: "CS103 / Governance", levels: "L6 · L14", track: "DB administration and data governance" },
  { name: "Arun Nadh G", designation: "Senior Architect – Cloud, Infrastructure & DevOps", discipline: "Cloud / DevOps", tier: "Domain Mentor Pod", role: "Cloud and DevOps coordinator", course: "CS105 DevOps · CS102 cloud", levels: "L10 · L12–L15", track: "AWS · GCP ACE · CKA · Docker · GitHub Actions" },
  { name: "Abhi Krishnan R", designation: "Lead UI/UX Developer-1", discipline: "UI/UX & Product Design", tier: "Domain Mentor Pod", role: "UI/UX and product-design coordinator", course: "CS102 Frontend", levels: "L4 · L5", track: "Google UX/Figma · Meta Front-End" },
  { name: "Prasanth Lal S N", designation: "Senior Front End Developer", discipline: "UI / Frontend Development", tier: "Domain Mentor Pod", role: "Frontend development mentor", course: "CS102 Frontend", levels: "L4 · L5 · L9", track: "Meta Front-End and integration" },
  { name: "Ajitha V S", designation: "Technical Lead – QA & Testing", discipline: "Quality Assurance / Test Automation", tier: "Domain Mentor Pod", role: "QA and test-automation coordinator", course: "CS105 / Quality", levels: "L8 · L9 · L15", track: "Test automation · CI/CD testing · QA sign-off" },
  { name: "Soorya S Kumar", designation: "Team Lead – Java, Product Development Center", discipline: "Backend / Java", tier: "Student-Team Mentor", role: "Backend and API mentor – Cohort A", course: "CS103 / CS104", levels: "L8 · L11", track: "Postman API and backend track" },
  { name: "Krishnasree K", designation: "Team Lead – Java, Product Development Center", discipline: "Backend / Java", tier: "Student-Team Mentor", role: "Backend and API mentor – Cohort B", course: "CS104", levels: "L9 · L12", track: "API and microservices track" },
  { name: "Diju M", designation: "Senior Software Engineer (Java)", discipline: "Backend / Code Review", tier: "Student-Team Mentor", role: "Hands-on build mentor and code reviewer", course: "Sprint builds", levels: "L8–L12", track: "Peer and code-review facilitation" },
  { name: "Bibin Babu", designation: "Senior Software Engineer (Mobile Apps)", discipline: "Mobile / Cross-platform Front-end", tier: "Student-Team Mentor", role: "Mobile and cross-platform front-end mentor", course: "CS102 Frontend – mobile", levels: "L5 · L17 · L18", track: "React Native and mobile build" },
];
