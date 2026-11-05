---
name: ship
description: Verify, review, update the roadmap and progress log, then commit and push the current task. Use when a roadmap task is finished.
disable-model-invocation: true
---

# /ship

Stop at the first failure and report it. Don't re-run work this task already did.

1. Confirm, from this session, that `npm run check` (and e2e for UI or behaviour changes) passed
   after the last edit. Re-run only if files changed since.
2. Confirm `/visual-check` ran for UI changes and `code-reviewer` ran (unless skipped as a small diff,
   CLAUDE.md section 4), with blockers fixed. For `app/api/`, `lib/rateLimit.ts`, env handling or
   `next.config.ts` changes, confirm `security-reviewer` ran. Run any that are missing.
3. Tick the finished item(s) in `docs/ROADMAP.md`.
4. Add a new entry at the top of `docs/PROGRESS.md` (12 lines or fewer). If there are now more than
   two entries, move the oldest to the top of `docs/progress-archive.md`.
5. Stage **explicit paths** only (never `git add -A`; `.claude/settings.json` and `AGENTS.md` stay
   out unless Izzat asks). Show Izzat the conventional commit message first.
6. Ask Izzat before `git push`. After pushing, run `sync` and `git fsck`, then suggest `/clear`.
