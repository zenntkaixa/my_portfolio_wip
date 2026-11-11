# Progress log

Newest entry first. Each session adds one entry of 12 lines or fewer: done, verified, next up,
waiting on Izzat. Keep the latest two entries here; move older ones to `docs/progress-archive.md`.

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

## 2026-11-10 — Session 28: M4 first Vercel deploy

**Done**
- Repo public (README release #16); branch protection on `develop`/`main` (PR + `ci`, admins too),
  auto-delete, secret scanning + push protection; merged branches deleted.
- Vercel: https://my-portfolio-wip.vercel.app (sin1, prod branch `main`), Turnstile test keys only,
  no `ANTHROPIC_API_KEY` by design. 05-deployment rewritten for that order.

**Verified**
- Live: home 200, CSP/HSTS/nosniff/DENY headers, 415/400/413, valid request → 503 (no spend).

**Waiting on Izzat**
- Real Turnstile widget next, then spend limit, then the API key. `.claude/settings.json` still local.

---
