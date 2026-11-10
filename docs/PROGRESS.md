# Progress log

Newest entry first. Each session adds one entry of 12 lines or fewer: done, verified, next up,
waiting on Izzat. Keep the latest two entries here; move older ones to `docs/progress-archive.md`.

---

## 2026-11-10 — Session 26: M3 GitHub Actions CI

**Done**
- `.github/workflows/ci.yml`: one `ci` job on PRs/pushes to `develop` and `main` (npm ci, check,
  Playwright chromium, e2e); read-only token, SHA-pinned actions, no secrets, traces on failure.
- CLAUDE.md "green" = `ci` passed on the PR; `/ship` now watches CI; CI section in 05-deployment.

**Verified**
- security-reviewer: no blockers; SHAs match tags; no path to the real API. First real run is this PR.

**Waiting on Izzat**
- Auto-delete head branches (Settings). Branch protection is blocked while the repo is private on
  the free plan: do it when public (M4). `.claude/settings.json` still local.

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
