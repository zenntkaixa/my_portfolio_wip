# Progress log

Newest entry first. Each session adds one entry of 12 lines or fewer: done, verified, next up,
waiting on Izzat. Keep the latest two entries here; move older ones to `docs/progress-archive.md`.

---

## 2026-11-11 — Session 30: M4 production guards

**Done**
- `lib/turnstileConfig.ts`: on production (or Vercel without an explicit preview/dev `VERCEL_ENV`), test or
  missing Turnstile keys or a missing `TURNSTILE_HOSTNAME` → 503 before siteverify, limits and model; a
  real secret needs a hostname everywhere. Hostname compare trimmed. Docs + CLAUDE.md accepted risks.

**Verified**
- `npm run check` 191 unit; e2e 86/86. security-reviewer: fail-closed fix applied as prescribed;
  reviewer: no blockers, nits fixed. Live production already passes the guard.

**Waiting on Izzat**
- Release to `main` when ready; confirm Vercel "Automatically expose System Environment Variables" is on.
  Then the spend limit, then `ANTHROPIC_API_KEY`. `.claude/settings.json` still local.

---

## 2026-11-11 — Session 29: M4 real Turnstile

**Done**
- Cloudflare widget `portfolio` (Managed) for `my-portfolio-wip.vercel.app`. Vercel Production: real
  keys + `TURNSTILE_HOSTNAME`; Preview keeps test keys. Site key must be type Config (Vercel rejects
  Sensitive for `NEXT_PUBLIC_`). 05-deployment updated.

**Verified**
- Live build carries the real site key (test key absent); fake token → 403; 400/415 unchanged.
- Izzat's browser: widget tick, submit → 503 "unavailable" (real token passed; no API key, no spend).

**Waiting on Izzat**
- Next: production guards (code), then the spend limit, then `ANTHROPIC_API_KEY`.
  `.claude/settings.json` still local.

---
