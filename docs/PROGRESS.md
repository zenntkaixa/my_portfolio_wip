# Progress log

Newest entry first. Each session adds one entry of 12 lines or fewer: done, verified, next up,
waiting on Izzat. Keep the latest two entries here; move older ones to `docs/progress-archive.md`.

---

## 2026-11-05 — Session 15: branch strategy change (Izzat's instruction)

**Done**
- `chore`: task branches off `develop`, one PR per task into `develop`; Izzat merges. Releases are PRs
  `develop` → `main`. ADR-004; CLAUDE.md section 1/4/6/7, `/next-task` and `/ship` updated.

**Verified**
- Docs-only; no code changed.

**Next up**
- M2: `lib/timeline.ts` implemented; unit tests green [prompt-engineer or qa-tester].

**Waiting on Izzat**
- Merge this PR. Optional: protect `develop` and `main` on GitHub (require PR before merge).

---

## 2026-11-05 — Session 14: M2 submit flow and error states

**Done**
- `feat(ui)`: idle → submitting → success | error. Disabled fieldset, skeleton + polite "Planning phases…",
  `aria-busy`. 400 inline (textarea focused); 403/422/503 banners; 429 warn banner + Retry-After countdown
  on the button; 502/504/network Retry gated on a fresh token. Non-JSON bodies, `isPlan` guard, abort on
  unmount, focus to banner/results heading, footer note. Copy in `estimatorCopy`.
- New `lib/estimatorClient.ts` (+10 unit tests) and `tests/e2e/estimator-submit.spec.ts` (10 tests).

**Verified**
- `npm run check` passes; Playwright 58/58. 12 estimator crops clean. code-reviewer: no blockers, fixes applied.

**Next up**
- M2: `lib/timeline.ts` implemented; unit tests green [prompt-engineer or qa-tester].

**Waiting on Izzat**
- Backlog (unchanged): siteverify `hostname` check in `route.ts`; per-instance rate limit.

---

