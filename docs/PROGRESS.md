# Progress log

Newest entry first. Each session adds one entry of 12 lines or fewer: done, verified, next up,
waiting on Izzat. Keep the latest two entries here; move older ones to `docs/progress-archive.md`.

---

## 2026-11-17 — Session 51: "With AI agents" working style on the estimator

**Done**
- New "Working style" control (Traditional team, the default / With AI agents). The request gains an
  optional `mode`; the prompt gets rules for AI-assisted plans (human review task per build phase,
  hours stay human effort, no fixed productivity claim). Plan shape unchanged. Izzat's idea; default,
  labels and prompt rules approved by him.

**Verified**
- `npm run check` 256 unit; e2e 99/99; `security-reviewer` (Opus): no findings; `reviewer`: no blocking
  findings; screenshots of the form at 320, 390 and 1440.
- `next build` stops on alternate local runs with a Next.js notice about 16.4.4 (GHSA-mfr8-8qww-v76h,
  moderate; the affected cache feature is not used here). Upgrade to 16.4.6 is a separate task.

**Waiting on Izzat**
- The AI-assisted prompt has not been run against the real model (tests mock it): try one live
  estimate after release. Undecided: Hallmark redesign.

---

## 2026-11-16 — Session 50: Example plan button; 44px tap targets

**Done**
- "See an example plan" on the estimator shows the stored plan in `lib/samplePlan.ts` with no request
  (no Turnstile, slot or model call). It is labelled as an example and as written by hand; a live
  estimate replaces it. Wording approved by Izzat.
- Tap targets: text links in the hero, project and contact tiles, both link buttons, submit and the
  theme button are at least 44px tall; chips on touch screens too.

**Verified**
- `npm run check` 250 unit; e2e 98/98; `reviewer`: no blocking findings; `/visual-check` of the
  estimator, contact and hero tiles; the example view at 390.

**Waiting on Izzat**
- Optional: paste a real Claude reply to replace the hand-written example. Undecided: Hallmark redesign.

---

