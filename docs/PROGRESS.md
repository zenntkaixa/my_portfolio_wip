# Progress log

Newest entry first. Each session adds one entry of 12 lines or fewer: done, verified, next up,
waiting on Izzat. Keep the latest two entries here; move older ones to `docs/progress-archive.md`.

---

## 2026-11-17 — Session 54: Shuffled example chips

**Done**
- The estimator shows 3 example features picked at random on each page load from 35 in
  `estimatorExamples` (`lib/pick.ts`): insurance, other industries and fun projects. Chips stay hidden, keeping their space, until the pick runs.
  Asked for by Izzat, who asked for the wider mix.

**Verified**
- `npm run check` 259 unit; e2e 100/100 (one earlier run: 2 a11y tests timed out on the first page
  load, passed on rerun with no change); 6 loads at 390: different picks, same height, layout shift 0.

**Next up**
- Cost budget (needs Izzat's currency, rates and which working styles).

---

## 2026-11-17 — Session 53: Result label hints, defined confidence, Haiku note

**Done**
- One-line hints under Effort, Calendar, Team and Confidence; a note under submit that the estimator
  uses Claude Haiku and the plan is a starting point, not a quote. Wording approved by Izzat.
- The prompt now defines "confidence" (how much of the plan rests on assumptions). Before, it was
  undefined and every test plan came back "medium".

**Verified**
- `npm run check` 256 unit; e2e 100/100; `security-reviewer` (Opus): no findings; screenshots at 390
  and 1440. 8 real Haiku runs: vague descriptions gave "low" (4/4), detailed ones "medium" (4/4).

**Next up (approved ideas)**
- Shuffled example chips from a larger list; cost budget (needs Izzat's currency and rates).

---

