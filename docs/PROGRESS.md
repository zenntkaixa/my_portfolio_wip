# Progress log

Newest entry first. Each session adds one entry of 12 lines or fewer: done, verified, next up,
waiting on Izzat. Keep the latest two entries here; move older ones to `docs/progress-archive.md`.

---

## 2026-11-24 — Session 92: G6 Experience Gantt timeline (M14)

**Done** on `feat/m14-experience-timeline` (Izzat: "do g6").
- `lib/careerSpan.ts` parses the existing `period` strings (no new copy); each row gets an aria-hidden bar on a 2017-to-now
  axis with year ticks. Career break is a hollow dashed bar. Growth animation only under no-preference motion.
- Reviewer fixes: axis `em` margin now matches the 7.5em period column; last row's spacing fixed under 420px.
- check 415 (5 new), e2e 180, visual-check on the tile (1440 and 390 light, 390 dark): no issues.
- "Now" freezes at build time (`shortcut:` comment); the tick year changes on the next deploy.

**Next:** S3, B5, G4/G5/C6, E6, G7 as before.

---

## 2026-11-24 — Session 91: reviewer T-tests (M14)

**Done** on `test/m14-review-t-tests` (Izzat: "do the T-tests").
- T1 team 4 vs 5, T3 team 1 and 12 plus out-of-range sizes, T5 Malay brief and injection inside a refine answer (23 unit tests, mocked).
- T7 dark-theme axe contrast on request flow, budget tab and refine form (2 e2e).
- Bug found and fixed (Izzat: "option 2"): pending request-flow steps (`opacity: 0.45`, globals.css ~2649) measured
  3.86:1 in dark theme; now 0.7, and the dark test is a plain `test`. Light theme checked with a throwaway copy: passes.
- check 411, e2e 180 (first full run had 2 timeouts in the new spec, not repeated on re-run; watch for load flakiness).
  Reviewer and visual-check skipped (one opacity value).

**Next:** S3, B5, G4/G5/C6, E6 as before.

---

