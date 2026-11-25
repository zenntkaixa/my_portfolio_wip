# Progress log

Newest entry first. Each session adds one entry of 12 lines or fewer: done, verified, next up,
waiting on Izzat. Keep the latest two entries here; move older ones to `docs/progress-archive.md`.

---

## 2026-11-25 — Session 96: concision quick wins (M14)

**Done** on `feat/m14-concision` (Izzat: "do the quick wins" from review 2026-11-25 15:50).
- W1 summary-card hints, W2 form notes (one line + "About plans"; code link inside "How it's built"), W3 lists
  closed at all widths with counts, W4 one "How costs are worked out" disclosure, W7 repeated "32" and "Eight years".
- Words in `main` at 360 px with the example plan: 1,283 on production, 1,205 here (estimator 509 to 433). Desktop
  saves more (lists were open there). W3 summary cap, W5 and W6 stay open.
- check 411, e2e 180 (estimator-submit 429 test flaked once under load; 106/108 repeats, base 36/36); visual-check
  `#estimator` 390 and 1440 light: no issues.

## 2026-11-25 — Session 95: remove the Experience Gantt bars (M14)

**Done** on `fix/m14-remove-experience-timeline` (Izzat: the horizontal timeline "is not pleasing my views").
- Reverted G6 (#128 code): bars, year axis, `lib/careerSpan.ts`, its tests, the CSS and the tile rules. The Experience
  tile is the vertical timeline it was before. No copy changed.
- check 411 (the 5 careerSpan tests went with it), e2e 180; visual-check `#experience` at 390 and 1440 light: no issues.
- Production still shows the bars until this ships; dev-update to follow with the next release.

---
