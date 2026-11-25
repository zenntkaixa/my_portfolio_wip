import { expect, test, type Page } from "./fakeTurnstile";
import plan from "../fixtures/plan.json";
import { estimatorCopy } from "../../lib/content";

// The real API is never called: /api/estimate is intercepted. Fixture scope: 112 hours and 2.6 weeks (100 hours and 2.5 weeks with agents).

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
  await expect(table).toContainText("RM 7,410–11,388"); // best 95 h and worst 146 h at RM 78 (likely 112 h = 8,736)
  await expect(table).not.toContainText(estimatorCopy.budget.seats);
  await expect(table).toContainText("Security review of the login flow");
  // Build: people 7,410–11,388 + 20% contingency 1,482–2,278 + one-off 3,000–8,000. Per month: 150–800.
  await expect(table.getByRole("row", { name: new RegExp(estimatorCopy.budget.buildTotal) })).toContainText("RM 11,892–21,666");
  await expect(table.getByRole("row", { name: new RegExp(estimatorCopy.budget.monthlyTotal) })).toContainText("RM 150–800");
  await page.getByText(estimatorCopy.budget.notesSummary).click();
  await expect(page.getByText(estimatorCopy.budget.note)).toBeVisible();
});

test("with AI agents: one seat per person for each started month", async ({ page }) => {
  const table = await estimate(page, "ai-assisted");
  await expect(table).toContainText(estimatorCopy.budget.seatsDetail(4, 1, 80, 400));
  await expect(table).toContainText("RM 320–1,600");
  // Agents cut code and tests to 100 hours (incl. review), range 79–140 h: people 6,162–10,920 + 20% contingency 1,232–2,184 + seats 320–1,600 + one-off 3,000–8,000.
  await expect(table).toContainText(estimatorCopy.budget.peopleDetail(100, 78, "mixed"));
  await expect(table.getByRole("row", { name: new RegExp(estimatorCopy.budget.buildTotal) })).toContainText("RM 10,714–22,704");
});
