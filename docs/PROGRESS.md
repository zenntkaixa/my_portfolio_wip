# Progress log

Newest entry first. Each session adds one entry of 12 lines or fewer: done, verified, next up,
waiting on Izzat. Keep the latest two entries here; move older ones to `docs/progress-archive.md`.

---

## 2026-11-19 — Session 66: Estimator review, Batch A (M14)

**Done** on `feat/m14-estimator-phone-conversion`
- Five-role review of the estimator (mocked API, no spend); findings ranked into Batches A, B and C (ROADMAP M14).
- Batch A built: phone task table, focus and scroll to results on submit, hero demo link, step-by-step wait,
  contact line under plans, chip focus, client plan validation and error boundary, small layout fixes.
- Fixed in review: the submit scroll ran before the render that removes the preview link (results ended 62px
  above the screen); the test now requires the step line fully on screen.

**Verified** `npm run check` (271), e2e 123 passed. **Next** Batch B when Izzat approves (needs one Haiku check).
**Waiting on Izzat** contingency as row or range; Upstash caching of descriptions (privacy); Haiku check OK.

---

## 2026-11-19 — Session 65: Pre-release batch (M13)

**Done** on `feat/m13-cv-and-estimator-layout`
- Claims softened per Izzat (#76 checks 1 to 3; Beyondsoft field kept); degree is "Bachelor of Computer
  Science (Software Engineering) with Honours". CV v4 and the LinkedIn doc in his Drive updated to match.
- "Download CV" in the hero: `public/izzat-fahmi-cv.pdf`, made from CV v4 without the phone number, clients
  anonymised (checked with `pdftotext`). Closes M10.
- Estimator: phone link above the form jumps to the example plan; desktop form is sticky beside the plan.
- Display name is now "Mohd. Izzat Fahmi Suhaimi" (first "Mohd. Izzat Fahmi", last "Suhaimi"), also in og:profile tags.
- Released (#82); PageSpeed 97/100/100/100 mobile, 100 across desktop. Then initials "MIFS" and the web CV heading.
- Borrowed from Astryx as ideas only: sliding segment highlight, week labels under the plan timeline.

**Verified** `npm run check`, e2e 113 passed. **Next** release PR when Izzat asks.
**Waiting on Izzat** check CV v4's layout in Word; AIA/OCBC on the private CV; update LinkedIn.

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
