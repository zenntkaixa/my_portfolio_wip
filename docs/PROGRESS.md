# Progress log

Newest entry first. Each session adds one entry of 12 lines or fewer: done, verified, next up,
waiting on Izzat. Keep the latest two entries here; move older ones to `docs/progress-archive.md`.

---

## 2026-11-17 — Session 55: Confidence by counted facts; detailed brief chips

**Done**
- Confidence now counts six facts the description states (users, systems, data, integrations,
  limits, out of scope): high at 4+, medium at 2-3, low at 0-1. Its hint changes with the level.
- Each load shows two short examples and one of 8 detailed briefs ("Detailed brief: <title>"),
  so visitors can compare. Izzat's idea.

**Verified**
- 12 real Haiku runs: 8/8 briefs "high"; one-liners "low" (3) or "medium" (1). `npm run check` 260
  unit; e2e 99/100, the Tab-order test then passed 8/8 (known flake); screenshots at 390;
  `security-reviewer` (Opus): no findings.

**Next up**
- Cost budget (needs Izzat's currency, rates and which working styles).

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

