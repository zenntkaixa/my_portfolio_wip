# Progress log

Newest entry first. Each session adds one entry of 12 lines or fewer: done, verified, next up,
waiting on Izzat. Keep the latest two entries here; move older ones to `docs/progress-archive.md`.

---

## 2026-11-17 — Session 59: Now stats count up; keyboard test on fake Turnstile (M7 done)

**Done**
- Release #69 (M6) confirmed live by Izzat: human check passes silently; a real "With AI agents"
  estimate ran through the new layout and the Budget tab.
- Now stats count up once on load: CSS-only `--stat-n` counter, real value in `.sr-only`, off under
  reduced motion. Scope cut with Izzat: no hover lift; timeline bars already animate.
- Keyboard Tab-order test now uses `./fakeTurnstile`: 20/20 runs pass (was about 4 in 8 failing).
- Izzat's instruction: batch tasks on one branch with fewer PRs (overrides one PR per task in
  CLAUDE.md section 4). Both M7 items ship in one PR.

**Verified:** `npm run check`, e2e; the count-up tests fail without the animation; `reviewer`: no blocking findings.

## M8 tidy-up, same branch
- Nine example chips and two brief titles shortened: every short chip is 2 lines at 320px, and the chip
  block is 149px on every load (was up to 40px of jump).
- Case studies keep 3 tags each; new one-line footer (`components/Footer.tsx`, copy in `lib/content.ts`).

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

