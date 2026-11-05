# Progress log

Newest entry first. Each session adds one entry of 12 lines or fewer: done, verified, next up,
waiting on Izzat. Keep the latest two entries here; move older ones to `docs/progress-archive.md`.

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

## 2026-11-05 — Session 11: M1 visual-check pass (closes M1); token-budget setup

**Done**
- `chore: cut per-session token use` (Izzat's instruction): trimmed CLAUDE.md, PROGRESS archive,
  docs/01b-tiles.md split, Sonnet subagents, crop-first `/visual-check`, `/ship` confirms not re-runs.
- Visual-check fixes: focus halo spread 8px so 4px shows outside the outline; Turnstile renders
  `compact` when its container is under 300px (no sideways scroll at 320px).

**Verified**
- `npm run check` passes; Playwright 40/40. 320 and 390: scrollWidth equals clientWidth; halo crop
  checked. Few-line diff, so no code-reviewer run (CLAUDE.md section 4).

**Next up**
- M2: estimator form. Estimator styling also covers the deferred visual findings (plain controls,
  dark-mode fieldset border, cramped example buttons, radio wrapping at 320).

**Waiting on Izzat**
- Certifications empty space at 1024 (comparison image in the session). Now tile stat label wraps to
  5 lines at 1440: shorter copy or earlier row layout. M2 tile-hover roadmap line. Session 8 copy
  points, radiozk live URL, Anthropic key, `AGENTS.md`.

---

Older entries: `docs/progress-archive.md`.
