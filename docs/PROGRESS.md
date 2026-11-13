# Progress log

Newest entry first. Each session adds one entry of 12 lines or fewer: done, verified, next up,
waiting on Izzat. Keep the latest two entries here; move older ones to `docs/progress-archive.md`.

---

## 2026-11-13 — Session 46: Hero contact row, design polish, Dependabot alerts (Hallmark option 2)

**Done**
- Hero: summary cut from 41 to 23 words (wording approved by Izzat); "Email me" button and LinkedIn link.
- Polish: `overflow-x: clip` on html and body, pressed states on buttons and chips, balanced heading and
  example chip wraps, skip-link padding on the 4px scale.
- Dependabot alerts switched on through the GitHub API at Izzat's request (0 open alerts); CLAUDE.md
  "Security tooling" and `docs/05-deployment.md` say so.

**Verified**
- `npm run check` 247 unit; e2e 95/95; `reviewer`: no blocking findings; `/visual-check` of the hero and
  estimator at 390 and 1440, light: no issues.

**Waiting on Izzat**
- Release of #50 and this PR. Parked: e2e against the production build; full Hallmark redesign.

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

