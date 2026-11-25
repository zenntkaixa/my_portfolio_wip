import { HOURLY_RATE } from "../../lib/budget";
import { expect, test, type Page } from "./fakeTurnstile";
import plan from "../fixtures/plan.json";
import { estimatorCopy } from "../../lib/content";

const FEATURE = "Add one-time code login with email delivery and rate limiting";

async function submitWith(page: Page, body: unknown) {
  await page.route("**/api/estimate", (route) => route.fulfill({ json: body }));
  await page.goto("/");
  await page.getByLabel("Feature description").fill(FEATURE);
  const submit = page.getByRole("button", { name: estimatorCopy.submit });
  await expect(submit).toBeEnabled({ timeout: 15_000 });
  await submit.click();
}

test("open questions and out-of-scope lists show the plan's items", async ({ page }) => {
  await submitWith(page, plan);
  for (const [heading, items] of [
    [estimatorCopy.questionsHeading, plan.scope.openQuestions],
    [estimatorCopy.outOfScopeHeading, plan.scope.outOfScope],
  ] as const) {
    await expect(page.getByRole("heading", { name: heading })).toBeVisible();
    await page.getByRole("heading", { name: heading }).click(); // W3: lists start closed
    // Scoped to the list: the refine form (B4) labels its inputs with the same questions.
    const list = page.getByRole("region", { name: heading }).getByRole("list");
    for (const item of items) await expect(list.getByText(item, { exact: true })).toBeVisible();
  }
});

test("budget tab shows the contingency row", async ({ page }) => {
  await submitWith(page, plan);
  await page.getByRole("tab", { name: estimatorCopy.tabBudget }).click();
  await expect(page.getByRole("row", { name: /Contingency \(\d+%\)/ })).toBeVisible();
  await page.getByText(estimatorCopy.budget.notesSummary).click();
  await expect(page.getByText(estimatorCopy.budget.rateNote(HOURLY_RATE))).toBeVisible();
});

test("calendar note appears only when the plan was stretched", async ({ page }) => {
  await submitWith(page, { ...plan, scope: { ...plan.scope, phases: [{ ...plan.scope.phases[0], durationDays: 1, tasks: [{ task: "All of it", role: "Backend", category: "code", baseHours: 120 }] }] } });
  await expect(page.getByText(/Calendar stretched to fit a team of \d+/)).toBeVisible();
});

test("no calendar note on a normal plan", async ({ page }) => {
  await submitWith(page, plan);
  await expect(page.getByRole("heading", { name: estimatorCopy.questionsHeading })).toBeVisible();
  await expect(page.getByText(/Calendar stretched/)).toHaveCount(0);
});
