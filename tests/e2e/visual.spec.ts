import { expect, test } from "@playwright/test";

// Used by the /visual-check skill. Saves screenshots for Claude to inspect; asserts nothing.
// Waits on explicit readiness signals rather than "networkidle", which stopped settling on this
// page after the Next.js 16 upgrade (root cause not identified; Playwright discourages it anyway).
//
// Env knobs (all optional) keep screenshot cost down:
//   VISUAL_WIDTHS="390,1440"            widths to shoot (default 390,1024,1440)
//   VISUAL_THEMES="light"               themes to shoot (default light,dark)
//   VISUAL_TILES="#contact,.tile--now"  CSS selectors: save one element crop per matching tile
//                                       instead of the full page
const list = (v: string | undefined) => (v ?? "").split(",").map((s) => s.trim()).filter(Boolean);
const widths = list(process.env.VISUAL_WIDTHS).map(Number);
if (widths.length === 0) widths.push(390, 1024, 1440);
const allThemes = ["light", "dark"] as const;
const wanted = list(process.env.VISUAL_THEMES);
const themes = wanted.length ? allThemes.filter((t) => wanted.includes(t)) : allThemes;
const tiles = list(process.env.VISUAL_TILES);
const fileSafe = (sel: string) => sel.replace(/[^a-z0-9]+/gi, "-").replace(/(^-|-$)/g, "");
const isTurnstile = (url: string) => url.startsWith("https://challenges.cloudflare.com/");

// Reduced motion turns off the tile load animation, so screenshots never catch a mid-fade.
test.use({ reducedMotion: "reduce" });

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
      const dir = "tests/e2e/__screenshots__/latest";
      if (tiles.length === 0) {
        await page.screenshot({ path: `${dir}/home-${width}-${theme}.png`, fullPage: true });
        return;
      }
      for (const sel of tiles) {
        const matches = page.locator(sel);
        const count = await matches.count();
        expect(count, `VISUAL_TILES selector matched nothing: ${sel}`).toBeGreaterThan(0);
        for (let i = 0; i < count; i++) {
          const suffix = count > 1 ? `-${i + 1}` : "";
          await matches.nth(i).screenshot({ path: `${dir}/tile-${fileSafe(sel)}${suffix}-${width}-${theme}.png` });
        }
      }
    });
  }
}
