---
name: ship
description: Verify, review, update the roadmap and progress log, then commit and push the current task. Use when a roadmap task is finished.
disable-model-invocation: true
---

# /ship

Stop at the first failure and report it. Don't skip steps.

1. `npm run check` (typecheck, unit tests, build). Must pass.
2. If UI files changed (`components/`, `app/`, `*.css`), run `/visual-check` and fix blocking issues.
3. If `app/api/`, `lib/rateLimit.ts`, env handling or `next.config.ts` changed, run the
   `security-reviewer` subagent. Blockers must be fixed.
4. Run the `code-reviewer` subagent on the diff. Blockers must be fixed.
5. Tick the finished item(s) in `docs/ROADMAP.md`.
6. Add a new entry at the top of `docs/PROGRESS.md`: date, what changed, what was verified, next up,
   anything waiting on Izzat.
7. `git add -A` and commit with a conventional message, e.g. `feat(ui): add hero and now tiles`.
   Show Izzat the message first.
8. Ask Izzat before `git push`.
