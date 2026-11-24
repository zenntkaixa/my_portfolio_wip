# Progress log

Newest entry first. Each session adds one entry of 12 lines or fewer: done, verified, next up,
waiting on Izzat. Keep the latest two entries here; move older ones to `docs/progress-archive.md`.

---

## 2026-11-24 — Session 82: Review round 3 (M14)

**Done** on `fix/m14-review-round3` (Izzat: "go, add both lines, re-run the eval").
- Seniority and working-style radios update the live plan at once (also under an error banner), no request;
  focus stays put and the status line says "Plan updated for…". Note: doesn't count toward the hourly limit;
  the 429 banner says the radios still work.
- Confidence card shows "N of 6 facts"; AI drivers state the real range and why it is wider.
- Eval re-run (Haiku, US$0.0080): 6/6 valid, 3/3 refused, detailed brief high, dark mode low, 4 medium;
  AI 11–13% fewer hours; repeat 226 vs 250 h. Table updated; "(dark mode)" label reworded.
- Verified: check 381, full e2e 164 (one run had the known startup flake; repeats green). Reviewer: no blockers.

---

## 2026-11-24 — Session 81: Review round 2 fixes (M14)

**Done** on `fix/m14-review-round2` (Izzat: "go, High at 5 or more"; career break yes; notice skipped).
- Same brief and team size: the browser rebuilds the saved scope (no request, token or rate-limit slot), so
  switching seniority or working style is never blocked and shows no cached note. New e2e counts requests.
- Confidence high at 5+ of 6 facts, medium 3–4, low ≤2 (spec, ADR-013). The example plan is now low (30%).
- Comparison table and copied plan add AI agent seats and the build total.
- Experience: "Career break, 2022 to 2023" (no role or field).
- Verified: check 381, full e2e 162; reviewer no blockers (docs drift fixed).
- Contact email is now hello@zenntkaixa.dev (Cloudflare Email Routing to Yahoo; Izzat tested delivery).

---
