# Progress log

Newest entry first. Each session adds one entry of 12 lines or fewer: done, verified, next up,
waiting on Izzat. Keep the latest two entries here; move older ones to `docs/progress-archive.md`.

---

## 2026-11-17 — Session 52: Next.js 16.4.6

**Done**
- `next` 16.4.4 → 16.4.6 (GHSA-mfr8-8qww-v76h, moderate; the affected cache feature is not used here).
  Asked for by Izzat. The notice that stopped `next build` and the dev server on alternate runs is gone.

**Verified**
- `npm audit`: 0 vulnerabilities; `npm run check` twice in a row, 256 unit; e2e 99/99.

---

## 2026-11-17 — Session 51: "With AI agents" working style on the estimator

**Done**
- New "Working style" control (Traditional team, the default / With AI agents). The request gains an
  optional `mode`; the prompt gets rules for AI-assisted plans (human review task per build phase,
  hours stay human effort, no fixed productivity claim). Plan shape unchanged. Izzat's idea; default,
  labels and prompt rules approved by him.

**Verified**
- 14 real Haiku runs on a local server (both styles): all returned plans; one fix from them
  (traditional plans no longer mention AI). `npm run check` 256 unit; e2e 99/99; `security-reviewer` (Opus): no findings; `reviewer`: no blocking
  findings; screenshots of the form at 320, 390 and 1440.
- `next build` stops on alternate local runs with a Next.js notice about 16.4.4 (GHSA-mfr8-8qww-v76h,
  moderate; the affected cache feature is not used here). Upgrade to 16.4.6 is a separate task.

**Waiting on Izzat**
- Undecided: Sonnet for visitors (about 20 times the cost per estimate); Hallmark redesign.

---

