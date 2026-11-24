# Progress log

Newest entry first. Each session adds one entry of 12 lines or fewer: done, verified, next up,
waiting on Izzat. Keep the latest two entries here; move older ones to `docs/progress-archive.md`.

---

## 2026-11-25 — Session 95: remove the Experience Gantt bars (M14)

**Done** on `fix/m14-remove-experience-timeline` (Izzat: the horizontal timeline "is not pleasing my views").
- Reverted G6 (#128 code): bars, year axis, `lib/careerSpan.ts`, its tests, the CSS and the tile rules. The Experience
  tile is the vertical timeline it was before. No copy changed.
- check 411 (the 5 careerSpan tests went with it), e2e 180; visual-check `#experience` at 390 and 1440 light: no issues.
- Production still shows the bars until this ships; dev-update to follow with the next release.

## 2026-11-24 — Session 94: release PR #130 and docs-audit fixes

**Done** (Izzat: "release", then "fix docs follow-up").
- Pre-release: check 415, e2e 180, `security-engineer` (no blockers, audit 0), `release-engineer`, `docs-auditor`.
  Release PR #130 (develop into main) open for Izzat to merge.
- Docs fixes on `docs/m14-audit-fixes`: architecture status cells and a `lib/estimateModel.ts` row, rate-limit note,
  README estimator paths and the two eval scripts.
- After the release merges: check Vercel, write the dev-update to the sync folder. Confirm prod `DAILY_LIMIT`.

---
