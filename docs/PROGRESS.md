# Progress log

Newest entry first. Each session adds one entry of 12 lines or fewer: done, verified, next up,
waiting on Izzat. Keep the latest two entries here; move older ones to `docs/progress-archive.md`.

---

## 2026-11-11 — Session 34: CI in the Playwright container

**Done**
- Izzat asked why PR #24's CI took 10+ min: `playwright install --with-deps` hung on apt (runners
  couldn't resolve `security.ubuntu.com`) and failed twice; normally 22–34 s. Not our code.
- `ci` job now runs in `mcr.microsoft.com/playwright:v1.64.1-noble` (digest-pinned): no apt, no
  browser download; Playwright version guard; step timeouts. ADR-007; 05-deployment CI section.

**Verified**
- security-reviewer: safe to ship (digest is the multi-arch index). Real test: this PR's CI run.

**Waiting on Izzat**
- PR #24 (OG metadata) re-run after this merges. `.claude/settings.json` still local.

---

## 2026-11-11 — Session 32: M4 live URL (closes M4)

**Done**
- README links https://my-portfolio-wip.vercel.app; repo "Website" set via `gh repo edit`; Izzat added
  the URL to LinkedIn. M4 complete on `develop`.

**Verified**
- Repo homepage reads back as the live URL. Docs only; CI on the PR.

**Waiting on Izzat**
- M4 release to `main` when wanted (README link). Next: M5 polish (OG image, Lighthouse Performance 71
  → 90, analytics ADR). `.claude/settings.json` still local.

---
