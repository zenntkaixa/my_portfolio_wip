# ADR-012 — Usage events in Neon Postgres

**Status:** Accepted (2026-11-19)

## Context
The estimator had no record of what happened to each request beyond Vercel's short-lived logs: no
success rate, no cost per plan, no count to show visitors. Upstash Redis (ADR-009) already holds the rate
limit and, from M14, a 24-hour plan cache, but both are TTL data. Usage events need to last, be queried
with SQL (counts, sums, by outcome or day) and never expire on their own.

## Decision
- **Neon Postgres** (project `portfolio-sg` in Singapore `ap-southeast-1`, next to the Vercel functions in `sin1`; database `portfolio`, table `estimate_events`, DDL in
  `db/schema.sql`) for durable rows. Upstash stays for TTL data (rate limit, cache). Each store does
  what it is good at; neither replaces the other.
- **Dependency:** `@neondatabase/serverless`, pinned exactly to `1.2.0` (1.2.1 was under two weeks old
  when added). Its `neon(url)` HTTP query suits serverless: one HTTPS request per query, no pool.
- **What a row holds:** outcome, status, duration, model, token usage, cost in USD (from a per-model
  price table in `lib/estimator/events.ts`; unknown models store null), mode, seniority, team size, total
  hours, phase count, confidence, whether the calendar was stretched, and whether the cache served it.
  **Never** the feature text, the plan text, the IP or any upstream body.
- **One row per request that passed the human check** (`ok`, `rate_limited`, `upstream_error`, `timeout`,
  `cut_off`, `refused`, `unsupported`, `bad_plan`). `invalid_input`, `misconfigured` and `human_check_failed`
  are free for anyone to trigger, so they are logged only and never grow the table.
- **Written after the response** through `after()` from `next/server`, as one parameterised INSERT, so
  the visitor never waits for the database. Any error is caught and logged with the error name only.
- **Least privilege:** the app's role has `INSERT` and `SELECT` on the table and nothing else.
- **Config:** one server-only env var, `DATABASE_URL`. When it is unset (local, e2e, previews) the
  rows are skipped and `countPlans()` returns null.

## Consequences
- One new runtime dependency, used server-side only.
- A public "N plans generated" line can read `countPlans()` with a 1-hour revalidate, so the count
  costs at most one query an hour.
- A Neon outage loses rows for that time but never affects a visitor's response.
- Rows are pseudonymous metadata; there is nothing in them to tie a row to a person.
