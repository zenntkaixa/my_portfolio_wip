# ADR-001 — Next.js on Vercel, plain CSS

**Status:** Accepted (2026-11-03)

## Context
The site needs one server-side endpoint (to keep the Anthropic key secret), fast static pages, and
zero-ops hosting on a free tier. Izzat chose Next.js + Vercel.

## Decision
- Next.js 15 App Router, Server Components by default, one route handler for the estimator.
- Plain CSS with custom properties instead of Tailwind: a small, bespoke design system reads better in a
  portfolio repo and avoids build tooling.
- `fetch` to the Anthropic API instead of the SDK: one call, no dependency.

## Consequences
- Every new dependency needs an ADR.
- If styling grows painful, revisit with CSS Modules before reaching for Tailwind.
