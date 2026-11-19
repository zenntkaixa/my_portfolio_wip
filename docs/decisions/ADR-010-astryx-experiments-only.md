# ADR-010 — Astryx design system installed for experiments, not used on the live site

**Status:** Accepted (2026-11-19)

## Context
Izzat asked to try Meta's Astryx design system (`@astryxdesign/core`, `@astryxdesign/theme-neutral`,
`@astryxdesign/cli`, with its `@stylexjs/stylex` peer). Vetted before install: published from the
`meta/astryx` repo by Meta and `fb` maintainers; the two `postinstall` scripts only print a setup reminder
(no network or shell calls). Version 0.7.16, pre-1.0, with canaries published several times a day.

He chose "Neutral + cobalt": the Neutral theme extended with `defineTheme` so its accent family matches
the site's `--accent` / `--accent-soft` / `--accent-ink` in light and dark (`src/themes/cobalt/`, built
with `astryx theme build`, wired into the generated `astryx-themes.ts` as the default).

Wiring `<Theme>` and Astryx's `reset.css` / `astryx.css` into `app/layout.tsx` broke 10 of 110 e2e tests:
1. `<Theme>` owns `<html>` and drops the site's `data-theme`, so the light/dark toggle stops working.
2. Neutral's `fonts.css` loads Figtree from Google Fonts at runtime; the CSP blocks it, so body text falls
   back to a generic sans-serif.
3. The reset removes list bullets, so bulleted lists without `role="list"` lose their semantics in Safari.
The theme itself changes nothing visible, because no tile uses Astryx components.

## Decision
Option 2 of three (migrate, keep off the live site, undo), chosen by Izzat:
- Keep the packages, `astryx-themes.ts` and `src/themes/cobalt/` in the repo for experiments.
- Do **not** import Astryx CSS, `<Theme>` or components in `app/` or `components/`. The site keeps its own
  design system (`docs/01-design-system.md`, `app/globals.css`) and the coding standards in `CLAUDE.md`.
- Astryx's agent instructions live only in `AGENTS.md` (`npx astryx init --agent codex`), not in
  `CLAUDE.md`, because they contradict this project's rules ("no `<div>`", component props over CSS).
- Preview the theme on real Astryx components with the experimental editor's PNGs, not on the site.

## Consequences
- CI installs about 140 more packages (`npm ci`); nothing ships to visitors, so bundle size is unchanged.
- Adopting Astryx later is a design-system migration: solve the three conflicts above (drive Astryx's
  colour mode from the site toggle, self-host or drop Figtree, restore list bullets), then move tile by
  tile, with a new ADR and updated coding standards. Reconsider once Astryx reaches 1.0.
- After an Astryx upgrade, rerun `npx astryx theme build src/themes/cobalt/cobaltTheme.ts`.
- To undo: remove the four packages, `astryx-themes.ts` and `src/themes/`, and run `npx astryx init --remove-agents`.
