# Progress log

Newest entry first. Each session adds one entry of 12 lines or fewer: done, verified, next up,
waiting on Izzat. Keep the latest two entries here; move older ones to `docs/progress-archive.md`.

---

## 2026-11-11 — Session 32: M4 live URL (closes M4)

**Done**
- README links https://my-portfolio-wip.vercel.app; repo "Website" set via `gh repo edit`; Izzat added
  the URL to LinkedIn. M4 complete on `develop`.

**Verified**
- Repo homepage reads back as the live URL. Docs only; CI on the PR.

**Waiting on Izzat**
- M4 release to `main` when wanted (README link). Next: M5 polish (OG image, Lighthouse Performance 71
  → 90, analytics ADR). `.claude/settings.json` still local.

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
