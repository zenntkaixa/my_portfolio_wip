# Progress log

Newest entry first. Each session adds one entry of 12 lines or fewer: done, verified, next up,
waiting on Izzat. Keep the latest two entries here; move older ones to `docs/progress-archive.md`.

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

## 2026-11-20 — Session 73: Prompt fact definitions and vague briefs (M14)

**Done** on `fix/m14-integrations-fact` (Izzat: my suggestion, then the follow-ups the evals showed)
- The six facts are defined concretely: a named user group counts as users, a named page or system as
  systems, any named outside service (WhatsApp, FPX, SMS, email) as integrations.
- New rule: a request with no concrete capability ("make our app better") gets the error answer; a short
  concrete one ("add dark mode") is planned. Eval gained a ninth brief for that.
- Three Izzat eval runs (US$0.0071, 0.0080, 0.0080). Final: 6 of 6 plans, 3 of 3 refusals, AI 10–12% lower,
  leave twice 264 vs 291 h with the same facts. Panel table updated.
- Verified: check 349 unit, full e2e 152.

**Next** release #95 and this together; bumps from 27 Nov and 2 Dec; Neon usage review.

---
