# Progress log

Newest entry first. Each session adds one entry of 12 lines or fewer: done, verified, next up,
waiting on Izzat. Keep the latest two entries here; move older ones to `docs/progress-archive.md`.

---

## 2026-11-24 — Session 78: Launch content calls and repo rename (M14)

**Done** on `chore/m14-repo-rename` (Izzat: "go with your suggestions", all certifications).
- Content calls: case studies launch without figures; full legal name, PR counts and all three
  certifications stay as they are (no copy change).
- GitHub repo renamed `my_portfolio_wip` → `portfolio` (old URL 301s; homepage set to zenntkaixa.dev).
  "Read the code", ADR links, README badge and the deployment doc point at the new name. The Vercel
  project keeps its name (`my-portfolio-wip.vercel.app`); no domain email for now.
- Verified: check 380, full e2e 160 (`--workers=2`).

**Next** release #100, #101 and this; device checks; release audit; launch.

---

## 2026-11-23 — Session 77: Plan feedback line and launch checks (M14)

**Done** on `feat/m14-plan-feedback` (Izzat).
- Live plans get "Spotted something off in this plan? Tell me", a mailto with the plan title as subject
  (not on the hand-written example; hidden in print). New e2e for the href.
- `app/favicon.ico`: the 32px icon wrapped in an ICO, so `/favicon.ico` no longer 404s.
- Lighthouse 13.6 on production: mobile 91–93 / 100 / 100 / 100, desktop 92 / 100 / 100 / 100. Only miss is
  TBT 330 ms (one 306 ms hydration task); post-launch item.
- Spike check: no DAILY_LIMIT or RATE_LIMIT_PER_HOUR env in production, so the defaults apply (150/day, 5 per
  visitor per hour). Izzat approved `DAILY_LIMIT=500` (Vercel production, at most ~US$1/day); live on next deploy.
- Verified: check 380, full e2e 160 (`--workers=2`).
---
