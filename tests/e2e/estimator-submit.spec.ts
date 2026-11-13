import { expect, test, type Page } from "./fakeTurnstile";
import plan from "../fixtures/plan.json";
import { estimatorCopy } from "../../lib/content";

// The real API is never called: /api/estimate is intercepted in every test.
// Turnstile is faked (fakeTurnstile.ts).

const FEATURE = "Add one-time code login with email delivery and rate limiting";

async function prepare(page: Page) {
  await page.goto("/");
  await page.getByLabel("Feature description").fill(FEATURE);
  const submit = page.getByRole("button", { name: estimatorCopy.submit });
  await expect(submit).toBeEnabled({ timeout: 15_000 });
  return submit;
}

const banner = (page: Page, text: string | RegExp) =>
  page.getByRole("alert").filter({ hasText: text });

test("success moves focus to the results heading and shows the footer note", async ({ page }) => {
  await page.route("**/api/estimate", (route) => route.fulfill({ json: plan }));
  const submit = await prepare(page);
  await submit.click();
  const heading = page.getByRole("heading", { name: plan.plan.title });
  await expect(heading).toBeFocused();
  await expect(page.getByText(estimatorCopy.footerNote)).toBeVisible();
});

test("slow response shows the status line and disables the form", async ({ page }) => {
  await page.route("**/api/estimate", async (route) => {
    await new Promise((r) => setTimeout(r, 1500));
    await route.fulfill({ json: plan });
  });
  const submit = await prepare(page);
  await submit.click();
  await expect(page.getByRole("status").filter({ hasText: estimatorCopy.planning })).toBeVisible();
  await expect(page.getByLabel("Feature description")).toBeDisabled();
  await expect(submit).toBeDisabled();
  await expect(page.getByRole("region", { name: "Estimate results" })).toHaveAttribute("aria-busy", "true");
  await expect(page.getByRole("heading", { name: plan.plan.title })).toBeVisible();
  await expect(page.getByLabel("Feature description")).toBeEnabled();
});

test("400 shows the message inline under the textarea", async ({ page }) => {
  await page.route("**/api/estimate", (route) =>
    route.fulfill({ status: 400, json: { error: "Describe the feature in at least 20 characters." } }),
  );
  const submit = await prepare(page);
  await submit.click();
  const message = page.getByRole("alert").filter({ hasText: "at least 20 characters" });
  await expect(message).toBeVisible();
  await expect(page.getByLabel("Feature description")).toHaveAttribute("aria-describedby", /feature-error/);
  await expect(page.getByLabel("Feature description")).toBeFocused();
});

test("403 shows a banner", async ({ page }) => {
  await page.route("**/api/estimate", (route) =>
    route.fulfill({ status: 403, json: { error: "The human check failed. Please try again." } }),
  );
  const submit = await prepare(page);
  await submit.click();
  await expect(banner(page, "human check failed")).toBeVisible();
  await expect(banner(page, "human check failed")).toBeFocused();
});

test("422 shows the server sentence", async ({ page }) => {
  await page.route("**/api/estimate", (route) =>
    route.fulfill({ status: 422, json: { error: "That reads like a recipe, not a software feature." } }),
  );
  const submit = await prepare(page);
  await submit.click();
  await expect(banner(page, "That reads like a recipe, not a software feature.")).toBeVisible();
});

test("429 disables submit with a countdown, then re-enables", async ({ page }) => {
  await page.route("**/api/estimate", (route) =>
    route.fulfill({ status: 429, headers: { "Retry-After": "3" }, json: { error: "Too many estimates this hour." } }),
  );
  const submit = await prepare(page);
  await submit.click();
  await expect(banner(page, "Too many estimates")).toBeVisible();
  const waiting = page.getByRole("button", { name: /^Try again in \d+s$/ });
  await expect(waiting).toBeDisabled();
  // Fresh token plus elapsed countdown re-enables the original button.
  await expect(page.getByRole("button", { name: estimatorCopy.submit })).toBeEnabled({ timeout: 20_000 });
});

test("502 shows Retry, which re-submits and succeeds", async ({ page }) => {
  let calls = 0;
  await page.route("**/api/estimate", (route) => {
    calls += 1;
    return calls === 1
      ? route.fulfill({ status: 502, json: { error: "The model returned something unusable." } })
      : route.fulfill({ json: plan });
  });
  const submit = await prepare(page);
  await submit.click();
  await expect(banner(page, "unusable")).toBeVisible();
  const retry = page.getByRole("button", { name: estimatorCopy.retry });
  await expect(retry).toBeEnabled(); // needs a fresh Turnstile token
  await retry.click();
  await expect(page.getByRole("heading", { name: plan.plan.title })).toBeVisible();
  expect(calls).toBe(2);
});

test("non-JSON 504 uses status-based copy, not the network message", async ({ page }) => {
  await page.route("**/api/estimate", (route) =>
    route.fulfill({ status: 504, contentType: "text/html", body: "<html><body>Gateway Timeout</body></html>" }),
  );
  const submit = await prepare(page);
  await submit.click();
  await expect(banner(page, estimatorCopy.fallback[504])).toBeVisible();
  await expect(page.getByText(estimatorCopy.networkError)).toHaveCount(0);
});

test("aborted request shows the network banner with Retry", async ({ page }) => {
  await page.route("**/api/estimate", (route) => route.abort());
  const submit = await prepare(page);
  await submit.click();
  await expect(banner(page, estimatorCopy.networkError)).toBeVisible();
  const retry = page.getByRole("button", { name: /^(Try again|Waiting for human check…)$/ });
  await expect(retry).toBeVisible();
  await expect(page.getByRole("button", { name: estimatorCopy.retry })).toBeEnabled({ timeout: 15_000 });
});

test("a malformed plan is treated as a 502-style error", async ({ page }) => {
  await page.route("**/api/estimate", (route) => route.fulfill({ json: { plan: { title: "x" } } }));
  const submit = await prepare(page);
  await submit.click();
  await expect(banner(page, estimatorCopy.badPlan)).toBeVisible();
});

test("no console errors or page errors on load and a mocked happy-path submit", async ({ page }) => {
  const errors: string[] = [];
  page.on("console", (msg) => {
    if (msg.type() === "error") errors.push(`console: ${msg.text()}`);
  });
  page.on("pageerror", (err) => errors.push(`pageerror: ${err.message}`));

  await page.route("**/api/estimate", (route) => route.fulfill({ json: plan }));
  const submit = await prepare(page);
  await submit.click();
  await expect(page.getByRole("heading", { name: plan.plan.title })).toBeFocused();

  expect(errors).toEqual([]);
});
