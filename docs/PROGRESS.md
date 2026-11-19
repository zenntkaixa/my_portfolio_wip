# Progress log

Newest entry first. Each session adds one entry of 12 lines or fewer: done, verified, next up,
waiting on Izzat. Keep the latest two entries here; move older ones to `docs/progress-archive.md`.

---

## 2026-11-19 — Session 61: Certification proof links (M10)

**Done**
- AWS and both EC-Council certifications link to their public verification pages (Credly, ASPEN),
  opening in a new tab; all four links checked by fetch (200, name and "Valid" on each page).
- Guidewire has no per-certificate page: a note links its Certification Checker with the name to search.
- Cert names wrap with `balance`; the note gets a full gap above it.

**Verified:** `npm run check`, e2e (new link test), visual check at 390 and 1440.

**Next:** release (M9 + M10); "Download CV" waits on Izzat's PDF; PageSpeed check after release.

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

