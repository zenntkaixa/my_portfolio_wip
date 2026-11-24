# Progress log

Newest entry first. Each session adds one entry of 12 lines or fewer: done, verified, next up,
waiting on Izzat. Keep the latest two entries here; move older ones to `docs/progress-archive.md`.

---

## 2026-11-24 — Session 86: G2 budget charts, M6 and M7 readability, G1 request flow (M14)

**Done** on `feat/m14-budget-charts` (Izzat: "go G2"; sync review 18:55).
- Budget tab opens with "Where the build money goes": one stacked bar of the build total with a legend of
  every range. Contingency is accent hatching. The two-styles section opens with low-to-high range bars.
- Fills: `--accent`, `--model`, `--role-frontend`; dataviz validator passes CVD and contrast in both themes.
- Tables kept. New e2e ties the chart text to the table totals. Screenshots at 390 and 1280 px, both themes.
- M6: `--fs-sm` 15px; hints, notes, footer and chart notes moved off `--fs-xs` (labels and tags only). The
  summary is 2×2 on desktop too. M7: results sit on plain surface; the blueprint grid stays behind the form.
- G1: `RequestFlow`, the 8-step path tinted code (accent) vs model (`--model`) with a key. Static in "How it's
  built"; while a plan loads it ticks to the model step and waits there (replaces the skeleton and rotating steps).

---

## 2026-11-24 — Session 85: UX batch 1 from the 18:55 sync review (M14)

**Done** on `feat/m14-ux-batch1` (Izzat: "go batch 1, S1/S2 yes, E7 10").
- E5: `lib/examplePlans.json`, 43 Claude plans for every chip and brief at team size 4 (`npm run examples:generate`,
  US$0.0525). An unchanged chip at size 4 shows its saved plan at once: no request, token or rate-limit slot.
- E7: hourly limit default 5 → 10 (daily cap unchanged). E8: one-line answer under the plan title.
- E9: the four lists are disclosures, closed on phones. M5: Team card spans the row on phones.
- G3 fact dots and S1 `--model` token (#B06D00 / #F2C14E, ≥3.5:1 as a graphic); S2 gradient estimator edge.
- security-reviewer and reviewer: no blockers; saved-plan fallback hardened. check 381, e2e 171.

---
