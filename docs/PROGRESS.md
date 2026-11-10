# Progress log

Newest entry first. Each session adds one entry of 12 lines or fewer: done, verified, next up,
waiting on Izzat. Keep the latest two entries here; move older ones to `docs/progress-archive.md`.

---

## 2026-11-10 — Session 24: M3 e2e coverage

**Done**
- Roadmap item was mostly covered by M2 specs (all tiles, happy path, 429, browser-mocked API;
  `route.test.ts` runs the real route with Anthropic `fetch` mocked). Topped up: the "every tile"
  test now includes case-study tiles from content; new no-console-error check on load + mocked submit.
- Skipped a full-stack e2e against a fake Anthropic server: it needs a base-URL env var that could
  send the key elsewhere if misset in production.

**Verified**
- `npm run check` 137 unit; e2e 73/73. Reviewer skipped (few-line test diff).

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
