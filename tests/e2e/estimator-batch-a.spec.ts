import { expect, test, type Page } from "./fakeTurnstile";
import plan from "../fixtures/plan.json";
import { estimatorCopy, profile } from "../../lib/content";
import { samplePlan } from "../../lib/samplePlan";

const FEATURE = "Add one-time code login with email delivery and rate limiting";

async function ready(page: Page) {
  await page.goto("/");
  await page.getByLabel("Feature description").fill(FEATURE);
  const submit = page.getByRole("button", { name: estimatorCopy.submit });
  await expect(submit).toBeEnabled({ timeout: 15_000 });
  return submit;
}

test.describe("phone", () => {
  test.use({ viewport: { width: 320, height: 700 } });

  test("task table shows Task and Hours without sideways scroll, role under the task", async ({ page }) => {
    await page.goto("/");
    await page.getByRole("tab", { name: estimatorCopy.tabTasks }).click();
    const panel = page.getByRole("tabpanel", { name: estimatorCopy.tabTasks });
    const t = samplePlan.phases[0].tasks[0];
    const row = panel.getByRole("row").filter({ hasText: t.task });
    await expect(row).toContainText(t.role);
    // The check is about sideways cut-off, so bring the row up first; its height on the page varies.
    await row.scrollIntoViewIfNeeded();
    await expect(row.getByRole("cell").last()).toBeInViewport({ ratio: 1 });
    const scroll = panel.locator(".tab2-scroll");
    expect(await scroll.evaluate((el) => el.scrollWidth <= el.clientWidth)).toBe(true);
    await expect(panel.getByRole("columnheader", { name: estimatorCopy.tasks.role })).toBeHidden();
  });
});

test("task table keeps the Role and Hours columns on desktop", async ({ page }) => {
  await page.setViewportSize({ width: 1280, height: 900 });
  await page.goto("/");
  await page.getByRole("tab", { name: estimatorCopy.tabTasks }).click();
  await expect(page.getByRole("columnheader", { name: estimatorCopy.tasks.role })).toBeVisible();
  await expect(page.getByRole("columnheader", { name: estimatorCopy.tasks.hours })).toBeVisible();
});

test.describe("submit on a phone", () => {
  test.use({ viewport: { width: 390, height: 844 } });

  test("results are focused and in view while waiting, with steps and a plan-shaped skeleton", async ({ page }) => {
    await page.route("**/api/estimate", async (route) => {
      await new Promise((r) => setTimeout(r, 1500));
      await route.fulfill({ json: plan });
    });
    const submit = await ready(page);
    await submit.click();
    const results = page.getByRole("region", { name: "Estimate results" });
    await expect(results).toBeFocused();
    await expect(results).toBeInViewport();
    // The step line at the top must be fully on screen (the preview link above it disappears on submit).
    await expect(page.getByText(estimatorCopy.steps[0])).toBeInViewport({ ratio: 1 });
    await expect(page.getByText(estimatorCopy.usuallyWait)).toBeVisible();
    await expect(page.locator(".estimator__bone--card")).toHaveCount(4);
    await expect(page.locator(".estimator__bone--bar")).toHaveCount(5);
    await expect(page.getByRole("heading", { name: plan.scope.title })).toBeFocused();
  });
});

test("hero links to the live demo", async ({ page }) => {
  await page.goto("/");
  const hero = page.getByRole("region", { name: profile.name, exact: true });
  await expect(hero.getByRole("link", { name: profile.demoCta, exact: true })).toHaveAttribute("href", "#estimator");
});

test("a call to action follows the example and a live plan", async ({ page }) => {
  await page.route("**/api/estimate", (route) => route.fulfill({ json: plan }));
  await page.goto("/");
  const results = page.getByRole("region", { name: "Estimate results" });
  const check = async () => {
    await expect(results.getByText(estimatorCopy.cta.text)).toBeVisible();
    await expect(results.getByRole("link", { name: estimatorCopy.cta.email, exact: true })).toHaveAttribute("href", `mailto:${profile.email}`);
    await expect(results.getByRole("link", { name: new RegExp(`^${estimatorCopy.cta.linkedin}`) })).toHaveAttribute("href", profile.linkedin);
  };
  await check();
  await (await ready(page)).click();
  await expect(page.getByRole("heading", { name: plan.scope.title })).toBeFocused();
  await check();
});

test("a chip fills the field and leaves the caret at its end", async ({ page }) => {
  await page.goto("/");
  const group = page.getByRole("group", { name: "Example features" });
  await expect(group).toHaveAttribute("data-ready", "");
  await group.getByRole("button").first().click();
  const field = page.getByLabel("Feature description");
  await expect(field).toBeFocused();
  const value = await field.inputValue();
  expect(value.length).toBeGreaterThan(0);
  expect(await field.evaluate((el: HTMLTextAreaElement) => [el.selectionStart, el.selectionEnd])).toEqual([value.length, value.length]);
});

test("a failed re-estimate keeps the previous plan under the error banner", async ({ page }) => {
  let n = 0;
  await page.route("**/api/estimate", (route) =>
    ++n === 1 ? route.fulfill({ json: plan }) : route.fulfill({ status: 500, json: { error: "Boom" } }),
  );
  const submit = await ready(page);
  await submit.click();
  await expect(page.getByRole("heading", { name: plan.scope.title })).toBeVisible();
  await expect(submit).toBeEnabled();
  await submit.click();
  await expect(page.getByRole("alert").filter({ hasText: "Boom" })).toBeVisible();
  await expect(page.getByRole("heading", { name: plan.scope.title })).toBeVisible();
});

test("an incomplete plan shows the incomplete-plan banner", async ({ page }) => {
  await page.route("**/api/estimate", (route) =>
    route.fulfill({ json: { scope: { ...plan.scope, phases: [{ ...plan.scope.phases[0], tasks: [{ task: "x", role: "QA", category: "code", baseHours: 1e9 }] }] } } }),
  );
  await (await ready(page)).click();
  await expect(page.getByRole("alert").filter({ hasText: estimatorCopy.badPlan })).toBeVisible();
});
