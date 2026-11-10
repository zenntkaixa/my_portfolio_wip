# Progress log

Newest entry first. Each session adds one entry of 12 lines or fewer: done, verified, next up,
waiting on Izzat. Keep the latest two entries here; move older ones to `docs/progress-archive.md`.

---

## 2026-11-10 — Session 27: M3 release, M4 repo ready to go public

**Done**
- M3 released (PR #14 into `main`). Pre-public audit of all history and PRs: safe to publish.
- README for public visitors (CI badge, "What's worth a look", PR workflow); ROADMAP header fixes;
  413/415 rows in the estimator spec (docs-auditor). Repo description and topics set via `gh`.

**Verified**
- docs-auditor: README claims match code. Release: local + CI check/e2e green, `npm audit` clean.

**Waiting on Izzat**
- After merge: flip the repo public; then branch protection, auto-delete, secret scanning and push
  protection (Claude can apply via `gh api` with an OK). `.claude/settings.json` still local.

---

## 2026-11-10 — Session 26: M3 GitHub Actions CI

**Done**
- `.github/workflows/ci.yml`: one `ci` job on PRs/pushes to `develop` and `main` (npm ci, check,
  Playwright chromium, e2e); read-only token, SHA-pinned actions, no secrets, traces on failure.
- CLAUDE.md "green" = `ci` passed on the PR; `/ship` now watches CI; CI section in 05-deployment.

**Verified**
- security-reviewer: no blockers; SHAs match tags; no path to the real API. First real run is this PR.

**Waiting on Izzat**
- Auto-delete head branches (Settings). Branch protection is blocked while the repo is private on
  the free plan: do it when public (M4). `.claude/settings.json` still local.

---
