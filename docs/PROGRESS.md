# Progress log

Newest entry first. Each session adds one entry of 12 lines or fewer: done, verified, next up,
waiting on Izzat. Keep the latest two entries here; move older ones to `docs/progress-archive.md`.

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

## 2026-11-05 — Session 15: branch strategy change (Izzat's instruction)

**Done**
- `chore`: task branches off `develop`, one PR per task into `develop`; Izzat merges. Releases are PRs
  `develop` → `main`. ADR-004; CLAUDE.md section 1/4/6/7, `/next-task` and `/ship` updated.

**Verified**
- Docs-only; no code changed.

**Next up**
- M2: `lib/timeline.ts` implemented; unit tests green [prompt-engineer or qa-tester].

**Waiting on Izzat**
- Merge this PR. Optional: protect `develop` and `main` on GitHub (require PR before merge).

---

