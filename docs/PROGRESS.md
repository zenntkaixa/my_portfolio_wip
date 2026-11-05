# Progress log

Newest entry first. Each session adds one entry of 12 lines or fewer: done, verified, next up,
waiting on Izzat. Keep the latest two entries here; move older ones to `docs/progress-archive.md`.

---

## 2026-11-05 — Session 21: M2 real-key test and estimator tuning

**Done**
- Izzat ran 5 real cases (Haiku 5.5). Run 1: larger feature 502'd (thinking ate `max_tokens` 2500);
  "mixed" made the model invent 3 people for a team of 2. Injection and non-software 422 were fine.
- `fix(api)`: `maxTokensFor` (8000 Haiku / 4000 others), `effort: "low"`, `stop_reason` handling
  (cut off 502, refusal 422), metadata-only logging, neutral "mixed" wording + team-size rule.
- Run 2: all 4 cases 200; senior team of 6 = 4 wk vs 6.4 wk for juniors. 7 route tests (mocked).

**Verified**
- `npm run check` 50 unit; e2e 71/71. security-reviewer and reviewer: no blockers, fixes applied.

**Next up**
- M2: Security review of the whole estimator path [security-reviewer].

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

