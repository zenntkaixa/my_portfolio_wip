import { expect, test } from "@playwright/test";

// The CSP must not block the theme bootstrap, Next's inline scripts or the Turnstile widget.
test("home page raises no CSP violations", async ({ page }) => {
  const violations: string[] = [];
  page.on("console", (m) => {
    if (/content security policy/i.test(m.text())) violations.push(m.text());
  });
  await page.addInitScript(() => {
    document.addEventListener("securitypolicyviolation", (e) => {
      console.log(`CSP-VIOLATION ${e.violatedDirective} ${e.blockedURI}`);
    });
  });
  page.on("console", (m) => {
    if (m.text().startsWith("CSP-VIOLATION")) violations.push(m.text());
  });
  const res = await page.goto("/");
  expect(res?.headers()["content-security-policy"]).toContain("frame-ancestors 'none'");
  await expect
    .poll(() => page.frames().some((f) => f.url().includes("challenges.cloudflare.com")), { timeout: 15_000 })
    .toBe(true);
  await page.waitForTimeout(1000);
  expect(violations).toEqual([]);
});
