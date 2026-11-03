# ADR-002 — Abuse and cost protection for the AI demo

**Status:** Accepted (2026-11-03)

## Context
Every estimate costs Izzat money. The endpoint is public.

## Decision
Layered, cheapest first:
1. Input limits (20–1500 chars, team 1–12) in `validateRequest`.
2. In-memory per-IP rate limit (default 5/hour) and global daily cap (default 150) in `lib/rateLimit.ts`.
3. Cloudflare Turnstile token verified server-side before the paid call.
4. Haiku as the default model and `max_tokens: 2500`.
5. Monthly spend limit in the Anthropic Console as the hard backstop.

## Consequences
- In-memory limits are per serverless instance, so they're best effort.
- **Upgrade path:** if abuse appears, move limits to Upstash Redis (`@upstash/ratelimit`), which works
  across instances. Requires a new ADR and two env vars.
