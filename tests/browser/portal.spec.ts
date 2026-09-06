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

test("has no serious structural accessibility violations", async ({ page }) => {
  await openPortal(page);
  const results = await new AxeBuilder({ page })
    .withTags(["wcag2a", "wcag2aa", "wcag21a", "wcag21aa"])
    .disableRules(["color-contrast"])
    .analyze();

  expect(results.violations.filter(({ impact }) => impact === "serious" || impact === "critical")).toEqual([]);
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
