# Progress log

Newest entry first. Each session adds one entry of 12 lines or fewer: done, verified, next up,
waiting on Izzat. Keep the latest two entries here; move older ones to `docs/progress-archive.md`.

---

## 2026-11-24 — Session 90: B4d refine reason as a task diff (M14)

**Done** on `feat/m14-refine-diff` (Izzat: "go ahead with B4d as proposed").
- `taskDiff` and `taskNames` in `lib/refine.ts`; `refine.why` now says "Added: … Removed: …" (3 names, then "and N more"),
  or "Same tasks; hours re-estimated." when only hours moved. Shown whenever hours or tasks change, so the 5% threshold is gone.
- The review-inserted task is left out of the diff. Unit tests added; docs-only wording on the site not needed (no threshold left).
- check 388, e2e 178. Reviewer skipped (small diff).

**Next:** S3 5-second test is Izzat's; B5 share link needs a privacy call and an ADR.

---

## 2026-11-24 — Session 89: refine fixes from the 22:40 and 22:45 reviews (M14)

**Done** on `fix/m14-refine-polish` (Izzat: "resume" after the sync update).
- E12b: reproduced at 950 and 360 px (heading about 1,000 px above the screen after a refine). Cause: the
  loading height was released a render after the plan, so the page shrank under a smooth scroll already
  aimed at the old position. Now released with the plan; moves over a screen are instant. New e2e fails on the old code.
- B4c: refine form names the human check by the Estimate button and adds "Go to the human check".
- B4a auto-growing answers; B4b "More/Fewer hours: …" reason.
- Q1: homework and status page plans differ but both total 178 h in 5 phases; not regenerated (costs a live call).
- check 386, e2e 178.

---

## 2026-11-24 — Session 88: B4 answer the questions and refine (M14)

**Done** on `feat/m14-refine` (Izzat: "start B4", plan approved with "go").
- `RefineForm` under the tabs: one input per open question, room counter, "Refine this plan" (`aria-disabled`
  with its reason). `lib/refine.ts` appends the answers to the brief; it is sent as a normal estimate, so no
  API, prompt or limit changes (no new attack surface).
- New plan shows "Refined from: … Now: …" (confidence, hours, build range).
- Tests: unit for the brief builder; e2e for the request body, comparison line and clearing; three specs updated
  for the second form. check 384, e2e 176.

---
