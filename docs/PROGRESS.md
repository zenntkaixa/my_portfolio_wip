# Progress log

Newest entry first. Each session adds one entry of 12 lines or fewer: done, verified, next up,
waiting on Izzat. Keep the latest two entries here; move older ones to `docs/progress-archive.md`.

---

## 2026-11-24 — Session 93: G4 radiozk preview GIF (M14)

**Done** on `feat/m14-radiozk-preview`.
- Recorded the live radiozk site with Playwright (play, FLAC live, now playing, Liked, About): 800x512, 15 frames, 290 KB.
  Shows a real track name, as Izzat asked.
- `featuredProject.preview` in `lib/content.ts`; `ProjectTile` renders a `<picture>`: still PNG under reduced motion,
  GIF otherwise (plain `<img>`, lazy, width/height set). `.project__preview` CSS, `docs/01b-tiles.md` updated.
- check 415; visual-check `#projects` at 1440 and 390 light: fine. The GIF shows the track on air at recording time.
- Re-record when radiozk's UI changes. Render free tier may be asleep; the capture needed one warm-up.

## 2026-11-24 — Session 92: G6 Experience Gantt timeline (M14)

**Done** on `feat/m14-experience-timeline` (Izzat: "do g6").
- `lib/careerSpan.ts` parses the existing `period` strings (no new copy); each row gets an aria-hidden bar on a 2017-to-now
  axis with year ticks. Career break is a hollow dashed bar. Growth animation only under no-preference motion.
- Reviewer fixes: axis `em` margin now matches the 7.5em period column; last row's spacing fixed under 420px.
- check 415 (5 new), e2e 180, visual-check on the tile (1440 and 390 light, 390 dark): no issues.
- "Now" freezes at build time (`shortcut:` comment); the tick year changes on the next deploy.

**Next:** S3, B5, G4/G5/C6, E6, G7 as before.

---

---
