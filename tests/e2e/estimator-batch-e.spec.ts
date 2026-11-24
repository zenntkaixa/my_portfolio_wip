import { expect, test, type Page } from "./fakeTurnstile";
import plan from "../fixtures/plan.json";
import { estimatorCopy, profile } from "../../lib/content";
import { AGENT_FRIENDLY, buildPlan } from "../../lib/estimateModel";
import { budget } from "../../lib/budget";
import type { Scope } from "../../lib/estimate";

const FEATURE = "Add one-time code login with email delivery and rate limiting";
const scope = plan.scope as Scope;
const allFacts = { users: true, systems: true, data: true, integrations: true, limits: true, outOfScope: true };

async function submitWith(page: Page, body: unknown, ai = false) {
  await page.route("**/api/estimate", (route) => route.fulfill({ json: body }));
  await page.goto("/");
  await page.getByLabel("Feature description").fill(FEATURE);
  if (ai) await page.getByRole("group", { name: estimatorCopy.mode.legend }).getByRole("radio", { name: estimatorCopy.mode.options["ai-assisted"] }).check();
  const submit = page.getByRole("button", { name: estimatorCopy.submit });
  await expect(submit).toBeEnabled({ timeout: 15_000 });
  await submit.click();
  await expect(page.getByTestId("summary")).toBeVisible();
}

const openBudget = (page: Page) => page.getByRole("tab", { name: estimatorCopy.tabBudget }).click();

test("effort card shows the likely hours and the range", async ({ page }) => {
  await submitWith(page, plan);
  const e = buildPlan(scope, { teamSize: 4, seniority: "mixed", mode: "traditional" }).effort;
  const summary = page.getByTestId("summary");
  await expect(summary.getByText(estimatorCopy.summary.hoursValue(e.likely))).toBeVisible();
  await expect(summary.getByText(estimatorCopy.summary.rangeNote(e.best, e.worst))).toBeVisible();
});

test("contingency rate follows confidence and lists missing facts", async ({ page }) => {
  await submitWith(page, plan);
  const p = buildPlan(scope, { teamSize: 4, seniority: "mixed", mode: "traditional" });
  expect(p.confidence).toBe("medium");
  const missing = page.getByTestId("missing-facts");
  await expect(missing).toHaveText(estimatorCopy.summary.missing(p.missingFacts.map((f) => estimatorCopy.factLabels[f]).join(", ")));
  await openBudget(page);
  await expect(page.getByRole("row", { name: /Contingency \(20%\)/ })).toBeVisible();
});

test("a fully stated brief is high confidence: 10% contingency, nothing missing", async ({ page }) => {
  await submitWith(page, { ...plan, scope: { ...scope, facts: allFacts } });
  await expect(page.getByTestId("missing-facts")).toHaveText(estimatorCopy.summary.allStated);
  await openBudget(page);
  await expect(page.getByRole("row", { name: /Contingency \(10%\)/ })).toBeVisible();
});

test("a vague brief is low confidence: 30% contingency", async ({ page }) => {
  const none = Object.fromEntries(Object.keys(allFacts).map((k) => [k, false]));
  await submitWith(page, { ...plan, scope: { ...scope, facts: none } });
  await openBudget(page);
  await expect(page.getByRole("row", { name: /Contingency \(30%\)/ })).toBeVisible();
});

test("budget rows add up to the build total", async ({ page }) => {
  await submitWith(page, plan);
  await openBudget(page);
  const table = page.getByTestId("budget");
  // Worked by hand for the fixture (mixed, 4 people, medium confidence): effort 95–146 h at RM 78,
  // 20% contingency, one-off 3,000–8,000. 7,410 + 1,482 + 3,000 = 11,892; 11,388 + 2,278 + 8,000 = 21,666.
  await expect(table).toContainText("RM 7,410–11,388");
  await expect(table.getByRole("row", { name: /Contingency \(20%\)/ })).toContainText("RM 1,482–2,278");
  await expect(table.getByRole("row", { name: new RegExp(estimatorCopy.budget.buildTotal) })).toContainText("RM 11,892–21,666");
});

test("drivers: traditional lists no AI band, AI lists it", async ({ page }) => {
  await submitWith(page, plan);
  await openBudget(page);
  const summary = page.getByText(estimatorCopy.drivers.heading, { exact: true });
  await summary.click();
  const drivers = page.locator(".drivers");
  await expect(drivers).toContainText("Seniority (mixed)");
  await expect(drivers).toContainText("Contingency: 20%");
  await expect(drivers).toContainText("6 productive hours");
  await expect(drivers).not.toContainText("With AI agents");
});

test("a live plan offers a feedback email with the plan title in the subject; the example doesn't", async ({ page }) => {
  await page.goto("/");
  await expect(page.getByRole("link", { name: estimatorCopy.feedback.link })).toHaveCount(0);
  await submitWith(page, plan);
  const link = page.getByRole("link", { name: estimatorCopy.feedback.link });
  await expect(link).toHaveAttribute("href", `mailto:${profile.email}?subject=${encodeURIComponent(estimatorCopy.feedback.subject(plan.scope.title))}`);
});

test("printing includes the drivers even when the disclosure is closed", async ({ page }) => {
  await submitWith(page, plan);
  const firstDriver = page.locator(".drivers li").first();
  await expect(page.locator(".drivers")).not.toHaveAttribute("open", "");
  await page.emulateMedia({ media: "print" });
  await expect(firstDriver).toBeVisible();
  await page.emulateMedia({ media: "screen" });
  await expect(firstDriver).toBeHidden();
});

test("drivers with AI agents state the band and the review task", async ({ page }) => {
  await submitWith(page, plan, true);
  await openBudget(page);
  await page.getByText(estimatorCopy.drivers.heading, { exact: true }).click();
  await expect(page.locator(".drivers")).toContainText("With AI agents: 20–40% fewer hours, 30% likely");
  await expect(page.locator(".drivers")).toContainText("review task of 15%");
});

test("comparison table equals buildPlan for both modes, current one marked", async ({ page }) => {
  await submitWith(page, plan, true);
  await openBudget(page);
  const table = page.getByTestId("compare");
  const team = { size: 4, seniority: "mixed" } as const;
  for (const mode of ["traditional", "ai-assisted"] as const) {
    const p = buildPlan(scope, { teamSize: 4, seniority: "mixed", mode });
    const cell = (row: string) => table.getByRole("row", { name: row });
    await expect(cell(estimatorCopy.compare.effort)).toContainText(estimatorCopy.summary.rangeNote(p.effort.best, p.effort.worst));
    await expect(cell(estimatorCopy.compare.calendar)).toContainText(estimatorCopy.summary.weeksValue(p.calendarWeeks));
    await expect(cell(estimatorCopy.compare.people)).toContainText(budget(p, { ...team, mode }).peopleRange.low.toLocaleString("en-MY"));
  }
  await expect(table.locator("th[data-mode='ai-assisted']")).toContainText(estimatorCopy.compare.current);
  await expect(table.locator("th[data-mode='traditional']")).not.toContainText(estimatorCopy.compare.current);
});

test("the example plan also has the comparison", async ({ page }) => {
  await page.goto("/");
  await openBudget(page);
  await expect(page.getByTestId("compare")).toBeVisible();
});

test("the AI review task and code-added risk render", async ({ page }) => {
  await submitWith(page, plan, true);
  await page.getByRole("tab", { name: estimatorCopy.tabTasks }).click();
  await expect(page.getByText(estimatorCopy.aiPlan.reviewTask).first()).toBeVisible();
  await page.getByRole("tab", { name: estimatorCopy.tabPhases }).click();
  await expect(page.getByText(estimatorCopy.aiPlan.reviewRisk)).toBeVisible();
});

test("budget tab fits 320px with no sideways scroll", async ({ page }) => {
  await page.setViewportSize({ width: 320, height: 800 });
  await submitWith(page, plan, true);
  await openBudget(page);
  await page.getByText(estimatorCopy.drivers.heading, { exact: true }).click();
  expect(await page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth)).toBeLessThanOrEqual(0);
  const t = page.getByTestId("compare");
  expect(await t.evaluate((el) => el.scrollWidth <= el.clientWidth)).toBe(true);
});

test.describe("role pills and task tags", () => {
  const openTasks = async (page: Page) => {
    await page.getByRole("tab", { name: estimatorCopy.tabTasks }).click();
    return page.getByRole("tabpanel", { name: estimatorCopy.tabTasks });
  };
  const rows = (ai: boolean) =>
    buildPlan(scope, { teamSize: 4, seniority: "mixed", mode: ai ? "ai-assisted" : "traditional" }).phases.flatMap((p) => p.tasks);

  test("each task row shows its role in a pill", async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 900 });
    await submitWith(page, plan);
    const panel = await openTasks(page);
    const first = rows(false)[0];
    await expect(panel.locator("td.tab2-role .pill", { hasText: first.role }).first()).toBeVisible();
    await expect(panel.locator(".tab2-tags")).toHaveCount(0);
  });

  test("AI tags show only in AI mode, on agent-friendly rows; the review row is tagged as added", async ({ page }) => {
    await submitWith(page, plan, true);
    const panel = await openTasks(page);
    const tasks = rows(true);
    const agent = tasks.filter((t) => AGENT_FRIENDLY.includes(t.category) && !t.addedByCode).length;
    expect(agent).toBeGreaterThan(0);
    await expect(panel.locator(".tab2-tags .pill", { hasText: new RegExp(`^${estimatorCopy.tasks.tagAi}`) })).toHaveCount(agent);
    const added = panel.locator("tbody tr", { hasText: estimatorCopy.aiPlan.reviewTask });
    await expect(added.locator(".pill", { hasText: estimatorCopy.tasks.tagAdded }).first()).toBeVisible();
    await expect(added.getByText(estimatorCopy.tasks.tagAiHint)).toHaveCount(0);
    for (const t of tasks.filter((t) => !AGENT_FRIENDLY.includes(t.category))) {
      await expect(panel.locator("tbody tr", { hasText: t.task }).locator(".tab2-tags")).toHaveCount(0);
    }
  });

  test("the comparison marks the current style with a pill", async ({ page }) => {
    await submitWith(page, plan);
    await openBudget(page);
    await expect(page.getByTestId("compare").locator("th[data-mode='traditional'] .pill")).toHaveText(estimatorCopy.compare.current);
  });

  test("tags and pills fit 320px with no sideways scroll", async ({ page }) => {
    await page.setViewportSize({ width: 320, height: 800 });
    await submitWith(page, plan, true);
    await openTasks(page);
    expect(await page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth)).toBeLessThanOrEqual(0);
  });
});
