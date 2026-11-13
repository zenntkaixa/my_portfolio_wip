# Progress log

Newest entry first. Each session adds one entry of 12 lines or fewer: done, verified, next up,
waiting on Izzat. Keep the latest two entries here; move older ones to `docs/progress-archive.md`.

---

## 2026-11-13 — Session 45: Refund a slot on unbilled AI errors (parked audit item)

**Done**
- When the Anthropic API answers with an error status, the visitor's slot and the daily count are given
  back, in memory and in Upstash (one atomic script). Timeouts, refusals and cut-off or unreadable
  replies keep the slot (those calls can be billed). Izzat approved this loosening (option 1).
- The feature text now rejects unpaired surrogates (400), from the security review.
- Earlier today: CLAUDE.md "Accepted risks" wording updated for ADR-009 (#48, released in #49).

**Verified**
- `npm run check` 247 unit; e2e 93/93; `security-reviewer`: no blocking findings.

**Waiting on Izzat**
- Parked: Hallmark; Dependabot alerts; e2e against the production build.

---

## 2026-11-13 — Session 44: Faster CI (at Izzat's request, outside the roadmap)

**Done**
- Browser tests that are not about Turnstile now load a fake widget (`tests/e2e/fakeTurnstile.ts`): five
  specs (a11y, estimator, estimator-submit, -results, -tabs). Real widget stays in four specs.
- CI skips the browser tests on PRs that change only `docs/` or root `*.md` files.

**Verified**
- `npm run check` 238 unit; e2e 93/93 in 70 s locally (CI step was 82 to 98 s; compare on this PR).

**Waiting on Izzat**
- Unchanged parked items: Hallmark; three audit items; stale CLAUDE.md "Accepted risks" wording.

---

