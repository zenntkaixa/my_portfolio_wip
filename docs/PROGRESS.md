# Progress log

Newest entry first. Each session adds one entry of 12 lines or fewer: done, verified, next up,
waiting on Izzat. Keep the latest two entries here; move older ones to `docs/progress-archive.md`.

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

## 2026-11-12 — Session 39: M5 shared rate limit in Upstash

**Done**
- ADR-009: visitor limit and daily cap run as one atomic Lua script in Upstash over REST (`fetch`, no
  dependency) when both env vars are set; IPs sent as hashes. Never looser than before: failures fall
  back to memory, a block is always honoured, an allow must also pass memory (security-reviewer fixes).

**Verified**
- `npm run check` 236 unit; e2e 93/93 (first run: 2 browser start-up timeouts under load; rerun clean).
- Lua script correct on real Redis 7 (Docker). Not verified: Upstash's REST wrapper, until a database exists.

**Waiting on Izzat**
- Upstash database (Singapore) + `UPSTASH_REDIS_REST_URL` / `_TOKEN` in Vercel Production; then check the
  6th estimate gives 429. CLAUDE.md "Accepted risks" rate-limit wording is stale (Izzat's call).

---
