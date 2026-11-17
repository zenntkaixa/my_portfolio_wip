# Progress log

Newest entry first. Each session adds one entry of 12 lines or fewer: done, verified, next up,
waiting on Izzat. Keep the latest two entries here; move older ones to `docs/progress-archive.md`.

---

## 2026-11-17 — Session 58: Hero headline with a proof line (M6 done)

**Done**
- Hero headline is now "I build the systems insurers and banks run on." (display font, `--fs-xl`),
  with a proof line under it: "Shipped at PwC · Allianz Technology · Hitachi" and "AWS Certified
  Solutions Architect". Wording picked by Izzat. The AI-agents angle moved into the summary.
- Search and share descriptions keep the fuller sentence via `seo.description`.

**Verified**
- `npm run check`, e2e, hero screenshots at 390/1024/1440 (light and dark). Small copy and CSS
  diff, so no `reviewer` run (CLAUDE.md section 4).

**Next:** M6 is complete. Release #67 and this when Izzat asks.

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

