# Progress log

Newest entry first. Each session adds one entry of 12 lines or fewer: done, verified, next up,
waiting on Izzat. Keep the latest two entries here; move older ones to `docs/progress-archive.md`.

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

## 2026-11-11 — Session 34: CI in the Playwright container

**Done**
- Izzat asked why PR #24's CI took 10+ min: `playwright install --with-deps` hung on apt (runners
  couldn't resolve `security.ubuntu.com`) and failed twice; normally 22–34 s. Not our code.
- `ci` job now runs in `mcr.microsoft.com/playwright:v1.64.1-noble` (digest-pinned): no apt, no
  browser download; Playwright version guard; step timeouts. ADR-007; 05-deployment CI section.

**Verified**
- security-reviewer: safe to ship (digest is the multi-arch index). Real test: this PR's CI run.

**Waiting on Izzat**
- PR #24 (OG metadata) updated from `develop` after this merged; its CI now runs in the container. `.claude/settings.json` still local.

---
