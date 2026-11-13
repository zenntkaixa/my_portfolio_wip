# Progress log

Newest entry first. Each session adds one entry of 12 lines or fewer: done, verified, next up,
waiting on Izzat. Keep the latest two entries here; move older ones to `docs/progress-archive.md`.

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

## 2026-11-13 — Session 47: Hallmark re-audit; banner and stat label polish

**Done**
- Re-audit after #51: linter 0 FAIL (was 1), 1 REFLEX (slider thumb calc, a false alarm), 4 WARN.
- Estimator banner: one hairline all round (`--ink`, `--warn` for the rate limit), no side stripe.
- Now tile: stats stack as rows under 440px of tile width (was 360px), so desktop uses rows and the
  longest label takes two lines, not five; labels wrap evenly. `docs/01b-tiles.md` updated.

**Verified**
- `npm run check` 247 unit; e2e 95/95; Now tile at 390 and 1440 and both banner tones inspected.

**Waiting on Izzat**
- Release of #50, #51 and this PR. Undecided: full Hallmark redesign (cards, headings, word count).

---

