# Progress log

Newest entry first. Each session adds one entry of 12 lines or fewer: done, verified, next up,
waiting on Izzat. Keep the latest two entries here; move older ones to `docs/progress-archive.md`.

---

## 2026-11-05 — Session 18: M2 results Tab 1

**Done**
- `feat(ui)`: summary `<dl>` (hours, weeks, team, confidence badge: ink text, tone on border + dot),
  timeline rows (label above a bar placed by `toBars`, week gridlines), phase cards, assumptions and
  risks sections. `fix(ui)`: index keys in TaskTable for repeated phase names.
- New `tests/e2e/estimator-results.spec.ts` (fixture geometry, summary, counts, 320 overflow, dup names).

**Verified**
- `npm run check` passes; Playwright 65/65. Tab 1 crops 320/1440 light+dark clean. reviewer fixes applied.

**Next up**
- M2: Tab 2: role total chips and grouped task table [ui-builder].

**Waiting on Izzat**
- Merge the PR, then say "PR merged".

---

## 2026-11-05 — Session 17: M2 timeline maths

**Done**
- `feat`: `lib/timeline.ts` — `toBars` (percent positions clamped to 0..100, whole-day labels "Day 3 to
  7" / "Day 3", half-day starts floored), `weekMarkers` (every 5 days, excludes 0 and 100),
  `roleTotals` (hours desc, ties by name). 16 unit tests replace the `it.todo` stubs.

**Verified**
- `npm run check` passes (41 unit tests). No e2e: no caller until Tab 1. reviewer skipped (small diff).

**Next up**
- M2: Tab 1: summary row, timeline chart, phase cards, assumptions and risks [ui-builder].

**Waiting on Izzat**
- Merge the PR, then say "PR merged".

---

