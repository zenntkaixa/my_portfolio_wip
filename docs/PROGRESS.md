# Progress log

Newest entry first. Each session adds one entry of 12 lines or fewer: done, verified, next up,
waiting on Izzat. Keep the latest two entries here; move older ones to `docs/progress-archive.md`.

---

## 2026-11-19 — Session 68: Estimator insights, Batch C (M14)

**Done** on `feat/m14-estimator-insights` (Izzat: Neon for durable rows, my picks for the rest)
- Neon project "portfolio" (US East, Postgres 18) created; table `estimate_events` (`db/schema.sql`); app role
  `portfolio_app` may only INSERT and SELECT (DELETE denied, checked). ADR-012, `@neondatabase/serverless` 1.2.0.
- Route split into a service layer (`lib/estimator/`): one event row and one JSON log line per request, written
  after the response; 24 h Upstash plan cache keyed by model + prompt version; copy and print the plan;
  "N plans generated" line (only from 25); cache notice under the form. Click tracking and share links skipped.
- Security review: no blockers; fixed its notes (versioned cache key, log fields can't be overwritten).

**Verified** see the PR. **Next** release PR for #84–#86 and this when Izzat asks.
**Waiting on Izzat** rotate the `portfolio_app` password in Neon, then set `DATABASE_URL` in Vercel (Production).

---

## 2026-11-19 — Session 67: Estimator credibility, Batch B (M14)

**Done** on `feat/m14-estimator-credibility` (Izzat: contingency row, mixed RM 78, one Haiku check)
- Code enforces capacity (6 productive h per person-day; calendar stretched with a note), 20% contingency
  row, seniority hour multipliers, solo teams in sequence, "Questions to confirm" and "Not included", MVP slices.
- Structured outputs replace regex parsing; prompt moved to `lib/prompt.ts`; timeouts 4 s + 45 s; ADR-011.
- Security review: no blockers; added its fix (plans over 2000 days rejected).
- Haiku golden set, 11 cases + 1 probe (~2 US cents): all valid; vague and non-software get 422; MVP slice
  and injection behave; no calendar needed stretching. Mixed came out near junior (one sample each).

**Verified** see the PR. **Next** release PR for #84, #85 and this when Izzat asks; then Batch C.
**Waiting on Izzat** caching and share links (privacy call).

---

