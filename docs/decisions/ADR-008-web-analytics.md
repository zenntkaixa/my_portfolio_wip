# ADR-008 — Vercel Web Analytics, script only

**Status:** Accepted (2026-11-12)

## Context
We want to know whether recruiters visit the site. Options: the plain Vercel tracker script, the
`@vercel/analytics` package (a dependency for the same page-view data on a one-page site), or no
analytics at all.

## Decision
- Render one `<script defer src="/_vercel/insights/script.js">` from `app/layout.tsx`. Vercel serves it
  same-origin once Web Analytics is enabled in the dashboard, so the CSP (`'self'`) needs no change.
- Only when `VERCEL_ENV === "production"` (`lib/analytics.ts`). Local dev, e2e and previews do not render
  it: the path 404s off Vercel and preview traffic would pollute the numbers.
- Page views only, no custom events, so no `window.va` queue and no package. Revisit
  `@vercel/analytics` only if custom events are wanted.

## Consequences
- Izzat must enable Analytics in the Vercel dashboard (Project → Analytics); until then the script 404s.
- Production only; nothing to see in local or preview.
- No cookies. Vercel derives an anonymous daily visitor hash from IP and user agent (not stored) and
  records path, referrer, country, device and browser. No consent banner and no copy change.
- Page views include the query string, so estimator input must never go in the URL.
- A small deferred script: re-check mobile Lighthouse after release (production is at 90–93, target 90).
- Subject to the plan's monthly event allowance.
