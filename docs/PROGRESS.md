# Progress log

Newest entry first. Each session adds one entry of 12 lines or fewer: done, verified, next up,
waiting on Izzat. Keep the latest two entries here; move older ones to `docs/progress-archive.md`.

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

## 2026-11-12 — Session 37: Analytics released; Lighthouse re-measured

**Done**
- Released Web Analytics (PR #32). Closed Vercel's bot PR #29 (package-based duplicate, targeted `main`).
- Production: script 200, no console or CSP errors. VM Lighthouse read 86–88 after release; an A/B with
  the tracker blocked (84–88) vs allowed (87–89) showed analytics is not the cause, only run variance.
- Profile: the long startup task is React/Next boot (229 KB + 187 KB), not our ~48 KB. No code change.

**Verified**
- PageSpeed Insights mobile Performance 100 (Izzat, 2026-11-12). Izzat's call: keep analytics.

**Waiting on Izzat**
- Confirm a page view shows in the Analytics dashboard. LinkedIn Post Inspector. `.claude/settings.json` still local.

---
