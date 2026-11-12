# Progress log

Newest entry first. Each session adds one entry of 12 lines or fewer: done, verified, next up,
waiting on Izzat. Keep the latest two entries here; move older ones to `docs/progress-archive.md`.

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

## 2026-11-12 — Session 38: M5 radiozk live URL

**Done**
- `featuredProject.live` in `lib/content.ts` set to https://zenntkaixa-radiozk.onrender.com/ (from Izzat).
  The project tile already renders "Live demo" when it is set; no component change.

**Verified**
- URL returned 200. `npm run check` 197 unit; e2e 93/93 (the existing live-link test now checks the href).

**Waiting on Izzat**
- If radiozk is on Render's free tier it sleeps when idle; first load can take close to a minute.
- Page view in the Analytics dashboard; LinkedIn Post Inspector. `.claude/settings.json` still local.

---
