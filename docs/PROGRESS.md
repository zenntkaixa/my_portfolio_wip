# Progress log

Newest entry first. Each session adds one entry of 12 lines or fewer: done, verified, next up,
waiting on Izzat. Keep the latest two entries here; move older ones to `docs/progress-archive.md`.

---

## 2026-11-24 — Session 83: Review round 4 (M14)

**Done** on `fix/m14-review-round4` (Izzat: "go, all four").
- One timer: the hourly 429 text drops its fixed "Try again in N minutes"; the button countdown is the timer.
- Phones: tiles in DOM order (Hero, Now, Estimator), so "Right now" sits under the hero and visual, reading and
  focus order match (design doc updated). Turnstile now loads a little later there (it waits for the estimator).
- Phones: the confidence card spans both columns of the stat grid.
- Back to top: a 44px round arrow link pinned to the corner, faded in by scroll where supported; last Tab stop.
- Tests: a11y scan ignores the scroll-driven animation and pins the link; keyboard and visual tests updated.
- Verified: check 381, full e2e 166; phone and desktop screenshots checked; security-reviewer on rateLimit text.

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
