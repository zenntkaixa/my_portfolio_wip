# Progress log

Newest entry first. Each session adds one entry of 12 lines or fewer: done, verified, next up,
waiting on Izzat. Keep the latest two entries here; move older ones to `docs/progress-archive.md`.

---

## 2026-11-25 — Session 99: release prep, B4f fix (M14)

**Done** on `fix/m14-b4f-refine-only` (Izzat: "go for release").
- Full e2e on `develop` failed 1/181: B4f also scrolled a plain desktop submit when the results top was off screen
  (batch-a large-desktop test). Now refines only. Spec B4e wording made exact (docs-auditor).
- check 416; estimator + batch-a 105/105 on 5 repeats (2 focus flakes in an earlier 42-run, not reproduced).
- security-engineer: no findings, audit 0. release-engineer: green, no env/API/deps changes. docs-auditor: 1 fix.
- Next: merge this, then the release PR develop to main, then the dev-update with word counts.

## 2026-11-25 — Session 98: finish the refine work, B4g, B4e, B4f (M14)

**Done** on `feat/m14-concision` (Izzat: "finish the refine work", live run allowed this round).
- B4g: `stickyFacts` keeps facts stated before a refine, so confidence never drops; eval case "leave-refined".
- B4e: `taskDiff` matches reworded names (Jaccard of words ≥ 0.6), each old task once. Phase and role not used.
- B4f: on desktop a refine scrolls the results top into view when it is off screen (test fails without the fix).
- Live Haiku eval (US$0.009): 7 plans all one-sentence summaries (20–28 words, W3 prompt works); leave refined
  medium to high; leave repeat 260 h vs 268 h, 19 tasks both; vague, recipe and injection refused. "medium"
  flagged the AI/seniority word check (not inspected).
- check 416; e2e estimator, batch-b, keyboard 17/17.

---
