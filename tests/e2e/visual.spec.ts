import { expect, test } from "@playwright/test";

// Used by the /visual-check skill. Saves screenshots for Claude to inspect; asserts nothing.
// Waits on explicit readiness signals rather than "networkidle", which stopped settling on this
// page after the Next.js 16 upgrade (root cause not identified; Playwright discourages it anyway).
const widths = [390, 1024, 1440];
const themes = ["light", "dark"] as const;
const isTurnstile = (url: string) => url.startsWith("https://challenges.cloudflare.com/");

for (const width of widths) {
  for (const theme of themes) {
    test(`screenshot ${width} ${theme}`, async ({ page }) => {
      await page.setViewportSize({ width, height: 900 });
      await page.addInitScript((t) => localStorage.setItem("theme", t), theme);
      await page.goto("/");
      await page.evaluate(() => document.fonts.ready);
      // Turnstile is the last thing to appear. Wait for its iframe to load, or for the
      // "not configured" note when a reused dev server has no NEXT_PUBLIC_TURNSTILE_SITE_KEY.
      const notConfigured = page.getByRole("note").filter({ hasText: "Human check not configured" });
      await expect
        .poll(async () => page.frames().some((f) => isTurnstile(f.url())) || (await notConfigured.count()) > 0, {
          timeout: 15_000,
        })
        .toBe(true);
      await page.frames().find((f) => isTurnstile(f.url()))?.waitForLoadState("load");
      await page.screenshot({ path: `tests/e2e/__screenshots__/latest/home-${width}-${theme}.png`, fullPage: true });
    });
  }
}
