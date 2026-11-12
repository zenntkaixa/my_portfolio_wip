# Progress log

Newest entry first. Each session adds one entry of 12 lines or fewer: done, verified, next up,
waiting on Izzat. Keep the latest two entries here; move older ones to `docs/progress-archive.md`.

---

## 2026-11-12 — Session 41: Shared rate limit verified; roadmap parked

**Done**
- Released PR #38 (Upstash limiter, audit fixes). Upstash database `portfolio-ratelimit` created
  (Singapore, free); Izzat added both env vars to Vercel Production and redeployed.
- Hallmark design audit run; Izzat parked the polish/redesign choice. Custom domain deferred (remind Izzat).

**Verified**
- Limit script run on the real database (test keys, deleted). After 6 estimates on production the 6th
  was refused; day counter 5, one hashed visitor key with 5 hits, expiries set.

**Waiting on Izzat**
- Custom domain (only open roadmap item). Open audit items, not on the roadmap: e2e on the production
  build, Dependabot alerts, refund a slot on AI errors. CLAUDE.md "Accepted risks" rate-limit wording is stale.

---

## 2026-11-12 — Session 40: Repo audit fixes

**Done**
- Izzat ran a repo audit (7 findings, none must-fix) and picked three to fix.
- `normalisePlan` returns null when no phase has a usable task (was shown as a 0-hour plan).
- Missing `ANTHROPIC_API_KEY` now answers 503 before the human check and the rate limit, so it costs no slot.
- Deleted the unused `lightToken` helper.

**Verified**
- `npm run check` 238 unit; e2e 93/93 on the rerun (first run: 2 timeouts, slow page load and Turnstile test widget).

**Waiting on Izzat**
- Open audit items: e2e on the production build, Dependabot alerts, real-Upstash check, refund slot on AI errors.

---
