# Progress log

Newest entry first. Each session adds one entry of 12 lines or fewer: done, verified, next up,
waiting on Izzat. Keep the latest two entries here; move older ones to `docs/progress-archive.md`.

---

## 2026-11-17 — Session 57: Estimator shows its output first (M6)

**Done**
- Reviewed the 1,760 live sites in emmabostian/developer-portfolios; the best lead with an outcome
  and proof and show a working demo first. Izzat added M6 from it (#66).
- The estimator opens on the stored example plan (no request, no focus move); form and results sit
  side by side from 1025px. The "See an example plan" button is gone. Turnstile is
  `interaction-only`, with "Waiting for human check…" under submit while the token is pending.

**Verified**
- `npm run check`, e2e and screenshots at 390/1024/1440; `security-reviewer` (Opus): no blocking
  findings; `reviewer` found a focus pull after a field error, fixed and covered by a test.

**Next:** M6 item 2, hero headline with a proof line (Izzat approves the wording).

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

