# Progress log

Newest entry first. Each session adds one entry of 12 lines or fewer: done, verified, next up,
waiting on Izzat. Keep the latest two entries here; move older ones to `docs/progress-archive.md`.

---

## 2026-11-11 — Session 31: M4 go-live

**Done**
- M4 guards released (#20). Spend limit USD 10; `ANTHROPIC_API_KEY` on Production only; redeployed.
  The estimator is live at https://my-portfolio-wip.vercel.app.

**Verified**
- Vercel env names/targets as intended (values not read). Live: real plan with both tabs; 6th
  submit → 429 "Try again in 55 minutes"; `{}` → 400; fake token → 403.
- PageSpeed mobile: Performance 71 (below 90, moved to the M5 item), A11y/BP/SEO 100.

**Waiting on Izzat**
- Last M4 item: live URL in README and LinkedIn. `.claude/settings.json` still local.

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
