import AxeBuilder from "@axe-core/playwright";
import { expect, test, type Page } from "./fakeTurnstile";
import plan from "../fixtures/plan.json";
import { estimatorCopy } from "../../lib/content";

// axe-core scans (ADR-006) of the home page and the estimator states, in light and dark.
// The real API is never called: /api/estimate is intercepted. Turnstile is faked (fakeTurnstile.ts).

const TAGS = ["wcag2a", "wcag2aa", "wcag21a", "wcag21aa", "wcag22aa"];
const FEATURE = "Add one-time code login with email delivery and rate limiting";
const themes = ["light", "dark"] as const;
type Theme = (typeof themes)[number];

async function scan(page: Page) {
  // The fake Turnstile renders nothing, so there is no widget iframe to exclude.
  const { violations } = await new AxeBuilder({ page }).withTags(TAGS).analyze();
  const summary = violations
    .flatMap((v) =>
      v.nodes.map((n) => `${v.id} [${v.impact}] ${n.target.join(" ")}: ${(n.failureSummary ?? v.help).replace(/\s+/g, " ")}`),
    )
    .join("\n");
  expect(violations, `axe violations:\n${summary}`).toEqual([]);
}

async function open(page: Page, theme: Theme) {
  await page.addInitScript((t) => localStorage.setItem("theme", t), theme);
  await page.goto("/");
  await expect(page.locator("html")).toHaveAttribute("data-theme", theme);
}

async function submit(page: Page) {
  await page.getByLabel("Feature description").fill(FEATURE);
  const button = page.getByRole("button", { name: estimatorCopy.submit });
  await expect(button).toBeEnabled({ timeout: 15_000 });
  await button.click();
}

async function showResults(page: Page, theme: Theme) {
  await page.route("**/api/estimate", (route) => route.fulfill({ json: plan }));
  await open(page, theme);
  await submit(page);
  await expect(page.getByRole("heading", { name: plan.plan.title })).toBeVisible();
  // Let tile/result entry animations finish so axe sees final colours.
  await page.evaluate(() => Promise.all(document.getAnimations().map((a) => a.finished.catch(() => undefined))));
}

for (const theme of themes) {
  test.describe(`${theme} theme`, () => {
    test("home page on load", async ({ page }) => {
      await open(page, theme);
      await page.evaluate(() => Promise.all(document.getAnimations().map((a) => a.finished.catch(() => undefined))));
      await scan(page);
    });

    test("estimator results, tab 1", async ({ page }) => {
      await showResults(page, theme);
      await expect(page.getByRole("tab", { name: estimatorCopy.tabPhases })).toHaveAttribute("aria-selected", "true");
      await scan(page);
    });

    test("estimator results, tab 2", async ({ page }) => {
      await showResults(page, theme);
      await page.getByRole("tab", { name: estimatorCopy.tabTasks }).click();
      await expect(page.getByRole("tabpanel", { name: estimatorCopy.tabTasks })).toBeVisible();
      await scan(page);
    });

    test("403 error banner", async ({ page }) => {
      await page.route("**/api/estimate", (route) =>
        route.fulfill({ status: 403, json: { error: "The human check failed. Please try again." } }),
      );
      await open(page, theme);
      await submit(page);
      await expect(page.getByRole("alert").filter({ hasText: "human check failed" })).toBeVisible();
      await scan(page);
    });

    test("429 countdown", async ({ page }) => {
      await page.route("**/api/estimate", (route) =>
        route.fulfill({ status: 429, headers: { "Retry-After": "60" }, json: { error: "Too many estimates this hour." } }),
      );
      await open(page, theme);
      await submit(page);
      await expect(page.getByRole("alert").filter({ hasText: "Too many estimates" })).toBeVisible();
      await expect(page.getByRole("button", { name: /^Try again in \d+s$/ })).toBeDisabled();
      await scan(page);
    });
  });
}
