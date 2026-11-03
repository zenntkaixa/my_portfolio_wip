---
name: next-task
description: Pick the next unchecked item from docs/ROADMAP.md and produce a short implementation plan for Izzat to approve. Use at the start of a work session or when Izzat says "what's next" or "continue".
---

# /next-task

1. Read the latest entry in `docs/PROGRESS.md`. If it lists a blocker or "Waiting on Izzat" item that
   affects the next task, mention it first.
2. Open `docs/ROADMAP.md` and find the **first unchecked** task, top to bottom. Don't skip ahead unless
   that task is blocked, and say so if you do.
3. Read only the docs that task needs (doc map in CLAUDE.md section 2).
4. Present a plan in this shape, then stop and wait for approval:

```
Next task: <roadmap line>
Milestone: <M#>
Agent(s): <subagent names>
Files: <files to create or change>
Steps:
  1. ...
  2. ...
Verification: <commands and checks>
Questions for Izzat: <only if genuinely blocking, else "none">
```

5. After approval, delegate to the named subagent(s), then follow the session loop in CLAUDE.md.
