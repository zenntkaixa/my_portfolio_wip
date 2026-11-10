# Progress log

Newest entry first. Each session adds one entry of 12 lines or fewer: done, verified, next up,
waiting on Izzat. Keep the latest two entries here; move older ones to `docs/progress-archive.md`.

---

## 2026-11-10 — Session 25: M3 accessibility pass

**Done**
- ADR-006: `@axe-core/playwright` 4.14.0 (dev, exact pin). `a11y.spec.ts`: axe WCAG 2.2 AA on home,
  results tabs 1/2, 403 banner, 429 countdown, light + dark. No violations.
- `keyboard.spec.ts`: full Tab order, focus ring on every stop, no trap, Shift+Tab, keyboard submit +
  tab arrows. `contrast.test.ts`: token pairs in both themes. Skip link "Skip to the estimator" added.

**Verified**
- `npm run check` 174 unit; e2e 86/86; visual check of the focused skip link clean; reviewer: no blockers.

**Waiting on Izzat**
- Turnstile test widget adds 3 Tab stops before Submit (third-party); recheck with the real widget in M4.
- `.claude/settings.json` still has local edits (not committed).

---

## 2026-11-10 — Session 24: M3 e2e coverage

**Done**
- Roadmap item was mostly covered by M2 specs (all tiles, happy path, 429, browser-mocked API;
  `route.test.ts` runs the real route with Anthropic `fetch` mocked). Topped up: the "every tile"
  test now includes case-study tiles from content; new no-console-error check on load + mocked submit.
- Skipped a full-stack e2e against a fake Anthropic server: it needs a base-URL env var that could
  send the key elsewhere if misset in production.

**Verified**
- `npm run check` 137 unit; e2e 73/73. Reviewer skipped (few-line test diff).

---
