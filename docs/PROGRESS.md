# Progress log

Newest entry first. Each session adds one entry of 12 lines or fewer: done, verified, next up,
waiting on Izzat. Keep the latest two entries here; move older ones to `docs/progress-archive.md`.

---

## 2026-11-24 — Session 79: Branded 404 page (M14)

**Done** on `feat/m14-not-found` (Izzat: "go ahead with the 404 page", from a pre-launch scan).
- `app/not-found.tsx`: one tile with the theme toggle and footer, copy in `lib/content.ts` (`notFound`).
- Its metadata sets `robots: noindex`; the layout's "index, follow" was rendering beside Next's noindex.
- Pre-launch scan: npm audit 0, domain live on Vercel, all roadmap items ticked; patch bumps left to Dependabot.
- Verified: check 380, full e2e 161; 404 screenshots at 390/1440 in light and dark.

**Next** release #100–#104 and this; real-device checks; LinkedIn/WhatsApp share preview; launch.

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
