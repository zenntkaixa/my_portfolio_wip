import AxeBuilder from "@axe-core/playwright";
import { expect, test, type Page } from "./fakeTurnstile";
import plan from "../fixtures/plan.json";
import { estimatorCopy } from "../../lib/content";

// T7 (sync review 2026-11-25-0235): in the dark theme the budget chart, the request flow and the refine form
// meet AA text contrast (axe color-contrast, computed from real styles). The real API is never called.

async function contrast(page: Page, scope: string) {
  await page.evaluate(() => Promise.all(document.getAnimations().filter((a) => a.timeline === document.timeline).map((a) => a.finished.catch(() => undefined))));
  // axe cannot compute contrast through the blueprint grid's background image (same workaround as a11y.spec.ts).
  await page.addStyleTag({ content: ".tile--estimator { background-image: none !important; }" });
  const { violations, incomplete } = await new AxeBuilder({ page }).include(scope).withRules(["color-contrast"]).analyze();
  const summary = violations.flatMap((v) => v.nodes.map((n) => `${n.target.join(" ")}: ${(n.failureSummary ?? "").replace(/\s+/g, " ")}`)).join("\n");
  expect(violations, `contrast violations in ${scope}:\n${summary}`).toEqual([]);
  expect(incomplete, `unchecked text in ${scope}`).toEqual([]);
}

test.beforeEach(async ({ page }) => {
  await page.addInitScript(() => localStorage.setItem("theme", "dark"));
});

async function submit(page: Page) {
  await page.goto("/");
  await expect(page.locator("html")).toHaveAttribute("data-theme", "dark");
  await page.getByLabel("Feature description").fill("Add one-time code login with email delivery and rate limiting");
  const button = page.getByRole("button", { name: estimatorCopy.submit });
  await expect(button).toBeEnabled({ timeout: 15_000 });
  await button.click();
}

test("dark: the request flow shown while waiting is readable", async ({ page }) => {
  let release!: () => void;
  const gate = new Promise<void>((r) => (release = r));
  await page.route("**/api/estimate", async (route) => {
    await gate;
    await route.fulfill({ json: plan });
  });
  await submit(page);
  const flow = page.getByTestId("flow-live");
  await expect(flow).toBeVisible();
  await contrast(page, '[data-testid="flow-live"]');
  release();
  await expect(page.getByRole("heading", { name: plan.scope.title })).toBeVisible();
});

test("dark: budget chart and table, and the refine form, are readable", async ({ page }) => {
  await page.route("**/api/estimate", (route) => route.fulfill({ json: plan }));
  await submit(page);
  await page.getByRole("tab", { name: estimatorCopy.tabBudget }).click();
  await expect(page.getByTestId("build-bar")).toBeVisible();
  await contrast(page, '[data-testid="budget"]');
  await expect(page.getByRole("region", { name: estimatorCopy.refine.heading })).toBeVisible();
  await contrast(page, ".refine");
});
