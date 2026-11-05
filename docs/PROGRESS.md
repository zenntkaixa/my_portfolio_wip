# Progress log

Newest entry first. Each session adds one entry of 12 lines or fewer: done, verified, next up,
waiting on Izzat. Keep the latest two entries here; move older ones to `docs/progress-archive.md`.

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

## 2026-11-04 — Session 9: M1 Experience, Stack, Certifications, Contact tiles

**Done**
- Experience: `ol.timeline` with the period in a tabular-nums `--muted` column, org and role, a
  `--line` rule; container query stacks the period above each entry under 420px. Education under an h3.
- Stack: h3 per group; each chips list is named by its heading (`aria-labelledby`).
- Certifications: name left, year right in tabular-nums with `--line` dividers; empty year renders
  nothing.
- Contact: email as the primary mailto button (`--accent-ink` on `--accent`, 5.9:1 light, 7.1:1
  dark); LinkedIn and GitHub as new-tab links. No phone number. Note moved to `profile.contactNote`.
- Cross-tile: new `components/ExternalLink.tsx` (used by Project and Contact); `role="list"` on every
  bullet-less list; shared `lib/slug.ts` (with a unit test) replaces two copies.
- e2e (content only): the four tiles' content in order, mailto href, external link attributes, and
  a page-wide check that every bullet-less list has `role="list"`.
- docs/01: Experience, Stack, Certifications, Contact, Lists and external links sections.

**Verified**
- `npm run check` passes; Playwright 36/36 (home spec also 3x repeat, no flakes). Checked at
  390/1024/1440, light and dark.
- code-reviewer: no blockers. Fixed: stale CSS list comment, duplicated `slug()`, brittle empty-year
  guard, redundant hand-maintained list test, unused `className` prop, Experience key, container
  query wording.

**Found, not fixed**
- At 1024 Certifications stretches to Stack's height and has empty space at the bottom.
- Labels "Education", "LinkedIn", "GitHub" are UI chrome in components (allowed, like tile titles).

**Next up**
- M1: load animation with reduced-motion support.

**Waiting on Izzat**
- Copy points from Session 8. radiozk live URL. Optional: a shorter PR stat label. M2 needs the
  Anthropic key in `.env.local`. Decide on untracked `AGENTS.md`. Whether to fix the 1024 empty space.

---

Older entries: `docs/progress-archive.md`.
