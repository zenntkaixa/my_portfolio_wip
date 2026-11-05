# Progress log

Newest entry first. Each session adds one entry of 12 lines or fewer: done, verified, next up,
waiting on Izzat. Keep the latest two entries here; move older ones to `docs/progress-archive.md`.

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

## 2026-11-05 — Session 16: adopt claude-team agents and skills (Izzat's instruction)

**Done**
- `chore`: Agent contract in CLAUDE.md for the generic `~/claude-team` agents; `code-reviewer`
  retired for `reviewer`; `/ship` follows `ship-pr` for git and PRs; `/next-task` offers ranked
  options when there's a real choice. ADR-005.

**Verified**
- Docs and config only; no code changed. No leftover `code-reviewer` references.

**Next up**
- M2: `lib/timeline.ts` implemented; unit tests green [prompt-engineer or qa-tester].

**Waiting on Izzat**
- Merge this PR, then say "PR merged".

---

