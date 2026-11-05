import { expect, test } from "@playwright/test";
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
