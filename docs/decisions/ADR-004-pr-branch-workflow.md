# ADR-004 — Task branches and PRs into develop

**Status:** Accepted (2026-11-05)

## Context
Task work was committed straight to `develop`, so progress had no reviewable unit and no record
beyond commit messages. Izzat wants each piece of progress marked by a PR.

## Decision
- `main` = released versions (production deploys from it). `develop` = the release in development.
- Each roadmap task gets its own branch off `develop`, named `<type>/<milestone>-<slug>`.
- `/ship` pushes the branch and opens a PR into `develop`. Izzat reviews and merges; Claude never
  merges.
- Releases are PRs from `develop` into `main`, opened only when Izzat asks, after check and e2e pass
  on `develop`, merged with a merge commit.

## Consequences
- The ROADMAP tick and PROGRESS entry land on `develop` only when the PR merges, so `/next-task`
  checks for an open PR before picking the next item.
- Vercel builds a preview URL per PR, which helps Izzat review UI changes.
- One more step per session (Izzat's merge) in exchange for a reviewable history.
