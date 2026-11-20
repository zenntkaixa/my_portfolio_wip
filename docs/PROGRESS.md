# Progress log

Newest entry first. Each session adds one entry of 12 lines or fewer: done, verified, next up,
waiting on Izzat. Keep the latest two entries here; move older ones to `docs/progress-archive.md`.

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

## 2026-11-19 — Session 70: Review fixes, Batch D (M14)

**Done** on `feat/m14-batch-d` (Izzat: quick wins from the team review doc, no notice period)
- robots.txt and sitemap.xml; photo alt text; "AWS Certified Solutions Architect – Associate" in the hero.
- Filled primary "Estimate this feature" button; "excluding SST" dropped (in-house rates carry no SST).
- A kept plan under an error is dimmed and labelled "Previous plan for: …"; a chip over typed text offers
  Undo for 10 s; cache hits return `cached: true` and say so; short input gets a text hint.
- Contact list adds work mode (onsite, hybrid or remote) and Malaysian citizen; plan CTA now hiring-focused.
- Verified: check (316 unit), full e2e 137 passed, then Batch D, keyboard and Batch A specs after review fixes.

**Next** Batch E (deterministic estimator) once Izzat decides how AI factors may be shown.
**Waiting on Izzat** Neon Singapore rows 7–9 are rate_limited (no live ok row yet); old US East project.

---
