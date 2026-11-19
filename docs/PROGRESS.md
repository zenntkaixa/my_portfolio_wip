# Progress log

Newest entry first. Each session adds one entry of 12 lines or fewer: done, verified, next up,
waiting on Izzat. Keep the latest two entries here; move older ones to `docs/progress-archive.md`.

---

## 2026-11-19 — Session 70: Review fixes, Batch D (M14)

**Done** on `feat/m14-batch-d` (Izzat: quick wins from the team review doc, no notice period)
- robots.txt and sitemap.xml; photo alt text; "AWS Certified Solutions Architect – Associate" in the hero.
- Filled primary "Estimate this feature" button; "excluding SST" dropped (in-house rates carry no SST).
- A kept plan under an error is dimmed and labelled "Previous plan for: …"; a chip over typed text offers
  Undo for 10 s; cache hits return `cached: true` and say so; short input gets a text hint.
- Contact list adds work mode (onsite, hybrid or remote) and Malaysian citizen; plan CTA now hiring-focused.
- Verified: check (316 unit), full e2e 137 passed, then Batch D, keyboard and Batch A specs after review fixes.

**Next** Batch E (deterministic estimator) once Izzat decides how AI factors may be shown.
**Waiting on Izzat** Neon Singapore rows 7–9 are rate_limited (no live ok row yet); old US East project.

---

## 2026-11-19 — Session 69: Housekeeping after the M14 release

**Done** on `chore/m14-housekeeping` (Izzat: items 1 and 4; bumps held)
- Release #88 live (main 6e808ef); first live estimate wrote Neon row 2 (ok, 15.3 s, US$0.0017).
- Stale docs fixed: tile hover (01), domain and resolved open items (00), CI watch (ADR-005), estimator
  only on zenntkaixa.dev (05).
- Visitor-side outcomes (invalid input, failed human check, rate limited) log as warnings, so Vercel's error
  view shows only server failures.
- Held by the two-week rule: Playwright 1.65.1 + CI image (from 27 Nov), Vitest 5.1.1 (from 2 Dec),
  `@neondatabase/serverless` 1.2.1 (from 27 Nov).

**Next** the bumps on those dates; usage review in Neon after 1–2 weeks of traffic.
**Then** Neon moved to Singapore (`portfolio-sg`, next to `sin1`): new `DATABASE_URL`, redeployed 18:30 UTC,
rows 2–6 copied with their IDs. Old US East project kept until Izzat decides.

---
