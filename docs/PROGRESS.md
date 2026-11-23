# Progress log

Newest entry first. Each session adds one entry of 12 lines or fewer: done, verified, next up,
waiting on Izzat. Keep the latest two entries here; move older ones to `docs/progress-archive.md`.

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

## 2026-11-23 — Session 75: Submit no longer jumps to the tiles below (M14)

**Done** on `fix/m14-submit-jump` (Izzat's bug report).
- Cause: on submit the old plan is swapped for a short skeleton, so the page shrank ~790 px and the
  tiles below the estimator rose into view; on success, focus() then snapped to the heading.
- Fix (`Estimator.tsx`): the results keep their height while loading (min-height from the old plan),
  and the new heading takes focus with preventScroll plus a smooth `nearest` scroll.
- New e2e at 1920: the estimator's bottom edge moves ≤2 px while loading (788 px before the fix).
- Verified: check 379, full e2e 158 (one earlier run hit the known "not stable" flake, 75/75 alone).
- Flaky e2e root cause (debugger): not code. The VirtualBox VM freezes for 48–280 s (`journalctl -k`
  "soft lockup", all vCPUs, boots of 19 and 20 Nov); a freeze times out the 2 tests in flight. CI is
  clean. Fix is on the host (fewer vCPUs than physical cores, no power saving); no timeouts or retries added.

---
