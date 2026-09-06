import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

const developmentPreviewMeta =
  /<meta(?=[^>]*\bname=["']codex-preview["'])(?=[^>]*\bcontent=["']development["'])[^>]*>/i;

test("renders development preview metadata", async () => {
  const workerUrl = new URL("../dist/server/index.js", import.meta.url);
  workerUrl.searchParams.set("test", `${process.pid}-${Date.now()}`);
  const { default: worker } = await import(workerUrl.href);

  const response = await worker.fetch(
    new Request("http://localhost/", {
      headers: { accept: "text/html" },
    }),
    {
      ASSETS: {
        fetch: async () => new Response("Not found", { status: 404 }),
      },
    },
    {
      waitUntil() {},
      passThroughOnException() {},
    },
  );

  assert.equal(response.status, 200);
  assert.match(
    response.headers.get("content-type") ?? "",
    /^text\/html\b/i,
  );
  const html = await response.text();
  assert.match(html, developmentPreviewMeta);
  assert.doesNotMatch(html, />Course Details</);
  assert.doesNotMatch(html, />Course Coordination</);
  assert.match(html, />Work Board</);
  assert.match(html, />Evidence &amp; Portfolio</);
  assert.match(html, />Skills &amp; Outcomes</);
  assert.match(html, />Faculty Feedback</);
  assert.match(html, />Calendar</);
  assert.match(html, />Performance &amp; Results</);
  assert.match(html, />Information Centre</);
  assert.match(html, />Course Head</);
  assert.match(html, />Mentor</);
  assert.match(html, /Anakha Rajesh/);
  assert.doesNotMatch(html, /Ashoknath/);
  assert.match(html, /YOUR NEXT BEST ACTION/);
  assert.match(html, /Open DS-907 revision/);
  assert.match(html, /ACTIVE LEVEL · DRAFT GAMIFICATION RUBRIC/);
  assert.match(html, /Full Stack Integration &amp; Testing/);
  assert.match(html, /LEVEL 9 QUESTS/);
  assert.match(html, /Frontend–backend integration/);
  assert.match(html, /End-to-end test suite/);
  assert.match(html, /AWS SAA-C03 certification/);
  assert.match(html, /Full-stack live demonstration/);
  assert.match(html, /OpenAPI specification · pull request · schema migration/);
  assert.match(html, /Level points/);
  assert.match(html, /Faculty-verified professional milestones/);
  assert.match(html, /VERIFIED ACHIEVEMENTS/);
  assert.match(html, /GitHub Actions &amp; Postman/);
  assert.match(html, /COURSES &amp; ONLINE CERTIFICATION/);
  assert.match(html, /Academic marks, gamification points, certification and attendance remain separate records/);
  assert.match(html, /This records project work and learning; it is not attendance/);
  assert.doesNotMatch(html, /Mastery Points|Effort XP|Junior Associate/);
});

test("uses the approved five-student prototype cohort", async () => {
  const source = await readFile(new URL("../app/portal.tsx", import.meta.url), "utf8");
  for (const name of ["Alfin", "Anakha Rajesh", "Annamma", "Annrosna", "Dhanush Girish"]) {
    assert.match(source, new RegExp(name));
  }
  assert.doesNotMatch(source, /Maya R\.|Meera S\.|Rahul P\./);
});

test("separates mentor responsibilities and operational workflow", async () => {
  const source = await readFile(new URL("../app/portal.tsx", import.meta.url), "utf8");
  for (const label of [
    "Domain Mentor · QA & Testing",
    "Student-Team Mentor · Code Review",
    "My Allocations",
    "Learners & Teams",
    "Evidence Review",
    "Mentoring Records",
    "Competency & Calibration",
    "Escalations",
    "Recommendation Tracker",
  ]) {
    assert.match(source, new RegExp(label.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")));
  }
  assert.match(source, /No active mentor responsibility for \{cycle\.id\}/);
  assert.match(source, /Academic marks, official progression decisions and deadline changes cannot be finalised from the Mentor workspace/);
});

test("documents the Course Head programme operating model", async () => {
  const source = await readFile(new URL("../app/portal.tsx", import.meta.url), "utf8");
  for (const label of [
    "Programme Workflow",
    "Courses carry credits. Levels organise delivery. Sprints organise work.",
    "MSDSP Course Coordination Plan v4",
    "Orientation & Foundations",
    "Vyga V R",
    "Student-Team Mentor",
    "Domain Mentor",
    "DUK@360",
  ]) {
    assert.match(source, new RegExp(label.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")));
  }
  assert.match(source, /Credit values remain configurable/);
  assert.match(source, /Programme Board confirmation/);
  assert.match(source, /MERMAID REFERENCE DIAGRAMS/);
  assert.match(source, /Programme to evidence/);
  assert.match(source, /Governed Level publication/);
  assert.match(source, /Evidence-led mentoring loop/);
  assert.match(source, /Academic and progression separation/);
});

test("keeps core navigation and evidence dialog accessible", async () => {
  const source = await readFile(new URL("../app/portal.tsx", import.meta.url), "utf8");
  const dialog = await readFile(new URL("../app/components/evidence-modal.tsx", import.meta.url), "utf8");
  for (const contract of [
    'className="skip-link"',
    'href="#workspace"',
    'id="workspace"',
    'aria-controls="primary-navigation"',
    'aria-label="Workspace navigation"',
    'aria-current={page === item ? "page" : undefined}',
    'aria-live="polite"',
    'document.addEventListener("pointerdown", closeOutsideMenus)',
  ]) {
    assert.match(source, new RegExp(contract.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")));
  }
  for (const contract of ['role="dialog"', 'aria-modal="true"', 'event.key === "Escape"', 'event.key !== "Tab"', "minLength={30}"]) {
    assert.match(dialog, new RegExp(contract.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")));
  }
});

test("labels unresolved programme rules as provisional configuration", async () => {
  const source = await readFile(new URL("../app/portal.tsx", import.meta.url), "utf8");
  const config = await readFile(new URL("../app/portal-config.ts", import.meta.url), "utf8");
  assert.match(source, /Credit totals remain subject to Programme Board confirmation/);
  assert.match(source, /programmeRules\.creditTotal\.decisionId/);
  assert.doesNotMatch(source, /<small>Total credits<\/small>/);
  for (const decision of ["PR-004", "PR-005", "PR-006", "PR-007"]) {
    assert.match(config, new RegExp(decision));
  }
});

test("keeps workspace information architecture in governed configuration", async () => {
  const config = await readFile(new URL("../app/portal-config.ts", import.meta.url), "utf8");
  assert.match(config, /student:[\s\S]*"Information Centre"/);
  assert.doesNotMatch(config, /student:[^\n]*"Course Details"/);
  assert.doesNotMatch(config, /courseHead:[^\n]*"Course Details"/);
  assert.doesNotMatch(config, /mentor:[^\n]*"Course Details"/);
  assert.doesNotMatch(config, /courseHead:[^\n]*"Programme Workflow"/);
  assert.doesNotMatch(config, /student:[^\n]*"Full Stack Development"/);
  assert.doesNotMatch(config, /student:[^\n]*"Workshop"/);
  assert.match(config, /courseHead:[^\n]*"Workshop"/);
  assert.doesNotMatch(config, /mentor:[^\n]*"Workshop"/);
  assert.match(config, /prototypeCohort/);
  assert.match(config, /workspaceIcons/);
  assert.match(config, /sprintData/);
  assert.match(config, /levelNinePoints/);
});
