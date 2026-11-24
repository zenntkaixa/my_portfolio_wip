import { expect, test } from "./fakeTurnstile";
import { howItsBuilt as h } from "../../lib/content";

// No DATABASE_URL in e2e, so the live-numbers block must be absent.
test.beforeEach(async ({ page }) => {
  await page.goto("/");
});

const summary = (page: import("@playwright/test").Page) => page.getByText(h.summary, { exact: true });

test("closed by default, opens with Enter and Space", async ({ page }) => {
  const details = page.locator("details.built");
  await expect(details).not.toHaveAttribute("open", "");
  await expect(page.getByRole("heading", { name: h.pathTitle })).toBeHidden();
  await summary(page).focus();
  await page.keyboard.press("Enter");
  await expect(details).toHaveAttribute("open", "");
  await page.keyboard.press("Space");
  await expect(details).not.toHaveAttribute("open", "");
  await page.keyboard.press("Space");
  await expect(details).toHaveAttribute("open", "");
});

test("shows the pipeline, the eval table and the ADR links; no live stats without a database", async ({ page }) => {
  await summary(page).click();
  const steps = page.getByRole("list").filter({ has: page.getByText(h.path[0].step) }).getByRole("listitem");
  await expect(steps).toHaveCount(h.path.length);
  for (const p of h.path) await expect(page.getByText(p.step, { exact: true })).toBeVisible();
  const table = page.getByRole("table").filter({ hasText: h.evalRows[0][0] });
  await expect(table.getByRole("row")).toHaveCount(h.evalRows.length + 1);
  for (const [k, v] of h.evalRows) await expect(table.getByRole("row").filter({ hasText: k }).getByRole("cell", { name: v, exact: true })).toBeVisible();
  for (const l of h.links) {
    await expect(page.getByRole("link", { name: `${l.label} (opens in a new tab)` })).toHaveAttribute("href", l.url);
  }
  await expect(page.getByRole("heading", { name: h.statsTitle })).toHaveCount(0);
});

test("no horizontal scroll at 320px when open", async ({ page }) => {
  await page.setViewportSize({ width: 320, height: 700 });
  await summary(page).click();
  await expect(page.getByRole("heading", { name: h.evalTitle })).toBeVisible();
  const overflow = await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth);
  expect(overflow).toBeLessThanOrEqual(0);
});

test("the request flow names both colours and marks the one model step (G1)", async ({ page }) => {
  await page.getByText(h.summary).click();
  const flow = page.getByTestId("flow");
  await expect(flow.locator("li")).toHaveCount(h.path.length);
  await expect(flow.locator('li[data-kind="model"]')).toHaveText(/Claude Haiku/);
  await expect(flow.getByText(h.flowKey.model, { exact: true })).toBeVisible();
  await expect(flow.getByText(h.flowKey.code, { exact: true })).toBeVisible();
});
