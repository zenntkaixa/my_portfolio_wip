# Progress log

Newest entry first. Each session adds one entry of 12 lines or fewer: done, verified, next up,
waiting on Izzat. Keep the latest two entries here; move older ones to `docs/progress-archive.md`.

---

## 2026-11-20 — Session 72: How it's built panel (M14)

**Done** on `feat/m14-how-its-built` (Izzat: my suggestion)
- Batch E released (#94) and live: Neon rows 14–15 ok in about 10 s; golden set passed (US$0.0069).
- A closed-by-default "How it's built" panel in the estimator tile: request path, model proposes / code
  enforces, live numbers from Neon (30 days, shown from 5 plans), the dated eval table, ADR links.
- Eval script now in the repo: `npm run eval:estimator` (Izzat runs it; never CI; `--dry` makes no calls).
- Verified: check 349 unit, full e2e 152 passed; reviewer no blockers (labels now say "new plan").

**Next** integrations prompt fix (named services count); bumps from 27 Nov and 2 Dec; Neon usage review.

---

## 2026-11-20 — Session 71: Deterministic estimator, Batch E (M14)

**Done** on `feat/m14-deterministic-estimator` (Izzat: option 1, E1 and E2 together)
- The model returns one scope (mid-level base hours, task categories, six facts); code applies seniority, the AI
  band (20–40% less on code, tests, docs and config, plus a review task), confidence, ranges, contingency
  10/20/30% and the calendar. One call serves both styles; cache key is feature + team size. ADR-013.
- UI: effort range, missing facts, contingency rate, Estimate drivers, same-scope comparison; copy plan updated.
- Security review: safe to ship. Code review fixes in (calendar scales with hours, cache reads fully validated).
- Verified: check 346 unit, full e2e 149. Old US East Neon project deleted; live row 10 ok in Singapore.

**Waiting on Izzat** run the Haiku golden set (`!` command in chat); auto mode blocked the live call for me.

---
