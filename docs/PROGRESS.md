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
- PR #24 (OG metadata) updated from `develop` after this merged; its CI now runs in the container. `.claude/settings.json` still local.

---

## 2026-11-11 — Session 33: M5 Open Graph and metadata

**Done**
- `app/opengraph-image.tsx` (1200×630, static), `icon.tsx`, `apple-icon.tsx`; Bricolage Bold TTF + OFL
  in `app/fonts/`; colours from `lib/tokens.ts` (parses globals.css; contrast test reuses it).
- Full metadata in `layout.tsx` (metadataBase, canonical, openGraph, twitter large image, robots);
  `siteUrl` and OG copy in `content.ts`. e2e `metadata.spec.ts`.

**Verified**
- `npm run check` 191 unit; e2e 88/88. Production build head: absolute https og/twitter images; image
  routes 200 PNG; card and icons inspected. reviewer: no blockers, nits fixed.

**Waiting on Izzat**
- After release: LinkedIn Post Inspector to refresh the card. `.claude/settings.json` still local.

---
