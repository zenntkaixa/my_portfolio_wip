import { expect, test } from "./fakeTurnstile";
import plan from "../fixtures/plan.json";

// The real API is never called: /api/estimate is intercepted in every test.

test("happy path shows both tabs", async ({ page }) => {
  await page.route("**/api/estimate", (route) => route.fulfill({ json: plan }));
  await page.goto("/");
  await page.getByRole("button", { name: /one-time code/ }).click();
  const submit = page.getByRole("button", { name: "Estimate this feature" });
  await expect(submit).toBeEnabled(); // enabled once the fake Turnstile token arrives
  await submit.click();

  await expect(page.getByRole("heading", { name: plan.plan.title })).toBeVisible();
  await page.getByRole("tab", { name: "Task table" }).click();
  await expect(page.getByRole("cell", { name: /OTP generate and verify endpoints/ })).toBeVisible();
});

test("rate limit shows the server message", async ({ page }) => {
  await page.route("**/api/estimate", (route) =>
    route.fulfill({ status: 429, json: { error: "You've used 5 estimates this hour. Try again in 40 minutes." } }),
  );
  await page.goto("/");
  await page.getByRole("button", { name: /monthly PDF/ }).click();
  const submit = page.getByRole("button", { name: "Estimate this feature" });
  await expect(submit).toBeEnabled({ timeout: 15_000 });
  await submit.click();
  // Filter by text: Next.js also renders an empty role="alert" route announcer.
  await expect(page.getByRole("alert").filter({ hasText: "estimates this hour" })).toBeVisible();
});

// TODO(M3, qa-tester): 400 inline validation, 403 Turnstile failure, 502 retry button, keyboard tab navigation.
