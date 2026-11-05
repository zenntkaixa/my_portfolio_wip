import { expect, test, type Page } from "@playwright/test";
import plan from "../fixtures/plan.json";
import { estimatorCopy } from "../../lib/content";
import { toBars } from "../../lib/timeline";

// The real API is never called: /api/estimate is intercepted.

async function showResults(page: Page, body: unknown = plan, title = plan.plan.title) {
  await page.route("**/api/estimate", (route) => route.fulfill({ json: body }));
  await page.goto("/");
  await page.getByLabel("Feature description").fill("Add one-time code login with email delivery and rate limiting");
  const submit = page.getByRole("button", { name: estimatorCopy.submit });
  await expect(submit).toBeEnabled({ timeout: 15_000 });
  await submit.click();
  await expect(page.getByRole("heading", { name: title })).toBeVisible();
}

test("tab 1 shows summary, timeline bars, cards, assumptions and risks", async ({ page }) => {
  await showResults(page);
  const p = plan.plan;
  const bars = toBars(p.phases, p.totalDays);

  const timeline = page.getByRole("list", { name: estimatorCopy.timelineLabel(p.totalDays) });
  await expect(timeline.getByRole("listitem")).toHaveCount(p.phases.length);
  const barEls = timeline.getByTestId("timeline-bar");
  await expect(barEls).toHaveCount(bars.length);
  for (const [i, b] of bars.entries()) {
    const row = timeline.getByRole("listitem").nth(i);
    await expect(row).toContainText(b.name);
    await expect(row).toContainText(b.label);
    const style = (await barEls.nth(i).getAttribute("style")) ?? "";
    expect(parseFloat(/--left:\s*([\d.]+)%/.exec(style)![1])).toBeCloseTo(b.leftPct, 2);
    expect(parseFloat(/--width:\s*([\d.]+)%/.exec(style)![1])).toBeCloseTo(b.widthPct, 2);
  }

  await expect(page.getByText(estimatorCopy.summary.hoursValue(p.totalHours))).toBeVisible();
  await expect(page.getByText(estimatorCopy.summary.weeksValue(p.calendarWeeks))).toBeVisible();
  await expect(page.getByTestId("summary").getByText(p.confidence, { exact: true })).toBeVisible();
  await expect(page.getByRole("heading", { level: 4, name: p.phases[0].name })).toBeVisible();
  const card = page.getByTestId("phase-card").first();
  await expect(card).toContainText(estimatorCopy.taskCount(p.phases[0].tasks.length));
  await expect(card).toContainText(estimatorCopy.duration(p.phases[0].durationDays));

  const assumptions = page.getByRole("region", { name: estimatorCopy.assumptionsHeading });
  await expect(assumptions.getByRole("listitem")).toHaveCount(p.assumptions.length);
  const risks = page.getByRole("region", { name: estimatorCopy.risksHeading });
  await expect(risks.getByRole("listitem")).toHaveCount(p.risks.length);
});

test("tab 1 does not scroll horizontally at 320px", async ({ page }) => {
  await page.setViewportSize({ width: 320, height: 800 });
  await showResults(page);
  const overflow = await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth);
  expect(overflow).toBeLessThanOrEqual(0);
});

test("repeated phase names render every bar and card without duplicate-key warnings", async ({ page }) => {
  const logs: string[] = [];
  page.on("console", (m) => logs.push(m.text()));
  const [a, b] = plan.plan.phases;
  const dup = { ...plan, plan: { ...plan.plan, title: "Duplicate names", phases: [a, { ...b, name: a.name, startDay: 2 }], assumptions: ["Same", "Same"], risks: ["Same", "Same"] } };
  await showResults(page, dup, "Duplicate names");
  await expect(page.getByTestId("timeline-bar")).toHaveCount(2);
  await expect(page.getByTestId("phase-card")).toHaveCount(2);
  await expect(page.getByRole("region", { name: estimatorCopy.risksHeading }).getByRole("listitem")).toHaveCount(2);
  expect(logs.filter((l) => /same key|unique "key"/i.test(l))).toEqual([]);
});
