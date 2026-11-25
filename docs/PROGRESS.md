# Progress log

Newest entry first. Each session adds one entry of 12 lines or fewer: done, verified, next up,
waiting on Izzat. Keep the latest two entries here; move older ones to `docs/progress-archive.md`.

---

## 2026-11-25 — Session 98: finish the refine work, B4g, B4e, B4f (M14)

**Done** on `feat/m14-concision` (Izzat: "finish the refine work", live run allowed this round).
- B4g: `stickyFacts` keeps facts stated before a refine, so confidence never drops; eval case "leave-refined".
- B4e: `taskDiff` matches reworded names (Jaccard of words ≥ 0.6), each old task once. Phase and role not used.
- B4f: on desktop a refine scrolls the results top into view when it is off screen (test fails without the fix).
- Live Haiku eval (US$0.009): 7 plans all one-sentence summaries (20–28 words, W3 prompt works); leave refined
  medium to high; leave repeat 260 h vs 268 h, 19 tasks both; vague, recipe and injection refused. "medium"
  flagged the AI/seniority word check (not inspected).
- check 416; e2e estimator, batch-b, keyboard 17/17.

## 2026-11-25 — Session 97: concision rest, W3 summary, W5, W6 (M14)

**Done** on `feat/m14-concision` (Izzat: "keep building", same batch as session 96).
- W3: the plan summary shows its first sentence (`firstSentence`, covers saved plans); prompt asks for one
  sentence of at most 30 words. W5: refine reason caps names at 2 per side; "Plan re-drafted from your answers
  (+N h)." when more than half the old tasks are gone. B4e fuzzy matching not done.
- W6: radiozk description cut to one sentence, the three highlight bullets replaced by one tech line.
- check 413; targeted e2e (home, estimator x3, a11y) 78/80, the 2 a11y timeouts passed 30/30 on repeat;
  visual-check `#projects` and `#estimator` at 390 light: no issues. Reviewer skipped (small diff).

---
