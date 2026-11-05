# Progress log

Newest entry first. Each session adds one entry of 12 lines or fewer: done, verified, next up,
waiting on Izzat. Keep the latest two entries here; move older ones to `docs/progress-archive.md`.

---

## 2026-11-05 — Session 14: M2 submit flow and error states

**Done**
- `feat(ui)`: idle → submitting → success | error. Disabled fieldset, skeleton + polite "Planning phases…",
  `aria-busy`. 400 inline (textarea focused); 403/422/503 banners; 429 warn banner + Retry-After countdown
  on the button; 502/504/network Retry gated on a fresh token. Non-JSON bodies, `isPlan` guard, abort on
  unmount, focus to banner/results heading, footer note. Copy in `estimatorCopy`.
- New `lib/estimatorClient.ts` (+10 unit tests) and `tests/e2e/estimator-submit.spec.ts` (10 tests).

**Verified**
- `npm run check` passes; Playwright 58/58. 12 estimator crops clean. code-reviewer: no blockers, fixes applied.

**Next up**
- M2: `lib/timeline.ts` implemented; unit tests green [prompt-engineer or qa-tester].

**Waiting on Izzat**
- Backlog (unchanged): siteverify `hostname` check in `route.ts`; per-instance rate limit.

---

## 2026-11-05 — Session 13: M2 Turnstile component

**Done**
- `feat(ui)`: Turnstile renders from `Script onReady` (no polling; survives StrictMode re-runs),
  `onToken` held in a ref, re-renders on `data-theme` change, try/catch around render, failure message
  in a persistent polite live region; `reset()` clears token then widget. Copy moved to `lib/content.ts`.
- New `tests/e2e/turnstile.spec.ts` (render, reset after request, blocked script, theme change).

**Verified**
- `npm run check` passes; Playwright 48/48; dev mode widget loads. Estimator crops 320/1440 light+dark
  clean. code-reviewer findings fixed; security-reviewer: safe to ship.

**Next up**
- M2: submit flow and all error states from 03-estimator-spec [ui-builder].

**Waiting on Izzat**
- Backlog (security advisories, existing code): check siteverify `hostname` in `route.ts`; rate limit is
  per-instance memory, so Turnstile is the real gate.

---

