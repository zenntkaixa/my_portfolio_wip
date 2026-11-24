# Progress log

Newest entry first. Each session adds one entry of 12 lines or fewer: done, verified, next up,
waiting on Izzat. Keep the latest two entries here; move older ones to `docs/progress-archive.md`.

---

## 2026-11-24 — Session 87: phone-pass polish from the 21:06 sync review (M14)

**Done** on `fix/m14-polish-round5` (Izzat: "go").
- E12: after a result, the heading scrolls to the top on the next frame (it was left on the bottom edge or above
  the screen). New 360 px e2e fails on the old code, passes now.
- E13 "for a team of 8"; E14 whole headline hours and days; G9 fact dots fill by count.
- G10 RM ticks on the range bars; S4 new `--chart-neutral` token for tools (validator passes both themes);
  M9 desktop summary three across, Confidence full width.

---

## 2026-11-24 — Session 86: G2 budget charts, M6 and M7 readability, G1 request flow, E10 and G8 timeline, E11 coach (M14)

**Done** on `feat/m14-budget-charts` (Izzat: "go G2"; sync review 18:55).
- Budget tab opens with "Where the build money goes": one stacked bar of the build total with a legend of
  every range. Contingency is accent hatching. The two-styles section opens with low-to-high range bars.
- Fills: `--accent`, `--model`, `--role-frontend`; dataviz validator passes CVD and contrast in both themes.
- Tables kept. New e2e ties the chart text to the table totals. Screenshots at 390 and 1280 px, both themes.
- M6: `--fs-sm` 15px; hints, notes, footer and chart notes moved off `--fs-xs` (labels and tags only). The
  summary is 2×2 on desktop too. M7: results sit on plain surface; the blueprint grid stays behind the form.
- G1: `RequestFlow`, the 8-step path tinted code (accent) vs model (`--model`) with a key. Static in "How it's
  built"; while a plan loads it ticks to the model step and waits there (replaces the skeleton and rotating steps).
- E10 + G8: phase cards removed; each Gantt row carries "· N tasks" and the goal. Bars grow in 300 ms, staggered.
- E11: a static six-facts tip under a short typed brief. check 381, e2e 174.

---
