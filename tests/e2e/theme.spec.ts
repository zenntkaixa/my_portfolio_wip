import { expect, test, type Page } from "@playwright/test";

// Theme: no-flash bootstrap (inline script in app/layout.tsx), system fallback, live follow, icons.
// The real API is never called; these tests never submit the estimator.

// The --bg tokens from app/globals.css (#f2f4f8, #0d1424). Keep in sync with globals.css.
const BG = { light: "rgb(242, 244, 248)", dark: "rgb(13, 20, 36)" } as const;
const themes = ["light", "dark"] as const;
type Theme = (typeof themes)[number];
const other = (t: Theme): Theme => (t === "dark" ? "light" : "dark");

const toggleOf = (page: Page) => page.getByRole("button", { name: "Dark theme" });

/**
 * Emulates a prefers-color-scheme change and resolves once the page has dispatched it, so negative
 * checks are not racy. The listener is registered (and awaited) before emulating, otherwise the
 * change can land before the listener exists. ThemeToggle's listener was attached earlier, so it
 * has run by the time ours fires; the rAF lets React commit.
 */
async function emulateSchemeAndWait(page: Page, scheme: Theme) {
  await page.evaluate(() => {
    const w = window as Window & { __schemeChanged?: Promise<void> };
    w.__schemeChanged = new Promise<void>((resolve) => {
      window
        .matchMedia("(prefers-color-scheme: dark)")
        .addEventListener("change", () => requestAnimationFrame(() => resolve()), { once: true });
    });
  });
  await page.emulateMedia({ colorScheme: scheme });
  await page.evaluate(() => (window as Window & { __schemeChanged?: Promise<void> }).__schemeChanged);
}

for (const theme of themes) {
  test(`no flash: bootstrap sets ${theme} before React runs`, async ({ page }) => {
    // Block every Next.js JS chunk so React never hydrates. The bootstrap is inline, so it still runs.
    await page.route(/\/_next\/static\/chunks\/.*\.js/, (route) => route.abort());
    // System preference is the opposite, so only the stored choice can produce this theme.
    await page.emulateMedia({ colorScheme: other(theme) });
    await page.addInitScript((t) => localStorage.setItem("theme", t), theme);
    await page.goto("/");

    // The bootstrap must be an inline <head> script (not a chunk the route above blocks).
    // Playwright text matching skips <script> contents, so read textContent directly.
    const inlineBootstraps = await page.evaluate(
      () =>
        Array.from(document.head.querySelectorAll("script:not([src])")).filter((s) =>
          /localStorage\.getItem\(["']theme["']\)/.test(s.textContent ?? ""),
        ).length,
    );
    expect(inlineBootstraps).toBe(1);

    const html = page.locator("html");
    await expect(html).toHaveAttribute("data-theme", theme);
    expect(await page.evaluate(() => getComputedStyle(document.body).backgroundColor)).toBe(BG[theme]);
    // Proof React did not run: aria-pressed is only set after mount.
    await expect(toggleOf(page)).not.toHaveAttribute("aria-pressed", /.*/);
  });

  test(`no stored choice follows system ${theme}`, async ({ page }) => {
    await page.emulateMedia({ colorScheme: theme });
    await page.goto("/");
    await expect(page.locator("html")).toHaveAttribute("data-theme", theme);
    await expect(toggleOf(page)).toHaveAttribute("aria-pressed", String(theme === "dark"));
    expect(await page.evaluate(() => localStorage.getItem("theme"))).toBeNull();
  });

  test(`shows the right icon in ${theme}`, async ({ page }) => {
    await page.addInitScript((t) => localStorage.setItem("theme", t), theme);
    await page.goto("/");
    const toggle = toggleOf(page);
    await expect(toggle).toHaveAttribute("aria-pressed", String(theme === "dark"));
    // Icons are aria-hidden, so the component's BEM classes are the stable hook.
    const sun = toggle.locator(".theme-toggle__icon--sun");
    const moon = toggle.locator(".theme-toggle__icon--moon");
    await expect(theme === "dark" ? moon : sun).toBeVisible();
    await expect(theme === "dark" ? sun : moon).toBeHidden();

    // And it swaps when toggled.
    await toggle.click();
    await expect(theme === "dark" ? sun : moon).toBeVisible();
    await expect(theme === "dark" ? moon : sun).toBeHidden();
  });
}

test("follows live system changes until the visitor picks a theme", async ({ page }) => {
  await page.emulateMedia({ colorScheme: "light" });
  await page.goto("/");
  const html = page.locator("html");
  const toggle = toggleOf(page);
  await expect(toggle).toHaveAttribute("aria-pressed", "false"); // hydrated, listener attached
  await expect(html).toHaveAttribute("data-theme", "light");

  await emulateSchemeAndWait(page, "dark");
  await expect(html).toHaveAttribute("data-theme", "dark");
  await expect(toggle).toHaveAttribute("aria-pressed", "true");

  // Visitor picks light; from now on the stored choice wins.
  await toggle.click();
  await expect(html).toHaveAttribute("data-theme", "light");
  expect(await page.evaluate(() => localStorage.getItem("theme"))).toBe("light");

  await emulateSchemeAndWait(page, "light");
  await emulateSchemeAndWait(page, "dark");
  await expect(html).toHaveAttribute("data-theme", "light");
  await expect(toggle).toHaveAttribute("aria-pressed", "false");
});

test("storage blocked: toggle mirrors the system theme and one click switches", async ({ page }) => {
  // Make every storage read/write throw, as in Safari with storage blocked. The bootstrap then
  // can't set data-theme, so the CSS fallback paints the system scheme.
  await page.addInitScript(() => {
    const blocked = () => {
      throw new DOMException("blocked", "SecurityError");
    };
    Object.defineProperty(Storage.prototype, "getItem", { value: blocked });
    Object.defineProperty(Storage.prototype, "setItem", { value: blocked });
  });
  await page.emulateMedia({ colorScheme: "dark" });
  await page.goto("/");

  const toggle = toggleOf(page);
  await expect(toggle).toHaveAttribute("aria-pressed", "true");
  expect(await page.evaluate(() => getComputedStyle(document.body).backgroundColor)).toBe(BG.dark);

  await toggle.click();
  await expect(page.locator("html")).toHaveAttribute("data-theme", "light");
  await expect(toggle).toHaveAttribute("aria-pressed", "false");
  expect(await page.evaluate(() => getComputedStyle(document.body).backgroundColor)).toBe(BG.light);
});
