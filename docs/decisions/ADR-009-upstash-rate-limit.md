# ADR-009 — Shared rate limit and daily cap in Upstash Redis over REST

**Status:** Accepted (2026-11-12)

## Context
`lib/rateLimit.ts` kept the per-visitor limit (5 per rolling hour) and the global daily cap (150 per
UTC day) in memory. Each Vercel serverless instance has its own memory, so under load or a burst the
limits could be exceeded once per instance. ADR-002 named `@upstash/ratelimit` as the upgrade path. We
call Upstash's REST API with plain `fetch` instead: no new dependency, and an exact sliding log rather
than the package's approximated sliding window.

## Decision
- `lib/upstash.ts`: `upstashConfig(env)` returns `{ url, token }` only for a trimmed `https://` URL and
  a token; `upstashCommand` POSTs one command as a JSON array with `Authorization: Bearer` and a 1 s
  `AbortSignal.timeout`.
- One atomic Lua script (EVAL) per accepted Turnstile check: daily key checked first, visitor's sorted
  set trimmed to the last hour, blocked (with the oldest score for `Retry-After`) at the limit, else the
  hit is added and the day counter incremented. "Now" is the Next.js server's clock, not Redis time, so instances whose clocks differ can disagree by
  that skew. Blocked requests use no slot.
  Same limits, messages and `Retry-After` maths as the in-memory limiter.
- Keys: `est:{rl}:v:<sha256(ip), 32 hex>` (expires after 1 h + 60 s) and `est:{rl}:d:<YYYY-MM-DD>` (2 days).
  The shared `{rl}` hash tag keeps both in one slot, so the script also runs on a clustered database.
- Fallback, never fail-open: missing env vars, a network error, non-2xx, `{ error }`, an unexpected
  shape or the timeout all use the in-memory limiter for that request, with one short log line (no
  token, URL or IP). A block from Upstash is always honoured (odd scores only clamp `Retry-After` to
  1–3600 s). A request Upstash allows must also pass the in-memory limiter, which records it, so no
  instance is ever looser than the old per-instance limiter, during an outage or after it.

- Refund (2026-11-13): when the Anthropic API answers with an error status, which is not billed, the
  route gives the hit back. One more atomic script removes that hit's member and, only if it was still
  there, lowers the day counter (never below zero); the in-memory hit is removed too. Timeouts, refusals
  and cut-off or unreadable replies are not refunded, since those calls can be billed. A failed refund
  is logged and ignored.

## Consequences
- One extra network call per estimate that passes Turnstile (about 1 s worst case, then fallback).
- IPs are hashed before they leave the server. This is pseudonymisation, not anonymisation: an unsalted
  hash of an IPv4 address can be brute-forced. Keys expire on their own, so no clean-up job.
- At most one Upstash command per attempt (two when a hit is refunded), so the free tier's request allowance covers the 150-a-day cap.
- Replaces the `@upstash/ratelimit` upgrade path in ADR-002.
- Turnstile and the Anthropic monthly spend limit remain the real gates; this narrows the gap between
  instances, it does not replace them.
