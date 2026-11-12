# Progress log

Newest entry first. Each session adds one entry of 12 lines or fewer: done, verified, next up,
waiting on Izzat. Keep the latest two entries here; move older ones to `docs/progress-archive.md`.

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

## 2026-11-12 — Session 36: M5 Vercel Web Analytics

**Done**
- Session 35 follow-up: production mobile Lighthouse after release is 93, 90, 90 (was 64); fake token still 403.
- ADR-008: one deferred same-origin `<script>` in `layout.tsx`, only when `VERCEL_ENV=production`
  (`lib/analytics.ts`). No dependency, no CSP change, page views only.
- Izzat ran `npm i @vercel/analytics` from the dashboard prompt; removed again at Izzat's request (option 1 kept).

**Verified**
- `npm run check` 197 unit; e2e 93/93. security-reviewer: safe to ship; ADR privacy wording tightened.

**Waiting on Izzat**
- Enable Analytics in the Vercel dashboard. After release: script 200, a page view in the dashboard,
  no CSP errors, Lighthouse still ≥ 90. LinkedIn Post Inspector. `.claude/settings.json` still local.

---
