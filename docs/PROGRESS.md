# Progress log

Newest entry first. Each session adds one entry of 12 lines or fewer: done, verified, next up,
waiting on Izzat. Keep the latest two entries here; move older ones to `docs/progress-archive.md`.

---

## 2026-11-25 — Session 103: no Vercel previews for task branches

**Done** on `chore/vercel-skip-task-previews` (Izzat: Functions Storage near the Hobby 10 GB limit, "option 2").
- Cause: every task-branch push got a preview deployment, and each one stores its function bundles (about 50–100 MB;
  `sharp` libvips is about 36 MB of it). Usage grew after Nov 10, in step with about 130 PRs.
- `vercel.json` `git.deploymentEnabled`: only `main` and `develop` build (Izzat: one production, one preview; batch task PRs). Only `ci` is a required check, so PRs
  are not blocked. Deployment doc updated.
- check 418; security-reviewer: no blockers.
- Waiting on Izzat: check the Projects split on the Functions Storage card; `.claude/settings.json` has an
  uncommitted edit that empties `deny`/`ask` (not part of this PR).

## 2026-11-25 — Session 102: R2 refine stability measured, prompt rule dropped (M15)

**Done** on `chore/m15-refine-overlap-eval` (Izzat: "do R2", then "option 2"; live eval allowed, two runs).
- Eval prints "refine task overlap" (share of old tasks kept, reworded names count) with a same-brief baseline.
- A "keep the same phases and task names" prompt rule kept 17% and 24% (baseline 39%, 52%); reverted, no gain.
- Open question: the "large" brief was refused ("one feature at a time") in both runs; no control run, so not
  known whether that predates this session.
- Next: release G4a and R3 when Izzat asks; option 1 (send previous task names) only if refines matter to visitors.

