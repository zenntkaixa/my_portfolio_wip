# Progress log

Newest entry first. Each session adds one entry of 12 lines or fewer: done, verified, next up,
waiting on Izzat. Keep the latest two entries here; move older ones to `docs/progress-archive.md`.

---

## 2026-11-16 — Session 50: Example plan button; 44px tap targets

**Done**
- "See an example plan" on the estimator shows the stored plan in `lib/samplePlan.ts` with no request
  (no Turnstile, slot or model call). It is labelled as an example and as written by hand; a live
  estimate replaces it. Wording approved by Izzat.
- Tap targets: text links in the hero, project and contact tiles, both link buttons, submit and the
  theme button are at least 44px tall; chips on touch screens too.

**Verified**
- `npm run check` 250 unit; e2e 98/98; `reviewer`: no blocking findings; `/visual-check` of the
  estimator, contact and hero tiles; the example view at 390.

**Waiting on Izzat**
- Optional: paste a real Claude reply to replace the hand-written example. Undecided: Hallmark redesign.

---

## 2026-11-13 — Session 49: Blueprint grid on the estimator tile

**Done**
- `.tile--estimator` draws the design system's blueprint grid (`--grid` lines, 24px) in both themes; the
  old `TODO` in `EstimatorTile.tsx` is gone.
- The axe scans switch the grid image off first: with it on, axe cannot compute contrast for 28 text
  nodes on the tile and leaves them unchecked (measured: 36 checked with the grid, 64 without).

**Verified**
- `npm run check` 247 unit; e2e 95/95; estimator inspected at 390 and 1440 light, 1440 dark, and with
  results showing.

**Waiting on Izzat**
- Release of #50 to #53 and this PR. Undecided: full Hallmark redesign.

---

