# Progress log

Newest entry first. Each session adds one entry of 12 lines or fewer: done, verified, next up,
waiting on Izzat. Keep the latest two entries here; move older ones to `docs/progress-archive.md`.

---

## 2026-11-23 — Session 77: Plan feedback email line (M14)

**Done** on `feat/m14-plan-feedback` (Izzat).
- Under a live plan: "Spotted something off in this plan? Tell me", a mailto with the plan title in the
  subject. Not on the hand-written example. Copy in `estimatorCopy.feedback`; hidden in print like the CTA.
- New e2e: the link's href, and none on the example. Verified: check 380, full e2e 160 (`--workers=2`).
- VM on 3 vCPUs still logged two 24 s soft lockups (08:17, outside the test run).

**Next** launch plan step 2 (Izzat's content calls, repo name); favicon.ico, spike check, Lighthouse.

---

## 2026-11-23 — Session 76: Three small fixes (M14)

**Done** on `fix/m14-submit-jump` (Izzat: my suggestion from the backlog).
- Review task is capped at the hours the agents saved: tasks already at the 0.5 h floor got a review
  that made AI cost more (0.5 vs 1 h; four 0.5 h tasks 2 vs 2.5 h). No review row when nothing is saved.
- Print: "What changed the numbers" now prints when closed (print-only `::details-content` rule).
- HSTS gains `includeSubDomains` (`.dev` is preloaded anyway); security-reviewer: no blockers.
- Verified: check 380; full e2e 158/159, the miss an axe scan stalled >27 s (2.8 s alone, 6/6).
  VM now 3 vCPUs and 0 soft lockups, but the suite is slower (4.5 min).

---
