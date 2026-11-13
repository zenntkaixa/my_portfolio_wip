# Progress log

Newest entry first. Each session adds one entry of 12 lines or fewer: done, verified, next up,
waiting on Izzat. Keep the latest two entries here; move older ones to `docs/progress-archive.md`.

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

## 2026-11-13 — Session 48: Loose ends: refund script verified, keyboard flake measured, clean-up

**Done**
- Refund script run on the real Upstash database with throwaway `{rltest}` keys: refund lowers the day
  counter once, keeps its expiry, is a no-op when repeated or when the counter is missing. Keys deleted.
- Keyboard tab-order flake: 1 failure in the last 30 CI runs (passed on retry), 0 in 22 local runs, 12
  alone and 10 under parallel load. Focus dropped to `body` at Turnstile's stop. No code change.
- Removed a finished `TODO` in `estimator.spec.ts`; CLAUDE.md's CI line now mentions the docs-only skip.

**Waiting on Izzat**
- Release of #50, #51, #52. Open: the estimator tile's blueprint grid background (in the design system,
  `--grid` token unused, `TODO` in `EstimatorTile.tsx`); full Hallmark redesign.

---

