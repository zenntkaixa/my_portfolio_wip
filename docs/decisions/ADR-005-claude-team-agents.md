# ADR-005 — Adopt the claude-team generic agents and skills

**Status:** Accepted (2026-11-05)

## Context
radiozk ran smoothly on Izzat's `~/claude-team` repo: generic, read-only agents (`reviewer`,
`verifier`, `debugger`, `security-engineer`, `release-engineer`, `docs-auditor`) and skills
(`ship-pr`, `flaky-triage`, `bootstrap-agent-contract`) that carry no project facts and read an
*Agent contract* section in `CLAUDE.md`. They were already installed here but had no contract, and
this repo's own `code-reviewer` and `/ship` overlapped with them.

## Decision
- Add an *Agent contract* section to `CLAUDE.md`.
- Retire `code-reviewer`; the generic `reviewer` takes over, with the design-system and spec checks
  in the contract.
- Keep `security-reviewer` (Opus) for cost and abuse review of the estimator path. Use
  `security-engineer` for `npm audit` triage and pre-release threat models.
- `/ship` keeps the project steps (verify, ROADMAP, PROGRESS) and follows `ship-pr` for git and the PR.
- Builders (`ui-builder`, `api-engineer`, `prompt-engineer`, `qa-tester`) and the `next-task`,
  `visual-check` and `update-content` skills stay project-specific.
- The generic files are never copied into this repo; they're edited in `~/claude-team`.

## Consequences
- One review agent instead of two to choose between; its improvements arrive via `~/claude-team`.
- The CI-watch step of `ship-pr` stays off until the M3 GitHub Actions task lands.
- A fresh machine needs `~/claude-team/install.sh`, or the generic agents are missing.
