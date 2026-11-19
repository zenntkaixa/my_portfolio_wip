# Progress log

Newest entry first. Each session adds one entry of 12 lines or fewer: done, verified, next up,
waiting on Izzat. Keep the latest two entries here; move older ones to `docs/progress-archive.md`.

---

## 2026-11-17 — Session 60: Estimator intro paints without the fade (M9)

**Done**
- Release #72 (M7 + M8) live and checked on production: count-up, footer, 3 tags, API 400 guard.
- Re-check of production: desktop 100 in all four; mobile accessibility, best practices and SEO 100.
  PageSpeed's keyless quota was used up, so mobile performance came from VM Lighthouse runs.
- Cause found: since M6's shorter hero summary, the mobile LCP element is the estimator's intro
  paragraph, and that tile faded in (render delay 3.3–4.6 s). It now uses `tile-rise` like hero and Now.

**Verified:** local production build, 4 mobile runs each: perf 73/73/80/82 → 93/83/87/88, LCP 3.8 → 2.7 s;
`npm run check`, e2e (motion spec now covers the estimator).

- 2026-11-19: Izzat's photo replaces the initials in the hero (`public/profile.webp`, 216px, 6 KB,
  no metadata; decorative `alt=""`). Brief's "no photo" decision updated. Icons and OG keep initials.

- Certifications: the five exam-based ones (Guidewire x2, EC-Council x2, AWS), newest first, with
  "Each one earned by passing a paid exam."; Claude Code 101 (a course) dropped. No credential IDs.

**Next:** confirm on PageSpeed Insights after release; CV PDF (needs Izzat).

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

