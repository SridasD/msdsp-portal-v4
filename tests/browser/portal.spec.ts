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
  await page.getByRole("button", { name: "Work Board" }).click();
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

  // Close modal via Escape
  await page.keyboard.press("Escape");
  await expect(guideModal).toBeHidden();
});

