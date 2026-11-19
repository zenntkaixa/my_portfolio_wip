import { expect, test, type Page } from "./fakeTurnstile";
import plan from "../fixtures/plan.json";
import { estimatorCopy } from "../../lib/content";

// The real API is never called: /api/estimate is intercepted. Fixture: 112 hours, 2.6 weeks.

async function estimate(page: Page, workingStyle: "traditional" | "ai-assisted") {
  await page.route("**/api/estimate", (route) => route.fulfill({ json: plan }));
  await page.goto("/");
  await page.getByLabel("Feature description").fill("Add one-time code login with email delivery and rate limiting");
  await page.getByRole("radio", { name: estimatorCopy.mode.options[workingStyle] }).check();
  const submit = page.getByRole("button", { name: estimatorCopy.submit });
  await expect(submit).toBeEnabled({ timeout: 15_000 });
  await submit.click();
  await page.getByRole("tab", { name: estimatorCopy.tabBudget }).click();
  return page.getByTestId("budget");
}

test("traditional: people cost from hours x rate, the model's costs, totals and no seats", async ({ page }) => {
  const table = await estimate(page, "traditional");
  await expect(table).toContainText(estimatorCopy.budget.peopleDetail(112, 78, "mixed"));
  await expect(table).toContainText("RM 8,736");
  await expect(table).not.toContainText(estimatorCopy.budget.seats);
  await expect(table).toContainText("Security review of the login flow");
  // Build: 8,736 + 20% contingency 1,747 + one-off 3,000–8,000. Per month: 150–800.
  await expect(table.getByRole("row", { name: new RegExp(estimatorCopy.budget.buildTotal) })).toContainText("RM 13,483–18,483");
  await expect(table.getByRole("row", { name: new RegExp(estimatorCopy.budget.monthlyTotal) })).toContainText("RM 150–800");
  await expect(page.getByText(estimatorCopy.budget.note)).toBeVisible();
});

test("with AI agents: one seat per person for each started month", async ({ page }) => {
  const table = await estimate(page, "ai-assisted");
  await expect(table).toContainText(estimatorCopy.budget.seatsDetail(4, 1, 80, 400));
  await expect(table).toContainText("RM 320–1,600");
  await expect(table.getByRole("row", { name: new RegExp(estimatorCopy.budget.buildTotal) })).toContainText("RM 13,803–20,083");
});
