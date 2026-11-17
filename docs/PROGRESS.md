# Progress log

Newest entry first. Each session adds one entry of 12 lines or fewer: done, verified, next up,
waiting on Izzat. Keep the latest two entries here; move older ones to `docs/progress-archive.md`.

---

## 2026-11-17 — Session 56: Budget tab in MYR

**Done**
- Third results tab "Budget": people cost = hours × rate (junior RM 40, mid 75, senior 120, mixed
  80 per hour, including EPF and overheads); AI agent seats RM 80–400 per person per started month
  in AI mode; the model lists 3–8 one-off and monthly tool costs as ranges (capped at RM 200,000
  each). Build total and monthly running total; notes name the rates and say "planning only".

**Verified**
- 6 real Haiku runs gave sensible items. `npm run check` 266 unit; e2e 102/102; no sideways scroll at
  320 and 390; `security-reviewer` (Opus) and `reviewer`: no blocking findings.

**Next / waiting on Izzat:** review the PR; release #61–#63 and this when ready.

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

