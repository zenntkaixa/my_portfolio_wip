# Progress log

Newest entry first. Each session adds one entry of 12 lines or fewer: done, verified, next up,
waiting on Izzat. Keep the latest two entries here; move older ones to `docs/progress-archive.md`.

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
