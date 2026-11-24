# Progress log

Newest entry first. Each session adds one entry of 12 lines or fewer: done, verified, next up,
waiting on Izzat. Keep the latest two entries here; move older ones to `docs/progress-archive.md`.

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

## 2026-11-24 — Session 90: B4d refine reason as a task diff (M14)

**Done** on `feat/m14-refine-diff` (Izzat: "go ahead with B4d as proposed").
- `taskDiff` and `taskNames` in `lib/refine.ts`; `refine.why` now says "Added: … Removed: …" (3 names, then "and N more"),
  or "Same tasks; hours re-estimated." when only hours moved. Shown whenever hours or tasks change, so the 5% threshold is gone.
- The review-inserted task is left out of the diff. Unit tests added; docs-only wording on the site not needed (no threshold left).
- check 388, e2e 178. Reviewer skipped (small diff).

**Next:** S3 5-second test is Izzat's; B5 share link needs a privacy call and an ADR.

---

