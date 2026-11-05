---
name: next-task
description: Pick the next unchecked item from docs/ROADMAP.md and produce a short implementation plan for Izzat to approve. Use at the start of a work session or when Izzat says "what's next" or "continue".
---

# /next-task

0. `git switch develop && git pull`, then `gh pr list`. If the previous task's PR is still open,
   say so first and wait for Izzat to merge it (its ROADMAP tick isn't on `develop` yet).
1. Read only the latest entry in `docs/PROGRESS.md` (`head -40` covers it). Never read
   `docs/progress-archive.md` unless asked. If the entry lists a blocker or "Waiting on Izzat" item
   that affects the next task, mention it first.
2. Open `docs/ROADMAP.md` and find the **first unchecked** task, top to bottom. Don't skip ahead unless
   that task is blocked, and say so if you do.
3. Read only the docs that task needs (doc map in CLAUDE.md section 2), and only the relevant
   sections of long docs. Use targeted reads (`grep -n`, `sed -n`), not broad searches.
4. Present a plan in this shape, then stop and wait for approval:

```
Next task: <roadmap line>
Milestone: <M#>
Branch: <type>/<milestone>-<slug>, off develop
Agent(s): <subagent names>
Files: <files to create or change>
Steps:
  1. ...
  2. ...
Verification: <commands and checks, run once>
Size: <small (one subagent, maybe no review) | normal>  Model: <Sonnet | Opus, and why>
Questions for Izzat: <only if genuinely blocking, else "none">
```

5. After approval, create the branch (`git switch -c <branch> develop`), then delegate to the named
   subagent(s) and follow the session loop in CLAUDE.md.