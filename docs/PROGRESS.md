# Progress log

Newest entry first. Each session adds one entry of 12 lines or fewer: done, verified, next up,
waiting on Izzat. Keep the latest two entries here; move older ones to `docs/progress-archive.md`.

---

## 2026-11-10 — Session 23: M3 unit tests

**Done**
- Unit tests for `validateRequest` edges, `normalisePlan` caps/clamps/totals/fallbacks, `rateLimit`
  window, `retryAfter`, day rollover, per-IP isolation (fake timers); `timeline` already covered (16).
- Fixes: `normaliseRole` maps model roles onto the 7 spec roles (aliases, unknown → Backend, own keys
  only after reviewers caught a `"constructor"` prototype hit); rate limiter sweeps stale IPs hourly;
  `teamSize` must be a JSON number now (Izzat: strict), so `"4"` is a 400.

**Verified**
- `npm run check` 135 unit (was 62). reviewer + security-reviewer: no blockers after the fix.

**Waiting on Izzat**
- `.claude/settings.json` still has local edits (not committed).

---

## 2026-11-05 — Session 22: M2 estimator security review (closes M2)

**Done**
- security-reviewer: 1 High, 2 Medium, 6 Low, 3 Info; `npm audit` clean. All fixed: Turnstile before
  limits, action + optional hostname check, CSP + HSTS, 415/413 limits, capped model error, safe env
  limits, `stripFeatureTags`, generic 503, `.env*` ignored. `docs/security-review-m2.md` records it all.
- ROADMAP: new M4 item for production guards (dummy Turnstile keys, missing `TURNSTILE_HOSTNAME`).

**Verified**
- `npm run check` 62 unit; e2e 72/72; CSP/Turnstile/theme 13/13 on a production build. reviewer and
  security-reviewer re-check: no blockers.

**Waiting on Izzat**
- `.claude/settings.json` has empty deny/ask lists locally: restore or keep on purpose (not committed).

---
