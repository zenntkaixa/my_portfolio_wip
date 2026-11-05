# Progress log

Newest entry first. Each session adds one entry of 12 lines or fewer: done, verified, next up,
waiting on Izzat. Keep the latest two entries here; move older ones to `docs/progress-archive.md`.

---

## 2026-11-05 — Session 20: M2 accessible result tabs

**Done**
- `feat(ui)`: new `ResultTabs` (WAI-ARIA tabs, automatic activation, roving tabindex, Arrow wrap,
  Home/End, focusable panels, `useId` ids); Estimator keeps the state so a new plan resets to Tab 1.
  Underline styling with tokens, 44px targets. Copy in `estimatorCopy`.
- New `tests/e2e/estimator-tabs.spec.ts` (6 tests, focus asserted with `toBeFocused`).

**Verified**
- `npm run check` passes; Playwright 71/71. Tab crops 320/1440 light+dark + focus clean. reviewer: no findings.

**Next up**
- M2: Manual test with a real API key locally (Izzat runs it) [prompt-engineer].

**Waiting on Izzat**
- Merge the PR. Then the next task needs Izzat to run the estimator with a real key in `.env.local`.

---

## 2026-11-05 — Session 19: M2 results Tab 2

**Done**
- `feat(ui)`: role chips from `roleTotals`; task table with one `<tbody>` per phase (rowgroup header,
  subtotal row), total footer, focusable scroll region on mobile. `fix`: `normalisePlan` keeps exact
  half-hour `totalHours` (was rounded, so footer and summary could disagree with subtotals).
- ROADMAP: M3 CI item gets the agreed follow-up (branch protection, auto-delete head branches).

**Verified**
- `npm run check` passes (42 unit); Playwright 65/65 (develop had 61, not 65 as PR #4 said). Tab 2 crops clean.

**Next up**
- M2: Accessible tabs with keyboard support [ui-builder].

---

