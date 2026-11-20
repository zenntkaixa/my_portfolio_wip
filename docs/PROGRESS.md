# Progress log

Newest entry first. Each session adds one entry of 12 lines or fewer: done, verified, next up,
waiting on Izzat. Keep the latest two entries here; move older ones to `docs/progress-archive.md`.

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

## 2026-11-20 — Session 72: How it's built panel (M14)

**Done** on `feat/m14-how-its-built` (Izzat: my suggestion)
- Batch E released (#94) and live: Neon rows 14–15 ok in about 10 s; golden set passed (US$0.0069).
- A closed-by-default "How it's built" panel in the estimator tile: request path, model proposes / code
  enforces, live numbers from Neon (30 days, shown from 5 plans), the dated eval table, ADR links.
- Eval script now in the repo: `npm run eval:estimator` (Izzat runs it; never CI; `--dry` makes no calls).
- Verified: check 349 unit, full e2e 152 passed; reviewer no blockers (labels now say "new plan").

**Next** integrations prompt fix (named services count); bumps from 27 Nov and 2 Dec; Neon usage review.

---
