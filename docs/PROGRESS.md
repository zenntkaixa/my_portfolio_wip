# Progress log

Newest entry first. Each session adds one entry of 12 lines or fewer: done, verified, next up,
waiting on Izzat. Keep the latest two entries here; move older ones to `docs/progress-archive.md`.

---

## 2026-11-24 — Session 94: release PR #130 and docs-audit fixes

**Done** (Izzat: "release", then "fix docs follow-up").
- Pre-release: check 415, e2e 180, `security-engineer` (no blockers, audit 0), `release-engineer`, `docs-auditor`.
  Release PR #130 (develop into main) open for Izzat to merge.
- Docs fixes on `docs/m14-audit-fixes`: architecture status cells and a `lib/estimateModel.ts` row, rate-limit note,
  README estimator paths and the two eval scripts.
- After the release merges: check Vercel, write the dev-update to the sync folder. Confirm prod `DAILY_LIMIT`.

## 2026-11-24 — Session 93: G4 radiozk preview GIF (M14)

**Done** on `feat/m14-radiozk-preview`.
- Recorded the live radiozk site with Playwright (play, FLAC live, now playing, Liked, About): 800x512, 15 frames, 290 KB.
  Shows a real track name, as Izzat asked.
- `featuredProject.preview` in `lib/content.ts`; `ProjectTile` renders a `<picture>`: still PNG under reduced motion,
  GIF otherwise (plain `<img>`, lazy, width/height set). `.project__preview` CSS, `docs/01b-tiles.md` updated.
- check 415; visual-check `#projects` at 1440 and 390 light: fine. The GIF shows the track on air at recording time.
- Re-record when radiozk's UI changes. Render free tier may be asleep; the capture needed one warm-up.

---


---
