# Progress log

Newest entry first. Each session adds one entry of 12 lines or fewer: done, verified, next up,
waiting on Izzat. Keep the latest two entries here; move older ones to `docs/progress-archive.md`.

---

## 2026-11-19 — Session 64: Astryx trial (ADR-010)

**Done** (Izzat's instruction, outside the roadmap)
- Installed Astryx (core, theme-neutral, cli, StyleX peer) after vetting; `init` agent docs kept in `AGENTS.md` only.
- Cobalt theme: Neutral extended with the site accent (`src/themes/cobalt/`), default in `astryx-themes.ts`.
- Wiring `<Theme>` + reset into the layout broke dark mode, fonts (CSP blocks Figtree) and list bullets
  (10 e2e failures), so Izzat chose to keep Astryx off the live site; previewed via the editor's PNGs instead.

**Verified** `npm run check`, e2e back to 110 passed. **Next** release M11 + M12 when Izzat asks.
- Hitachi settled: started at Hitachi eBworx (legacy work), moved to its subsidiary Hitachi Digital Host and
  was tasked with the microservices modernisation; site entry, case study, CV and LinkedIn doc updated.
**Waiting on Izzat** wording checks from #76, degree title, web-safe CV.

---

## 2026-11-19 — Session 63: Review polish (M12)

**Done**
- M11 merged (#76). Izzat's CV refined (3 pages, capability-first) and stored privately in his Google Drive,
  "Career docs" folder; not in this repo (phone number and client names).
- M12: estimator tile gets a 2px accent border; contact tile lists what Izzat is looking for.
- Review items already met, no change: skip link, consistent link styles, 44px tap heights.
- E2E now runs on a production server (`next start`; CI reuses the `check` build): the same 110 tests in
  1.1 min instead of 2.9 locally. Unit tests (2 s) were left alone; trimming them saves nothing.

**Verified** `npm run check` (266), e2e 110 passed, screenshots light/dark 1440 and 390, no sideways scroll.
**Next** Izzat's "push it", then a release. Deferred: example plan above the form on mobile, desktop space.
**Waiting on Izzat** wording checks from #76, Hitachi name, degree title, a web-safe CV for "Download CV".

---
