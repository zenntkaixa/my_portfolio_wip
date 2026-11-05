# Progress log

Newest entry first. Each session adds one entry of 12 lines or fewer: done, verified, next up,
waiting on Izzat. Keep the latest two entries here; move older ones to `docs/progress-archive.md`.

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

## 2026-11-05 — Session 21: M2 real-key test and estimator tuning

**Done**
- Izzat ran 5 real cases (Haiku 5.5). Run 1: larger feature 502'd (thinking ate `max_tokens` 2500);
  "mixed" made the model invent 3 people for a team of 2. Injection and non-software 422 were fine.
- `fix(api)`: `maxTokensFor` (8000 Haiku / 4000 others), `effort: "low"`, `stop_reason` handling
  (cut off 502, refusal 422), metadata-only logging, neutral "mixed" wording + team-size rule.
- Run 2: all 4 cases 200; senior team of 6 = 4 wk vs 6.4 wk for juniors. 7 route tests (mocked).

**Verified**
- `npm run check` 50 unit; e2e 71/71. security-reviewer and reviewer: no blockers, fixes applied.

**Next up**
- M2: Security review of the whole estimator path [security-reviewer].

---

