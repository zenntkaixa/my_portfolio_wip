import { test } from "@playwright/test";

// Used by the /visual-check skill. Saves screenshots for Claude to inspect; asserts nothing.
const widths = [390, 1024, 1440];
const themes = ["light", "dark"] as const;

for (const width of widths) {
  for (const theme of themes) {
    test(`screenshot ${width} ${theme}`, async ({ page }) => {
      await page.setViewportSize({ width, height: 900 });
      await page.addInitScript((t) => localStorage.setItem("theme", t), theme);
      await page.goto("/");
      await page.waitForLoadState("networkidle");
      await page.screenshot({ path: `tests/e2e/__screenshots__/latest/home-${width}-${theme}.png`, fullPage: true });
    });
  }
}
