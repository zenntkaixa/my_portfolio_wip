# Progress log

Newest entry first. Each session adds one entry of 12 lines or fewer: done, verified, next up,
waiting on Izzat. Keep the latest two entries here; move older ones to `docs/progress-archive.md`.

---

## 2026-11-19 — Session 67: Estimator credibility, Batch B (M14)

**Done** on `feat/m14-estimator-credibility` (Izzat: contingency row, mixed RM 78, one Haiku check)
- Code enforces capacity (6 productive h per person-day; calendar stretched with a note), 20% contingency
  row, seniority hour multipliers, solo teams in sequence, "Questions to confirm" and "Not included", MVP slices.
- Structured outputs replace regex parsing; prompt moved to `lib/prompt.ts`; timeouts 4 s + 45 s; ADR-011.
- Security review: no blockers; added its fix (plans over 2000 days rejected).
- Haiku golden set, 11 cases + 1 probe (~2 US cents): all valid; vague and non-software get 422; MVP slice
  and injection behave; no calendar needed stretching. Mixed came out near junior (one sample each).

**Verified** see the PR. **Next** release PR for #84, #85 and this when Izzat asks; then Batch C.
**Waiting on Izzat** caching and share links (privacy call).

---

## 2026-11-19 — Session 66: Estimator review, Batch A (M14)

**Done** on `feat/m14-estimator-phone-conversion`
- Five-role review of the estimator (mocked API, no spend); findings ranked into Batches A, B and C (ROADMAP M14).
- Batch A built: phone task table, focus and scroll to results on submit, hero demo link, step-by-step wait,
  contact line under plans, chip focus, client plan validation and error boundary, small layout fixes.
- Fixed in review: the submit scroll ran before the render that removes the preview link (results ended 62px
  above the screen); the test now requires the step line fully on screen.

**Verified** `npm run check` (271), e2e 123 passed. **Next** Batch B when Izzat approves (needs one Haiku check).
**Waiting on Izzat** contingency as row or range; Upstash caching of descriptions (privacy); Haiku check OK.

---

