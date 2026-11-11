import { expect, test, type Page } from "@playwright/test";
import plan from "../fixtures/plan.json";

// The real API is never called. Turnstile uses Cloudflare's always-pass test key (see playwright.config.ts).

const FEATURE = "Add one-time code login with email delivery and rate limiting";

test("widget renders and a valid feature plus token enables submit", async ({
  page,
}) => {
  await page.goto("/");
  await page.getByLabel("Feature description").fill(FEATURE);
  // The iframe sits in a closed shadow root, so assert on the page frame instead.
  await expect
    .poll(
      () =>
        page
          .frames()
          .some((f) => f.url().includes("challenges.cloudflare.com")),
      { timeout: 15_000 },
    )
    .toBe(true);
  await expect(
    page.getByRole("button", { name: "Estimate this feature" }),
  ).toBeEnabled({ timeout: 15_000 });
});

test("submit is disabled after a response, then re-enabled by the new token", async ({
  page,
}) => {
  await page.route("**/api/estimate", (route) => route.fulfill({ json: plan }));
  await page.goto("/");
  await page.getByLabel("Feature description").fill(FEATURE);
  const submit = page.getByRole("button", { name: "Estimate this feature" });
  await expect(submit).toBeEnabled({ timeout: 15_000 });
  await submit.click();
  await expect(
    page.getByRole("heading", { name: plan.plan.title }),
  ).toBeVisible();
  await expect(submit).toBeEnabled({ timeout: 15_000 }); // fresh token after reset
});

test("blocked Turnstile script shows the failure message and keeps submit disabled", async ({
  page,
}) => {
  await page.route("https://challenges.cloudflare.com/**", (route) =>
    route.abort(),
  );
  await page.goto("/");
  await page.getByLabel("Feature description").fill(FEATURE);
  await expect(
    page.getByRole("status").filter({ hasText: "human check couldn't load" }),
  ).toBeVisible({
    timeout: 15_000,
  });
  await expect(
    page.getByRole("button", { name: "Estimate this feature" }),
  ).toBeDisabled();
});

test("theme change re-renders the widget and a new token enables submit", async ({
  page,
}) => {
  await page.goto("/");
  await page.getByLabel("Feature description").fill(FEATURE);
  const submit = page.getByRole("button", { name: "Estimate this feature" });
  await expect(submit).toBeEnabled({ timeout: 15_000 });
  await page.evaluate(() => {
    const el = document.documentElement;
    el.dataset.theme = el.dataset.theme === "dark" ? "light" : "dark";
  });
  await expect
    .poll(
      () =>
        page
          .frames()
          .some((f) => f.url().includes("challenges.cloudflare.com")),
      { timeout: 15_000 },
    )
    .toBe(true);
  await expect(submit).toBeEnabled({ timeout: 15_000 });
});

const isTurnstile = (u: string) => u.includes("challenges.cloudflare.com");

test.describe("lazy load: portrait phone", () => {
  // At 390x844 the estimator is in the first viewport (CSS order puts it after the hero), so the
  // script still loads, but only after hydration: never in the server HTML or the critical path.
  test.use({ viewport: { width: 390, height: 844 } });

  test("server HTML has no Turnstile script or preload; the client injects it once", async ({
    page,
  }) => {
    const html = await (await page.request.get("/")).text();
    expect(isTurnstile(html), "Turnstile must not be in the server-rendered HTML").toBe(false);

    await page.goto("/");
    await page.getByLabel("Feature description").fill(FEATURE);
    await expect(page.getByRole("button", { name: "Estimate this feature" })).toBeEnabled({
      timeout: 15_000,
    });
    expect(await page.locator('script[src*="challenges.cloudflare.com"]').count()).toBe(1);
    expect(await page.locator('link[rel="preload"][href*="challenges.cloudflare.com"]').count()).toBe(0);
  });
});

test.describe("lazy load: estimator below the fold", () => {
  // Landscape phone: the 6-column layout puts the estimator below 390px + the 200px rootMargin.
  test.use({ viewport: { width: 844, height: 390 } });

  async function openWithEstimatorOffscreen(page: Page): Promise<string[]> {
    const requests: string[] = [];
    page.on("request", (r) => requests.push(r.url()));
    await page.goto("/");
    await page.waitForLoadState("networkidle");
    const box = await page.locator("#estimator").boundingBox();
    expect(box?.y ?? 0, "estimator must start below 390px + 200px rootMargin").toBeGreaterThan(590);
    expect(requests.filter(isTurnstile)).toEqual([]);
    expect(await page.locator('script[src*="challenges.cloudflare.com"]').count()).toBe(0);
    return requests;
  }

  test("focusing the form loads the script and enables submit", async ({ page }) => {
    const requests = await openWithEstimatorOffscreen(page);
    await page.getByLabel("Feature description").fill(FEATURE);
    await expect.poll(() => requests.some(isTurnstile), { timeout: 15_000 }).toBe(true);
    await expect(page.getByRole("button", { name: "Estimate this feature" })).toBeEnabled({
      timeout: 15_000,
    });
    expect(await page.locator('script[src*="challenges.cloudflare.com"]').count()).toBe(1);
  });

  test("scrolling the estimator near the viewport loads the script", async ({ page }) => {
    const requests = await openWithEstimatorOffscreen(page);
    await page.evaluate(() => document.getElementById("estimator")?.scrollIntoView());
    await expect.poll(() => requests.some(isTurnstile), { timeout: 15_000 }).toBe(true);
    expect(await page.locator('script[src*="challenges.cloudflare.com"]').count()).toBe(1);
  });
});
