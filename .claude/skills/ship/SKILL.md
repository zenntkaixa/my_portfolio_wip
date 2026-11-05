---
name: ship
description: Verify, review, update the roadmap and progress log, then commit, push the task branch and open a PR into develop. Use when a roadmap task is finished.
disable-model-invocation: true
---

# /ship

Stop at the first failure and report it. Don't re-run work this task already did. Run on the task
branch, never on `develop` or `main`; if you're on either, create the task branch first (CLAUDE.md
section 4).

1. Confirm, from this session, that `npm run check` (and e2e for UI or behaviour changes) passed
   after the last edit. Re-run only if files changed since.
2. Confirm `/visual-check` ran for UI changes and `reviewer` ran (unless skipped as a small diff,
   CLAUDE.md section 4), with blockers fixed. For `app/api/`, `lib/rateLimit.ts`, env handling or
   `next.config.ts` changes, confirm `security-reviewer` ran. Run any that are missing.
3. Tick the finished item(s) in `docs/ROADMAP.md`.
4. Add a new entry at the top of `docs/PROGRESS.md` (12 lines or fewer). If there are now more than
   two entries, move the oldest to the top of `docs/progress-archive.md`.
5. Hand the git part to the `ship-pr` skill's steps (sync, stage by name, commit, push, PR body),
   with these project rules on top:
   - Stage **explicit paths** only; `.claude/settings.json` and `AGENTS.md` stay out unless Izzat
     asks. Commit in stages when the task has more than one concern (e.g. code, then docs).
   - Show Izzat the conventional commit message(s) and ask before pushing.
   - PR: `gh pr create --base develop`, title = the commit subject. Body: Summary (3 to 5 bullets),
     Roadmap item, Test plan (check, e2e counts, visual-check, reviewers), Not included, Deploy
     impact, then the PR attribution line.
   - No CI yet (M3), so skip `ship-pr`'s CI-watch step until `.github/workflows/` exists.
6. Run `sync` and `git fsck`, give Izzat the PR URL, and suggest `/clear`. Never merge the PR.
   When Izzat says "PR merged": `git switch develop && git pull`, delete the local task branch, then
   `/next-task`.
