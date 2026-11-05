# Progress log

Newest entry first. Each session adds one entry of 12 lines or fewer: done, verified, next up,
waiting on Izzat. Keep the latest two entries here; move older ones to `docs/progress-archive.md`.

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

## 2026-11-05 — Session 12: M2 estimator form controls

**Done**
- `feat(ui)`: example chips (strings moved to `lib/content.ts`), textarea with right-aligned counter
  (warn colour under 20, hint in a polite live region), styled team slider with `<output>` readout and
  `aria-valuetext`, seniority as a native-radio segmented pill (2x2 under 360px). Dark fieldset border fixed.
- New `tests/e2e/estimator-form.spec.ts` (chips, counter, slider, arrow keys, no scroll at 320).

**Verified**
- `npm run check` passes; Playwright 44/44. Estimator crops at 320/1440 checked; code-reviewer: no blockers.

**Next up**
- M2: Turnstile component (explicit render, reset after each request) [api-engineer].

**Waiting on Izzat**
- Unchanged from Session 11. Open nit: estimator UI labels stay in the component (not `content.ts`).

---

Older entries: `docs/progress-archive.md`.
