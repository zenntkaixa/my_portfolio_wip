# Progress log

Newest entry first. Each session adds one entry of 12 lines or fewer: done, verified, next up,
waiting on Izzat. Keep the latest two entries here; move older ones to `docs/progress-archive.md`.

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

## 2026-11-04 — Session 10: M1 load animation with reduced-motion support

**Done**
- CSS-only `tile-in` (fade and rise 8px, 400ms ease-out), staggered 40ms per tile in DOM order via
  `nth-child`, capped at 440ms. All inside `prefers-reduced-motion: no-preference`; no JS, so tiles
  appear without hydration.
- Fill mode `backwards`, not `both`: a forwards fill leaves an identity transform on every tile, making
  it a containing block for `position: fixed` children (would trap M2 overlays).
- Visual spec emulates reduced motion, so screenshots never catch a mid-fade.
- New `tests/e2e/motion.spec.ts`: reduced motion means no animation; stagger delays in DOM order;
  no lingering transform after finish (shown to fail with `both`); works with JS blocked.
- docs/01: Motion section rewritten. Tile hover deferred to M2 with the estimator tile.

**Verified**
- `npm run check` passes; Playwright 40/40; motion spec 5x repeat, no flakes. Screenshots at
  390/1024/1440, light and dark, unchanged.
- code-reviewer: no blockers. Fixed: duplicated style reader in the spec, cap comment, mobile
  trade-off wording in docs.

**Found, not fixed**
- The hero paints at opacity 0 for its first frame, so LCP lands about a frame later. Negligible;
  exempt `.tile--hero` if Lighthouse ever flags it.

**Next up**
- M1: `/visual-check` pass at 390 / 1024 / 1440, light and dark; fix findings.

**Waiting on Izzat**
- Copy points from Session 8. radiozk live URL. Optional: a shorter PR stat label. M2 needs the
  Anthropic key in `.env.local`. Decide on untracked `AGENTS.md`. Whether to fix the 1024 empty space
  under Certifications.

---

Older entries: `docs/progress-archive.md`.
