# Progress log

Newest entry first. Each session adds one entry of 12 lines or fewer: done, verified, next up,
waiting on Izzat. Keep the latest two entries here; move older ones to `docs/progress-archive.md`.

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

