import { expect, test, type Page } from "@playwright/test";
import plan from "../fixtures/plan.json";
import { estimatorCopy } from "../../lib/content";
import { roleTotals, toBars } from "../../lib/timeline";

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

async function openTab2(page: Page) {
  await page.getByRole("tab", { name: "Task table" }).click();
  await expect(page.getByRole("region", { name: estimatorCopy.tasks.regionLabel })).toBeVisible();
}

test("tab 2 shows role chips, phase subtotals and the grand total", async ({ page }) => {
  await showResults(page);
  await openTab2(page);
  const p = plan.plan;
  const c = estimatorCopy.tasks;

  const expected = roleTotals(p.phases.flatMap((ph) => ph.tasks)).map((r) => c.chip(r.role, r.hours));
  const chips = page.getByRole("list", { name: c.roleChipsLabel }).getByRole("listitem");
  await expect(chips).toHaveText(expected);

  const bodies = page.getByTestId("phase-body");
  await expect(bodies).toHaveCount(p.phases.length);
  for (const [i, ph] of p.phases.entries()) {
    const body = bodies.nth(i);
    await expect(body.getByRole("rowheader", { name: ph.name })).toBeVisible();
    await expect(body.locator("tr")).toHaveCount(ph.tasks.length + 2);
    const sum = ph.tasks.reduce((n, t) => n + t.hours, 0);
    await expect(body.getByRole("row", { name: new RegExp(`^${c.subtotal}`) }).getByRole("cell")).toHaveText(String(sum));
  }
  await expect(
    page.getByRole("table").getByRole("row", { name: new RegExp(`^${c.total}`) }).getByRole("cell"),
  ).toHaveText(String(p.totalHours));
});

test("tab 2 does not scroll the page at 320px and its region is focusable", async ({ page }) => {
  await page.setViewportSize({ width: 320, height: 800 });
  await showResults(page);
  await openTab2(page);
  const overflow = await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth);
  expect(overflow).toBeLessThanOrEqual(0);
  const region = page.getByRole("region", { name: estimatorCopy.tasks.regionLabel });
  const scrolls = await region.evaluate((el) => el.scrollWidth > el.clientWidth);
  expect(scrolls).toBe(true);
  await region.focus();
  await expect(region).toBeFocused();
});

test("repeated phase names render two tab 2 groups without key warnings", async ({ page }) => {
  const logs: string[] = [];
  page.on("console", (m) => logs.push(m.text()));
  const [a, b] = plan.plan.phases;
  const dup = { ...plan, plan: { ...plan.plan, title: "Duplicate names", phases: [a, { ...b, name: a.name, startDay: 2 }] } };
  await showResults(page, dup, "Duplicate names");
  await openTab2(page);
  await expect(page.getByTestId("phase-body")).toHaveCount(2);
  expect(logs.filter((l) => /same key|unique "key"/i.test(l))).toEqual([]);
});

test("tab 2 keeps half-hour totals consistent", async ({ page }) => {
  const [a, b] = plan.plan.phases;
  const half = {
    ...plan,
    plan: {
      ...plan.plan,
      title: "Half hours",
      totalHours: 18.5,
      phases: [
        { ...a, tasks: [{ task: "One", role: "Backend", hours: 6 }, { task: "Two", role: "QA", hours: 4.5 }] },
        { ...b, tasks: [{ task: "Three", role: "Backend", hours: 3.5 }, { task: "Four", role: "QA", hours: 4.5 }] },
      ],
    },
  };
  await showResults(page, half, "Half hours");
  await openTab2(page);
  const c = estimatorCopy.tasks;
  const num = async (loc: ReturnType<Page["locator"]>) => parseFloat((await loc.innerText()).trim());
  const subs = page.getByTestId("phase-body").getByRole("row", { name: new RegExp(`^${c.subtotal}`) }).getByRole("cell");
  const s1 = await num(subs.nth(0));
  const s2 = await num(subs.nth(1));
  expect([s1, s2]).toEqual([10.5, 8]);
  const foot = await num(page.getByRole("table").getByRole("row", { name: new RegExp(`^${c.total}`) }).getByRole("cell"));
  expect(foot).toBe(s1 + s2);
  expect(foot).toBe(18.5);
  const chipTexts = await page.getByRole("list", { name: c.roleChipsLabel }).getByRole("listitem").allInnerTexts();
  const chipSum = chipTexts.reduce((n, t) => n + parseFloat(/([\d.]+) h$/.exec(t)![1]), 0);
  expect(chipSum).toBe(foot);
});
