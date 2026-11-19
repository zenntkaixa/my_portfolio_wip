import { expect, test, type Page } from "./fakeTurnstile";
import plan from "../fixtures/plan.json";
import { estimatorCopy } from "../../lib/content";

const FEATURE = "Add one-time code login with email delivery and rate limiting";

async function submit(page: Page) {
  const button = page.getByRole("button", { name: estimatorCopy.submit });
  await expect(button).toBeEnabled({ timeout: 15_000 });
  await button.click();
}

test("a kept plan is dimmed and labelled under an error banner", async ({ page }) => {
  let n = 0;
  await page.route("**/api/estimate", (route) =>
    ++n === 1 ? route.fulfill({ json: plan }) : route.fulfill({ status: 503, json: { error: "Busy." } }),
  );
  await page.goto("/");
  await page.getByLabel("Feature description").fill(FEATURE);
  await submit(page);
  await expect(page.getByRole("heading", { name: plan.plan.title })).toBeVisible();
  await expect(page.locator(".estimator__plan[data-kept]")).toHaveCount(0);
  await submit(page);
  await expect(page.locator(".estimator__banner")).toBeVisible();
  await expect(page.getByText(estimatorCopy.previousPlan(FEATURE))).toBeVisible();
  await expect(page.locator(".estimator__plan[data-kept]")).toHaveCount(1);
});

test("no kept-plan label on the example when an error shows", async ({ page }) => {
  await page.route("**/api/estimate", (route) => route.fulfill({ status: 503, json: { error: "Busy." } }));
  await page.goto("/");
  await page.getByLabel("Feature description").fill(FEATURE);
  await submit(page);
  await expect(page.locator(".estimator__banner")).toBeVisible();
  await expect(page.getByText("Previous plan for")).toHaveCount(0);
});

test("a chip keeps typed text for Undo, which restores it and focus", async ({ page }) => {
  await page.goto("/");
  const field = page.getByLabel("Feature description");
  await field.fill("My own feature idea, typed by hand");
  await page.locator(".estimator__chip").first().click();
  await expect(field).not.toHaveValue("My own feature idea, typed by hand");
  await page.getByRole("button", { name: estimatorCopy.undo.button }).click();
  await expect(field).toHaveValue("My own feature idea, typed by hand");
  await expect(field).toBeFocused();
  await expect(page.getByRole("button", { name: estimatorCopy.undo.button })).toHaveCount(0);
});

test("a second chip still lets Undo bring back the typed text", async ({ page }) => {
  await page.goto("/");
  await expect(page.getByRole("group", { name: "Example features" })).toHaveAttribute("data-ready", "");
  const field = page.getByLabel("Feature description");
  await field.fill("My own feature idea, typed by hand");
  await page.locator(".estimator__chip").nth(0).click();
  await page.locator(".estimator__chip").nth(1).click();
  await page.getByRole("button", { name: estimatorCopy.undo.button }).click();
  await expect(field).toHaveValue("My own feature idea, typed by hand");
});

test("no Undo when the field was empty, and typing dismisses it", async ({ page }) => {
  await page.goto("/");
  const field = page.getByLabel("Feature description");
  await page.locator(".estimator__chip").first().click();
  await expect(page.getByRole("button", { name: estimatorCopy.undo.button })).toHaveCount(0);
  await field.fill("Something typed by hand here");
  await page.locator(".estimator__chip").nth(1).click();
  await expect(page.getByRole("button", { name: estimatorCopy.undo.button })).toBeVisible();
  await field.press("End");
  await field.pressSequentially("x");
  await expect(page.getByRole("button", { name: estimatorCopy.undo.button })).toHaveCount(0);
});

test("cached plans say so; fresh ones do not", async ({ page }) => {
  let n = 0;
  await page.route("**/api/estimate", (route) => route.fulfill({ json: ++n === 1 ? plan : { ...plan, cached: true } }));
  await page.goto("/");
  await page.getByLabel("Feature description").fill(FEATURE);
  await submit(page);
  await expect(page.getByRole("heading", { name: plan.plan.title })).toBeVisible();
  await expect(page.getByText(estimatorCopy.cachedNote)).toHaveCount(0);
  await submit(page);
  await expect(page.getByText(estimatorCopy.cachedNote)).toBeVisible();
});

test("short input gets a text hint tied to the field", async ({ page }) => {
  await page.goto("/");
  const field = page.getByLabel("Feature description");
  await expect(page.locator("#feature-count")).toContainText("at least 20 characters");
  await field.fill("too short");
  await expect(page.locator("#feature-count")).toContainText("Add a few more words (20 characters minimum).");
  await expect(field).toHaveAccessibleDescription(/Add a few more words/);
  await field.fill(FEATURE);
  await expect(page.locator("#feature-count")).not.toContainText("Add a few more words");
});
