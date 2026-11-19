# Progress log

Newest entry first. Each session adds one entry of 12 lines or fewer: done, verified, next up,
waiting on Izzat. Keep the latest two entries here; move older ones to `docs/progress-archive.md`.

---

## 2026-11-19 — Session 69: Housekeeping after the M14 release

**Done** on `chore/m14-housekeeping` (Izzat: items 1 and 4; bumps held)
- Release #88 live (main 6e808ef); first live estimate wrote Neon row 2 (ok, 15.3 s, US$0.0017).
- Stale docs fixed: tile hover (01), domain and resolved open items (00), CI watch (ADR-005), estimator
  only on zenntkaixa.dev (05).
- Visitor-side outcomes (invalid input, failed human check, rate limited) log as warnings, so Vercel's error
  view shows only server failures.
- Held by the two-week rule: Playwright 1.65.1 + CI image (from 27 Nov), Vitest 5.1.1 (from 2 Dec),
  `@neondatabase/serverless` 1.2.1 (from 27 Nov).

**Next** the bumps on those dates; usage review in Neon after 1–2 weeks of traffic.
**Then** Neon moved to Singapore (`portfolio-sg`, next to `sin1`): new `DATABASE_URL`, redeployed 18:30 UTC,
rows 2–6 copied with their IDs. Old US East project kept until Izzat decides.

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

