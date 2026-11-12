# Progress log

Newest entry first. Each session adds one entry of 12 lines or fewer: done, verified, next up,
waiting on Izzat. Keep the latest two entries here; move older ones to `docs/progress-archive.md`.

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

## 2026-11-11 — Session 35: M5 Lighthouse (mobile)

**Done**
- Cause: Turnstile preloaded in the critical path (~1.9 MB + CPU). Prod baseline 64, LCP 4.0 s, TBT 1150 ms.
- `Turnstile.tsx` injects `api.js` itself when the estimator nears the viewport or the form gets focus;
  rejects if `window.turnstile` is missing. Hero and Now rise without fading (`tile-rise`), so LCP text is opaque.
- Portrait phones still load it right after hydration (estimator is in view); tests say so honestly.

**Verified**
- Local production build 79 → 93/94 (LCP 2.6 s, TBT ~215 ms). `npm run check` 191 unit; e2e 92/92. reviewer: no blockers, nits fixed.

**Waiting on Izzat**
- After release: Lighthouse rerun on production; LinkedIn Post Inspector. `.claude/settings.json` still local.

---
