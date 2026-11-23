# Progress log

Newest entry first. Each session adds one entry of 12 lines or fewer: done, verified, next up,
waiting on Izzat. Keep the latest two entries here; move older ones to `docs/progress-archive.md`.

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

## 2026-11-23 — Session 74: Desktop layout: role column and wider page (M14)

**Done** on `feat/m14-desktop-layout` (Izzat spotted it on a desktop monitor)
- Release #97 live: How it's built panel with live numbers (10 plans, 13.3 s median); row 16 ok under the new
  prompt.
- Tasks tab: with long live task names, Role cells shrank to 74 px and "Architect", "Frontend", "Backend",
  "DevOps" broke mid-word, because the results' `overflow-wrap: anywhere` lets table columns go below one
  word. Role cells are now `nowrap`; reproduced and fixed at 1280, 1440 and 1920.
- New e2e regression test (fails without the fix).
- Page widened 1200 → 1440 px (Izzat, option 1): estimator results column 510 → 630 px at 1440+; tile prose
  capped at 70ch; Now tile stats stack under 520 px. 1024 and 1280 unchanged.
- Roles as outlined pills with a colour dot (7 `--role-*` tokens, ≥3:1 in both themes), role chips as the
  legend, a "current" pill, and "AI" / "Added by code" tags on task rows (Izzat, option B).
- Verified: check 379 unit, full e2e 157; reviewer no blockers.

**Next** bumps from 27 Nov and 2 Dec; Neon usage review; the flaky batch-a tests under load.

---
