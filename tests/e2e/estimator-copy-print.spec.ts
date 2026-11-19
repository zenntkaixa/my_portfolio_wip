import { expect, test } from "./fakeTurnstile";
import { estimatorCopy, profile } from "../../lib/content";
import { samplePlan } from "../../lib/samplePlan";

test("Copy plan writes the plan text to the clipboard and says so", async ({ page, context, browserName }) => {
  test.skip(browserName !== "chromium", "clipboard permissions are chromium-only");
  await context.grantPermissions(["clipboard-read", "clipboard-write"]);
  await page.goto("/");
  await page.getByRole("button", { name: estimatorCopy.actions.copy }).click();
  await expect(page.getByRole("button", { name: estimatorCopy.actions.copied })).toBeVisible();
  const text = await page.evaluate(() => navigator.clipboard.readText());
  expect(text).toContain(samplePlan.title);
  expect(text).toContain(estimatorCopy.budget.contingency);
});

test("print shows all three panels and hides the form", async ({ page }) => {
  await page.goto("/");
  await expect(page.getByRole("button", { name: estimatorCopy.actions.print })).toBeVisible();
  await page.emulateMedia({ media: "print" });
  for (const name of [estimatorCopy.tabPhases, estimatorCopy.tabTasks, estimatorCopy.tabBudget]) {
    await expect(page.getByRole("tabpanel", { name })).toBeVisible();
  }
  await expect(page.locator("form")).toBeHidden();
  await expect(page.getByRole("button", { name: estimatorCopy.actions.print })).toBeHidden();
  await expect(page.getByText(estimatorCopy.actions.footer(profile.name))).toBeVisible();
});
