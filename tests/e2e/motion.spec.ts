import { expect, test, type Page } from "@playwright/test";

// Tile load animation (app/globals.css, "Load animation"): pure CSS, staggered in DOM order, off
// under prefers-reduced-motion. Behaviour checks only: computed styles and animation state, no
// layout or bounding boxes. The real API is never called; these tests never submit the estimator.

const TILES = ".bento > .tile";
// Keep in sync with globals.css: 40ms steps, capped at 440ms; tiles past the 12th reuse it.
const STEP_MS = 40;
const CAP_MS = 440;
const expectedDelayMs = (i: number) => Math.min(i * STEP_MS, CAP_MS);

/** Computed animation-delay is serialised in seconds ("0.04s"); normalise to whole milliseconds. */
const toMs = (value: string) => {
  const m = /^(-?[\d.]+)(ms|s)$/.exec(value.trim());
  if (!m) throw new Error(`Unexpected animation-delay: ${value}`);
  return Math.round(Number(m[1]) * (m[2] === "s" ? 1000 : 1));
};

type TileStyle = { name: string; delay: string; opacity: string; transform: string };

/** Computed animation-relevant styles for every tile, in DOM order. */
const tileStyles = (page: Page) =>
  page.locator(TILES).evaluateAll((els) =>
    els.map((el): TileStyle => {
      const cs = getComputedStyle(el);
      return {
        name: cs.animationName,
        delay: cs.animationDelay,
        opacity: cs.opacity,
        transform: cs.transform,
      };
    }),
  );

/**
 * Resolves once every tile's own tile-in animation has finished, then returns the computed styles.
 * Awaits the Web Animations `finished` promises, so there are no sleeps. Only tile-in is awaited so
 * an unrelated (possibly infinite) animation on a tile can't hang the test.
 */
const stylesAfterTileIn = async (page: Page) => {
  await page.locator(TILES).evaluateAll((els) =>
    Promise.all(
      els.flatMap((el) =>
        el
          .getAnimations()
          .filter((a) => a instanceof CSSAnimation && a.animationName === "tile-in")
          .map((a) => a.finished),
      ),
    ),
  );
  return tileStyles(page);
};

test("reduced motion: tiles have no animation and are fully opaque on load", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/");

  const styles = await tileStyles(page);
  expect(styles.length).toBeGreaterThanOrEqual(2);
  for (const [i, s] of styles.entries()) {
    expect(s.name, `tile ${i + 1} animation-name`).toBe("none");
    expect(s.opacity, `tile ${i + 1} opacity`).toBe("1");
  }
});

test("no preference: tiles run tile-in with delays staggered in DOM order", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "no-preference" });
  await page.goto("/");

  // The nth-child delays count every child of .bento, so they only match tile order if every
  // child is a tile.
  const tileCount = await page.locator(TILES).count();
  expect(tileCount).toBeGreaterThanOrEqual(2);
  await expect(page.locator(".bento > *")).toHaveCount(tileCount);

  const styles = await tileStyles(page);
  expect(styles.map((s) => s.name)).toEqual(Array.from({ length: tileCount }, () => "tile-in"));
  expect(styles.map((s) => toMs(s.delay))).toEqual(
    Array.from({ length: tileCount }, (_, i) => expectedDelayMs(i)),
  );
});

test("no preference: finished tiles are opaque with no lingering transform", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "no-preference" });
  await page.goto("/");

  const styles = await stylesAfterTileIn(page);
  expect(styles.length).toBeGreaterThanOrEqual(2);
  for (const [i, s] of styles.entries()) {
    expect(s.opacity, `tile ${i + 1} opacity`).toBe("1");
    // A forwards/both fill would leave an identity matrix here; backwards leaves the resting style.
    expect(s.transform, `tile ${i + 1} transform`).toBe("none");
  }
});

test("JS blocked: tiles still animate in to full opacity without hydration", async ({ page }) => {
  // Block every Next.js JS chunk so React never hydrates (same technique as theme.spec.ts).
  await page.route(/\/_next\/static\/chunks\/.*\.js/, (route) => route.abort());
  await page.emulateMedia({ reducedMotion: "no-preference" });
  await page.goto("/");

  const styles = await stylesAfterTileIn(page);
  expect(styles.length).toBeGreaterThanOrEqual(2);
  for (const [i, s] of styles.entries()) {
    expect(s.name, `tile ${i + 1} animation-name`).toBe("tile-in");
    expect(s.opacity, `tile ${i + 1} opacity`).toBe("1");
  }
  // Proof React did not run: ThemeToggle only sets aria-pressed after mount.
  await expect(page.getByRole("button", { name: "Dark theme" })).not.toHaveAttribute(
    "aria-pressed",
    /.*/,
  );
});
