# ADR-006 — Automated accessibility scans with axe-core

**Status:** Accepted (2026-11-10)

## Context
The M3 accessibility pass needs to check contrast, labels, ARIA and landmarks on the home page and on
every estimator state, in light and dark themes. Hand-written Playwright checks catch only what we
think to list. axe-core is the de facto WCAG rules engine (used by Lighthouse and browser devtools),
and `@axe-core/playwright` runs it inside the existing e2e suite. CI (next M3 item) can then guard
accessibility on every PR.

## Decision
- Add `@axe-core/playwright` (which brings `axe-core`) as a **dev dependency**, pinned to an exact
  version at least two weeks old (4.14.0 at adoption).
- Scans run in `tests/e2e/a11y.spec.ts` against the WCAG 2.0/2.1/2.2 A and AA tags; any violation fails
  the test. A rule may be disabled only with a comment naming the reason and the element.
- Keep the hand-written checks too: a keyboard walkthrough spec and a unit test of design-token
  contrast ratios, which cover what a scan of one rendered state can't.

## Consequences
- Nothing ships to visitors; the package is test-only.
- Upgrades follow the same rule: exact version, at least two weeks old, `npm audit` clean.
- axe finds roughly half of WCAG issues; keyboard and screen-reader behaviour still need the
  walkthrough spec and occasional manual checks.
