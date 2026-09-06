import AxeBuilder from "@axe-core/playwright";
import { expect, test } from "@playwright/test";

async function openPortal(page: import("@playwright/test").Page) {
  await page.goto("/");
  await expect(page.locator(".app-shell")).toHaveAttribute("data-hydrated", "true");
}

test("switches between governed workspaces", async ({ page }) => {
  await openPortal(page);

  const workspace = page.locator("#workspace");
  await expect(workspace).toHaveAttribute("aria-label", "Student workspace: Overview");

  const mobileMenu = page.getByRole("button", { name: "Open navigation" });
  if (await mobileMenu.isVisible()) await mobileMenu.click();

  await page.getByRole("button", { name: "Course Head", exact: true }).click();
  await expect(workspace).toHaveAttribute("aria-label", "Course Head workspace: Overview");
  await expect(page.getByRole("navigation", { name: "Workspace navigation" })).toContainText("Course Details");

  if (await mobileMenu.isVisible()) await mobileMenu.click();
  await page.getByRole("button", { name: "Mentor", exact: true }).click();
  await expect(workspace).toHaveAttribute("aria-label", "Mentor workspace: Overview");
  await expect(page.getByText("MENTOR RESPONSIBILITY", { exact: true })).toBeVisible();
});

test("validates evidence and restores focus when dismissed", async ({ page }) => {
  await openPortal(page);

  const trigger = page.getByRole("button", { name: "Record learning evidence" });
  await trigger.click();
  const dialog = page.getByRole("dialog", { name: "Connect engineering work to an academic claim" });
  await expect(dialog).toBeVisible();

  await page.getByRole("textbox", { name: /^Academic claim/ }).fill("Too short");
  await page.getByRole("button", { name: "Save evidence" }).click();
  await expect(dialog).toBeVisible();

  await page.keyboard.press("Escape");
  await expect(dialog).toBeHidden();
  await expect(trigger).toBeFocused();
});

test("has no serious accessibility violations", async ({ page }) => {
  await openPortal(page);
  const results = await new AxeBuilder({ page })
    .withTags(["wcag2a", "wcag2aa", "wcag21a", "wcag21aa"])
    .analyze();

  const serious = results.violations
    .filter(({ impact }) => impact === "serious" || impact === "critical")
    .map(({ id, nodes }) => ({ id, targets: nodes.map(({ target }) => target.join(" ")) }));
  expect(serious).toEqual([]);
});

test("opens and closes mobile workspace navigation", async ({ page }, testInfo) => {
  test.skip(!testInfo.project.name.startsWith("mobile"), "Mobile navigation is viewport-specific.");
  await openPortal(page);

  const open = page.getByRole("button", { name: "Open navigation" });
  await open.click();
  await expect(page.getByRole("button", { name: "Close navigation" }).first()).toHaveAttribute("aria-expanded", "true");
  await page.getByRole("navigation", { name: "Workspace navigation" }).getByRole("button", { name: "Work Board" }).click();
  await expect(page.locator("#workspace")).toHaveAttribute("aria-label", "Student workspace: Work Board");
});

test("supports switching between v2 focused dashboard and classic overview", async ({ page }) => {
  await openPortal(page);

  // By default on browser hydration, v2 focused dashboard is active
  await expect(page.getByText("TEAM NORTHSTAR · COHORT COLLABORATION")).toBeVisible();
  await expect(page.getByText("Resolve the two failing end-to-end scenarios (DS-907)")).toBeVisible();

  // Switch to Classic
  await page.getByRole("button", { name: "Classic Overview" }).click();
  await expect(page.getByText("LEVEL 9 QUESTS")).toBeVisible();
  await expect(page.getByText("EXPERIENTIAL LEARNING SCAFFOLD")).toBeVisible();

  // Switch back to Focused (v2)
  await page.getByRole("button", { name: "Focused (v2)" }).click();
  await expect(page.getByText("TEAM NORTHSTAR · COHORT COLLABORATION")).toBeVisible();
});

test("opens evidence modal pre-selected to DS-907 from urgent revision hero", async ({ page }) => {
  await openPortal(page);

  const heroCta = page.getByRole("button", { name: "Attach corrected test trace" });
  await heroCta.click();

  const dialog = page.getByRole("dialog", { name: "Connect engineering work to an academic claim" });
  await expect(dialog).toBeVisible();

  const select = page.getByRole("combobox", { name: "Related assignment" });
  await expect(select).toHaveValue("DS-907 · End-to-end quality-gate revision");

  await page.keyboard.press("Escape");
  await expect(dialog).toBeHidden();
});

test("renders progression ribbon, expands quest points, and opens student guide modal", async ({ page }) => {
  await openPortal(page);

  // 1. Check progression ribbon
  await expect(page.getByText("LEVEL PATHWAY")).toBeVisible();
  await expect(page.getByText("SPRINT CADENCE")).toBeVisible();
  await expect(page.getByText("L9 · Current")).toBeVisible();

  // 2. Expand quest points ledger in score card
  const toggleBtn = page.getByRole("button", { name: /Inspect Level 9 Quest Points/ });
  await expect(toggleBtn).toBeVisible();
  await toggleBtn.click();
  await expect(page.getByText("Frontend–backend integration")).toBeVisible();
  await expect(page.getByText("230 / 250 pts")).toBeVisible();

  // 3. Open Student Guide modal
  const guideBtn = page.getByRole("button", { name: "Open Student Guide: How Learning Works" });
  await guideBtn.click();

  const guideModal = page.getByRole("dialog", { name: "How Your Learning, Tasks & Scores Work" });
  await expect(guideModal).toBeVisible();

  // Check hierarchy tab
  await expect(page.getByText("M.Sc. Data Science & Product Development")).toBeVisible();
  await expect(page.getByText("DS-907 · End-to-End Quality Gate Revision")).toBeVisible();

  // Switch to Acronyms tab
  await page.getByRole("tab", { name: /2\. Acronyms/ }).click();
  await expect(page.getByText("Data Science Assignment Code")).toBeVisible();
  await expect(page.getByText("Programme Outcome (PO1–PO8)")).toBeVisible();

  // Switch to Scores tab
  await page.getByRole("tab", { name: /3\. Scores vs Attendance/ }).click();
  await expect(page.getByText("Academic Result (82.4%)")).toBeVisible();
  await expect(page.getByText("Attendance (DUK@360 ERP)")).toBeVisible();

  // Switch to Tab 4: Dashboard vs Work Board vs Portfolio
  await page.getByRole("tab", { name: /4\. Dashboard vs Work Board/ }).click();
  await expect(page.getByText("Your Strategic Command Center (Cockpit)")).toBeVisible();
  await expect(page.getByText("Your Engineering Execution Workbench (Studio)")).toBeVisible();
  await expect(page.getByText("Your Permanent Verified Showcase (Vault)")).toBeVisible();
  await expect(page.getByText("The 4-Step Assignment Cycle:")).toBeVisible();

  // Close modal via Escape
  await page.keyboard.press("Escape");
  await expect(guideModal).toBeHidden();
});

test("demystifies Work Board connection to Dashboard and supports cross-navigation", async ({ page }) => {
  await openPortal(page);

  // 1. Verify Work Board helper banner on Focused Dashboard
  await expect(page.getByText("Connected to your Work Board & Portfolio")).toBeVisible();

  // 2. Click "Execute on Work Board" from urgent hero card
  const heroWbBtn = page.getByRole("button", { name: "Execute on Work Board" });
  await expect(heroWbBtn).toBeVisible();
  await heroWbBtn.click();

  // 3. Verify landing on Work Board with DS-907 dynamically selected
  await expect(page.locator("#workspace")).toHaveAttribute("aria-label", "Student workspace: Work Board");
  await expect(page.getByText("NEW STUDENT REFERENCE · WORK BOARD VS PORTFOLIO")).toBeVisible();
  await expect(page.getByText("Your Active Engineering Execution Workbench")).toBeVisible();
  await expect(page.getByText("1. Read Brief")).toBeVisible();
  await expect(page.getByText("4. Submit for Review")).toBeVisible();
  await expect(page.getByText("SELECTED ASSIGNMENT · DS-907")).toBeVisible();
  await expect(page.getByText("Can you stabilize the failing E2E quality gates under concurrent load?")).toBeVisible();

  // Dynamically switch to DS-904 via table click
  await page.getByRole("button", { name: /DS-904 · Full-stack integration and test readiness/ }).click();
  await expect(page.getByText("SELECTED ASSIGNMENT · DS-904")).toBeVisible();
  await expect(page.getByText("Can the integrated product withstand a professional live demonstration?")).toBeVisible();

  // 4. Return to Dashboard Overview via the back button
  const returnBtn = page.getByRole("button", { name: "Return to Dashboard Overview" });
  await expect(returnBtn).toBeVisible();
  await returnBtn.click();
  await expect(page.locator("#workspace")).toHaveAttribute("aria-label", "Student workspace: Overview");
  await expect(page.getByText("TEAM NORTHSTAR · COHORT COLLABORATION")).toBeVisible();
});

test("demystifies Evidence & Portfolio vs Work Board and connects quality gaps to Work Board", async ({ page }) => {
  await openPortal(page);

  // 1. Navigate to Evidence & Portfolio (handling mobile drawer if present)
  const mobileMenu = page.getByRole("button", { name: "Open navigation" });
  if (await mobileMenu.isVisible()) {
    await mobileMenu.click();
  }
  await page.getByRole("button", { name: "Evidence & Portfolio" }).click();
  await expect(page.locator("#workspace")).toHaveAttribute("aria-label", "Student workspace: Evidence & Portfolio");

  // 2. Verify onboarding banner explaining Portfolio vs Work Board
  await expect(page.getByText("NEW STUDENT REFERENCE · PORTFOLIO VS WORK BOARD")).toBeVisible();
  await expect(page.getByText("Your Cumulative Verified Engineering Showcase")).toBeVisible();
  await expect(page.getByText("1. Dashboard: Cockpit & Alerts")).toBeVisible();
  await expect(page.getByText("2. Work Board: Active Execution")).toBeVisible();
  await expect(page.getByText("3. Portfolio: Permanent Showcase")).toBeVisible();

  // 3. Filter artifacts
  await page.getByRole("button", { name: /Quality Gaps/ }).click();
  await expect(page.getByText("Playwright end-to-end report")).toBeVisible();

  // 4. Click direct action to fix quality gap on Work Board
  const fixBtn = page.getByRole("button", { name: /Fix on Work Board \(DS-907\)/ });
  await expect(fixBtn).toBeVisible();
  await fixBtn.click();

  // 5. Verify it jumps directly to Work Board with DS-907 loaded!
  await expect(page.locator("#workspace")).toHaveAttribute("aria-label", "Student workspace: Work Board");
  await expect(page.getByText("SELECTED ASSIGNMENT · DS-907")).toBeVisible();
  await expect(page.getByText("Can you stabilize the failing E2E quality gates under concurrent load?")).toBeVisible();
});

test("supports collapsing sidebar into icons-only mode and restoring it", async ({ page }, testInfo) => {
  test.skip(testInfo.project.name.startsWith("mobile"), "Sidebar icon rail toggle is desktop-specific.");
  await openPortal(page);

  const sidebar = page.locator("aside.sidebar");
  await expect(sidebar).toBeVisible();
  await expect(sidebar).not.toHaveClass(/collapsed/);

  // 1. Locate collapse toggle button
  const toggleBtn = page.getByRole("button", { name: "Collapse sidebar to icons only" });
  await expect(toggleBtn).toBeVisible();
  await expect(toggleBtn).toHaveAttribute("aria-expanded", "true");

  // 2. Click to collapse into icons-only mode
  await toggleBtn.click();
  await expect(sidebar).toHaveClass(/collapsed/);
  await expect(page.locator("main.app-shell")).toHaveClass(/sidebar-collapsed/);
  await expect(page.getByRole("button", { name: "Expand sidebar navigation" })).toBeVisible();
  await expect(page.getByRole("button", { name: "Expand sidebar navigation" })).toHaveAttribute("aria-expanded", "false");

  // Verify no accessibility violations while collapsed
  const collapsedAxe = await new AxeBuilder({ page })
    .withTags(["wcag2a", "wcag2aa", "wcag21a", "wcag21aa"])
    .analyze();
  const collapsedViolations = collapsedAxe.violations
    .filter(({ impact }) => impact === "serious" || impact === "critical")
    .map(({ id, nodes }) => ({ id, targets: nodes.map(({ target }) => target.join(" ")) }));
  expect(collapsedViolations).toEqual([]);

  // Verify navigation buttons still work and show icons
  const workBoardNav = page.getByRole("navigation", { name: "Workspace navigation" }).getByRole("button", { name: "Work Board" });
  await expect(workBoardNav).toBeVisible();
  await workBoardNav.click();
  await expect(page.locator("#workspace")).toHaveAttribute("aria-label", "Student workspace: Work Board");

  // 3. Expand sidebar back
  const expandBtn = page.getByRole("button", { name: "Expand sidebar navigation" });
  await expandBtn.click();
  await expect(sidebar).not.toHaveClass(/collapsed/);
  await expect(page.getByText("Collapse sidebar")).toBeVisible();
});

test("demystifies Skills & Outcomes (PO vs PSO), filters competencies, and jumps to Work Board remediation", async ({ page }) => {
  await openPortal(page);

  const mobileMenu = page.getByRole("button", { name: "Open navigation" });
  if (await mobileMenu.isVisible()) await mobileMenu.click();
  await page.getByRole("navigation", { name: "Workspace navigation" }).getByRole("button", { name: "Skills & Outcomes" }).click();

  await expect(page.locator("#workspace")).toHaveAttribute("aria-label", "Student workspace: Skills & Outcomes");

  // 1. Verify PO vs PSO Demystifier Card
  await expect(page.getByText("UNDERSTANDING OUTCOMES · LEVEL 9")).toBeVisible();
  await expect(page.getByText("How Your Code Maps to Degree Competencies")).toBeVisible();
  await expect(page.getByText("PO1–PO8")).toBeVisible();
  await expect(page.getByText("Programme Outcomes", { exact: true })).toBeVisible();
  await expect(page.getByText("PSO1–PSO4")).toBeVisible();
  await expect(page.getByText("Specialized Outcomes", { exact: true })).toBeVisible();
  await expect(page.getByText("Level 9 Active Coverage: 4 / 6 Competencies Addressed (67%)")).toBeVisible();

  // 2. Filter by Core POs
  await page.getByRole("button", { name: "Core POs (4)" }).click();
  await expect(page.getByRole("heading", { name: "Delivery Automation & QA" })).toBeVisible();
  await expect(page.getByRole("heading", { name: "Distributed Transaction Resilience" })).toBeHidden();

  // 3. Filter by Specialized PSOs
  await page.getByRole("button", { name: "Specialized PSOs (2)" }).click();
  await expect(page.getByRole("heading", { name: "Distributed Transaction Resilience" })).toBeVisible();
  await expect(page.getByRole("heading", { name: "Delivery Automation & QA" })).toBeHidden();

  // 4. Filter by Evidence Gaps and jump to Work Board
  await page.getByRole("button", { name: "Evidence Gaps (2)" }).click();
  await expect(page.getByRole("heading", { name: "Distributed Transaction Resilience" })).toBeVisible();

  const fixBtn = page.getByRole("button", { name: "Fix on Work Board (DS-907) →" }).first();
  await expect(fixBtn).toBeVisible();
  await fixBtn.click({ force: true });

  // Jumps straight to Work Board with DS-907
  await expect(page.locator("#workspace")).toHaveAttribute("aria-label", "Student workspace: Work Board");
  await expect(page.getByText("SELECTED ASSIGNMENT · DS-907")).toBeVisible();
});

test("supports multi-ticket critique switching, interactive revision checklist, and review response in Faculty Feedback", async ({ page }) => {
  await openPortal(page);

  const mobileMenu = page.getByRole("button", { name: "Open navigation" });
  if (await mobileMenu.isVisible()) await mobileMenu.click();
  await page.getByRole("navigation", { name: "Workspace navigation" }).getByRole("button", { name: "Faculty Feedback" }).click();

  await expect(page.locator("#workspace")).toHaveAttribute("aria-label", "Student workspace: Faculty Feedback");

  // 1. Check ticket switcher tabs
  const tab907 = page.getByRole("tab", { name: /DS-907/ });
  const tab904 = page.getByRole("tab", { name: /DS-904/ });
  const tab905 = page.getByRole("tab", { name: /DS-905/ });
  await expect(tab907).toBeVisible();
  await expect(tab904).toBeVisible();
  await expect(tab905).toBeVisible();

  // Switch to DS-904
  await tab904.click();
  await expect(page.getByText("KRISHNASREE K").first()).toBeVisible();
  await expect(page.getByRole("heading", { name: "Full-stack integration and test readiness" })).toBeVisible();

  // Switch back to DS-907
  await tab907.click();
  await expect(page.getByText("AJITHA V S").first()).toBeVisible();
  await expect(page.getByText("WHAT IS WORKING")).toBeVisible();
  await expect(page.getByText("WHAT MUST CHANGE")).toBeVisible();
  await expect(page.getByText("ACADEMIC PURPOSE")).toBeVisible();

  // 2. Interactive checklist updates
  await expect(page.getByText("0 of 4 completed (0%)")).toBeVisible();
  const firstTask = page.getByLabel("Token refresh scenario passes in Chromium and Firefox");
  await firstTask.check();
  await expect(page.getByText("1 of 4 completed (25%)")).toBeVisible();

  // 3. Action button: Execute Revision on Work Board
  const executeBtn = page.getByRole("button", { name: "Execute Revision on Work Board (DS-907)" });
  await expect(executeBtn).toBeVisible();
  await executeBtn.click();
  await expect(page.locator("#workspace")).toHaveAttribute("aria-label", "Student workspace: Work Board");
  await expect(page.getByText("SELECTED ASSIGNMENT · DS-907")).toBeVisible();

  // Navigate back to Faculty Feedback
  if (await mobileMenu.isVisible()) await mobileMenu.click();
  await page.getByRole("navigation", { name: "Workspace navigation" }).getByRole("button", { name: "Faculty Feedback" }).click();

  // 4. Action button: Upload Evidence / Traces
  const uploadBtn = page.getByRole("button", { name: "Upload Evidence / Traces" });
  await expect(uploadBtn).toBeVisible();
  await uploadBtn.click();

  const dialog = page.getByRole("dialog", { name: "Connect engineering work to an academic claim" });
  await expect(dialog).toBeVisible();
  const select = page.getByRole("combobox", { name: "Related assignment" });
  await expect(select).toHaveValue("DS-907 · End-to-end quality-gate revision");
  await page.keyboard.press("Escape");
  await expect(dialog).toBeHidden();
});

test("clarifies Calendar vs Attendance boundary, interacts with Sprint Roadmap, and opens Day Details Drawer", async ({ page }) => {
  await openPortal(page);

  const mobileMenu = page.getByRole("button", { name: "Open navigation" });
  if (await mobileMenu.isVisible()) await mobileMenu.click();
  await page.getByRole("navigation", { name: "Workspace navigation" }).getByRole("button", { name: "Calendar" }).click();

  await expect(page.locator("#workspace")).toHaveAttribute("aria-label", "Student workspace: Calendar");

  // 1. Verify Attendance Clarification Card
  await expect(page.getByText("ACADEMIC WORK PLANNING ONLY")).toBeVisible();
  await expect(page.getByText("Calendar is for Academic Commitments — Attendance is Managed in DUK@360")).toBeVisible();
  await expect(page.getByText("DUK@360").first()).toBeVisible();

  // 2. Verify Sprint Roadmap strip
  await expect(page.getByText("LEVEL 9 · SPRINT PROGRESSION TIMELINE")).toBeVisible();
  await expect(page.getByText("Active Sprint: Sprint 04 · Verify (01–14 September)")).toBeVisible();

  // 3. Filter pills
  await page.getByRole("button", { name: "Sprint Work (1)" }).click();
  await expect(page.getByText("Sprint 04 · Verify checkpoint")).toBeVisible();

  // 4. Click All Events to restore full view and click Day 5
  await page.getByRole("button", { name: "All Events (7)" }).click();
  await page.getByRole("button", { name: /5 DS-907 End-to-end quality gate/ }).click();

  await expect(page.getByRole("heading", { name: "5 September 2026" })).toBeVisible();
  await expect(page.getByText("Ajitha V S (QA Coordinator)")).toBeVisible();

  // Click CTA in drawer to jump to Work Board
  const drawerCta = page.getByRole("button", { name: "Fix on Work Board (DS-907) →" });
  await expect(drawerCta).toBeVisible();
  await drawerCta.click();

  await expect(page.locator("#workspace")).toHaveAttribute("aria-label", "Student workspace: Work Board");
  await expect(page.getByText("SELECTED ASSIGNMENT · DS-907")).toBeVisible();
});

test("demystifies Performance & Results (Academic GPA vs Quest Points) and simulates progression what-if scenario", async ({ page }) => {
  await openPortal(page);

  const mobileMenu = page.getByRole("button", { name: "Open navigation" });
  if (await mobileMenu.isVisible()) await mobileMenu.click();
  await page.getByRole("navigation", { name: "Workspace navigation" }).getByRole("button", { name: "Performance & Results" }).click();

  await expect(page.locator("#workspace")).toHaveAttribute("aria-label", "Student workspace: Performance & Results");

  // 1. Verify Demystifier Card
  await expect(page.getByText("DEMYSTIFYING YOUR SCORES · LEVEL 9")).toBeVisible();
  await expect(page.getByText("Understanding Academic Marks vs Quest Points")).toBeVisible();
  await expect(page.getByText("Official Grade")).toBeVisible();
  await expect(page.getByText("Academic Result (82.1%)")).toBeVisible();
  await expect(page.getByText("Sprint Pace")).toBeVisible();
  await expect(page.getByText("Quest Points (780 / 1000 pts)")).toBeVisible();

  // 2. Interactive Progression Simulator (What-If)
  await expect(page.getByText("INTERACTIVE PROGRESSION SIMULATOR")).toBeVisible();
  await expect(page.getByRole("heading", { name: "What-If Grade & Points Projector" })).toBeVisible();
  await expect(page.getByText("780 / 1000", { exact: true })).toBeVisible();

  // Toggle DS-907 (+30 pts)
  await page.getByLabel(/Fix DS-907 Quality Gate/).check();
  await expect(page.getByText("810 / 1000", { exact: true })).toBeVisible();

  // Toggle Live Demo (+80 pts)
  await page.getByLabel(/Score 90% on Live Demonstration/).check();
  await expect(page.getByText("890 / 1000", { exact: true })).toBeVisible();
  await expect(page.getByText("Distinction Pace ⭐")).toBeVisible();
  await expect(page.getByText("🎉 Distinction Band Projection Unlocked! (890 / 1000 pts)")).toBeVisible();

  // 3. Verify Course Plan Component Table with Assignment buttons
  await expect(page.getByRole("button", { name: "DS-904 Full-Stack Capstone & PR-42 →" })).toBeVisible();
  await expect(page.getByRole("button", { name: "DS-905 API & DS-907 Quality Gate →" })).toBeVisible();
});




