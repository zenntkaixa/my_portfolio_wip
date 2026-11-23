# Progress log

Newest entry first. Each session adds one entry of 12 lines or fewer: done, verified, next up,
waiting on Izzat. Keep the latest two entries here; move older ones to `docs/progress-archive.md`.

---

## 2026-11-23 — Session 77: Plan feedback line and launch checks (M14)

**Done** on `feat/m14-plan-feedback` (Izzat).
- Live plans get "Spotted something off in this plan? Tell me", a mailto with the plan title as subject
  (not on the hand-written example; hidden in print). New e2e for the href.
- `app/favicon.ico`: the 32px icon wrapped in an ICO, so `/favicon.ico` no longer 404s.
- Lighthouse 13.6 on production: mobile 91–93 / 100 / 100 / 100, desktop 92 / 100 / 100 / 100. Only miss is
  TBT 330 ms (one 306 ms hydration task); post-launch item.
- Spike check: no DAILY_LIMIT or RATE_LIMIT_PER_HOUR env in production, so the defaults apply (150/day, 5 per
  visitor per hour). Plans cost at most US$0.002, so 150 is at most US$0.31 a day. Raising it is Izzat's call.
- Verified: check 380, full e2e 160 (`--workers=2`).
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
