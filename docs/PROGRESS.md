# Progress log

Newest entry first. Each session adds one entry of 12 lines or fewer: done, verified, next up,
waiting on Izzat. Keep the latest two entries here; move older ones to `docs/progress-archive.md`.

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

## 2026-11-10 — Session 27: M3 release, M4 repo ready to go public

**Done**
- M3 released (PR #14 into `main`). Pre-public audit of all history and PRs: safe to publish.
- README for public visitors (CI badge, "What's worth a look", PR workflow); ROADMAP header fixes;
  413/415 rows in the estimator spec (docs-auditor). Repo description and topics set via `gh`.

**Verified**
- docs-auditor: README claims match code. Release: local + CI check/e2e green, `npm audit` clean.

**Waiting on Izzat**
- After merge: flip the repo public; then branch protection, auto-delete, secret scanning and push
  protection (Claude can apply via `gh api` with an OK). `.claude/settings.json` still local.

---
