# 03 — Estimator spec ("Feature → Delivery plan")

## Purpose
Show recruiters, in one interaction, how Izzat thinks: requirements in, a realistic engineering plan out.
The output must look like something a real delivery lead would hand a team.

## Inputs (UI)

Above the form: the intro (`estimatorIntro`) and a "built by me" line linking the repo (`estimatorBuiltBy`, M11).

| Field | Control | Rules |
|---|---|---|
| Feature description | `<textarea>` with live character count; "(at least 20 characters)" shows from load until met | 20 to 1500 characters |
| Team size | Range slider plus number readout | Integer 1 to 12, default 4 |
| Seniority | Segmented control | `junior`, `mid`, `senior`, `mixed` (default `mixed`) |
| Working style | Segmented control | `traditional` ("Traditional team", default), `ai-assisted` ("With AI agents") |
| Human check | Cloudflare Turnstile widget (`appearance: "interaction-only"`: visible only if a challenge is needed) | Required; reset after every request |

**Example chips** above the textarea (click fills it), picked at random on each page load: two short
examples from `estimatorExamples` (35: insurance and billing, other industries, common building blocks,
fun projects) and one detailed brief from `estimatorBriefs` (8, about 350 characters each). The brief's
chip shows "Detailed brief: <title>" and fills the full text, so visitors can compare the confidence a
detailed description earns. The page is static, so the pick runs in the browser after hydration; the
chips stay hidden, keeping their space, until then. The first short example, "Let policyholders log in
with a one-time code sent by SMS", is also the example plan's feature.

**The results area starts as the example plan** (`lib/samplePlan.ts`: first example feature, 4 people,
mixed), rendered on the server, so the page shows its output first. A line above the heading says it is an
example and for which feature. On load nothing is fetched and focus does not move. Nothing is sent for it:
no Turnstile token, no rate-limit slot, no model call. A live estimate replaces it, and focus moves to the
results heading only after a submit. From 1025px the form and results sit in two columns; below that they stack.

## API contract

`POST /api/estimate`

Request:
```json
{ "feature": "string", "teamSize": 4, "seniority": "mixed", "mode": "traditional", "token": "turnstile-token" }
```
`mode` is optional (`traditional` when missing); any other value is a 400.

Success `200`:
```json
{
  "plan": {
    "title": "string",
    "summary": "string",
    "assumptions": ["string"],
    "phases": [
      { "name": "string", "goal": "string", "startDay": 0, "durationDays": 3,
        "tasks": [{ "task": "string", "role": "Backend", "hours": 12 }] }
    ],
    "risks": ["string"],
    "confidence": "low | medium | high",
    "costs": [{ "item": "string", "kind": "one-off | monthly", "low": 100, "high": 400 }],
    "openQuestions": ["string"],
    "outOfScope": ["string"],
    "totalHours": 180,
    "totalDays": 18,
    "calendarWeeks": 3.6,
    "calendarAdjusted": true
  },
  "inputs": { "teamSize": 4, "seniority": "mixed", "mode": "traditional" }
}
```

`openQuestions` (up to 3: what a BA would ask the requester before committing) and `outOfScope` (up to 3:
what the plan deliberately leaves out) are always present from the server (`[]` when the model gave none);
the client treats them as optional so older payloads still render. `calendarAdjusted` appears only when the
server stretched the calendar (see *Capacity check*).

Errors, always `{ "error": "human-readable sentence" }`:

| Status | When | UI treatment |
|---|---|---|
| 400 | Invalid body or input rules broken | Inline under the field |
| 413 / 415 | Body over 8 KB, or content type is not `application/json` | Not reachable from the UI (generic banner) |
| 403 | Turnstile failed | Banner, reset widget |
| 422 | Model says input isn't a software feature, or refuses (`stop_reason: refusal`) | Banner with the model's sentence (generic sentence on refusal) |
| 429 | Rate limit or daily cap (`Retry-After` header) | Warn-coloured banner, disable button |
| 502 / 504 | Model error, bad JSON, reply cut off (`stop_reason: max_tokens`), timeout | Banner with retry button |
| 503 | `ANTHROPIC_API_KEY` missing, (local setup), or production misconfiguration | Banner (shows during local setup only) |

A 502 caused by an error status from the Anthropic API (nothing was generated or billed) gives the visitor's
rate-limit slot and the daily count back. Timeouts, refusals and cut-off or unreadable replies keep the slot.

### Plan cache (M14)
Ok plans are cached in Upstash for 24 hours (`lib/estimator/cache.ts`). Key: `plan:<version>:` (the version is a hash of the full request settings, model, prompt and schema plus a manual `CACHE_REV` for `normalisePlan` changes, so changing any of them starts a fresh cache) + SHA-256 hex of
`JSON.stringify([feature trimmed, whitespace collapsed, lowercased, teamSize, seniority, mode])`; value: the
final normalised plan JSON; `SET ... EX 86400`. The cache is read after Turnstile and the rate limit (a hit
still uses a slot), and a hit returns the same 200 shape. Only ok plans are written, after the response. Any
Upstash error is a silent miss; without the Upstash env vars (local, e2e) the cache is off.

### Usage events and logging (M14, ADR-012)
Every request ends in exactly one outcome: `ok`, `invalid_input` (400/413/415), `misconfigured` (503),
`human_check_failed` (403), `rate_limited` (429), `upstream_error` (502, refunded), `timeout` (504),
`cut_off` (502), `refused` (422), `unsupported` (422, model `{error}`), `bad_plan` (502, unreadable or
incomplete). Its fields go to two places:
- **One JSON log line** (`{"event":"estimate", ...}`): `console.info` for ok, `console.error` otherwise,
  plus short context such as `stop_reason`, `error_type`, `error_name`, `text_length`.
- **One row** in Neon `estimate_events` (`db/schema.sql`), except for `invalid_input`, `misconfigured` and
  `human_check_failed` (free to trigger before the human check, so log only), written with `after()` so the visitor never
  waits; skipped when `DATABASE_URL` is unset. `cost_usd` comes from token usage and a per-model price
  table (unknown model: null). Cache hits store `cache_hit = true` and no model or usage.

Neither ever holds the feature text, plan text, IP or an upstream error body. `countPlans()` in
`lib/estimator/events.ts` returns the number of ok rows (null without `DATABASE_URL` or on error).

## Prompt
Lives in `lib/prompt.ts` (`SYSTEM_PROMPT`, `userMessage`, `requestBody`, `RESPONSE_SCHEMA`; pure functions
`lib/estimator/anthropic.ts` imports). Owned by the `prompt-engineer` subagent. ADR-011: the model proposes, code enforces.

- Roles allowed: `BA, Architect, Backend, Frontend, QA, DevOps, PM` (from `lib/estimate.ts`).
- Feature text is wrapped in `<feature>` tags and treated as untrusted data.
- **Structured outputs:** the body sends `output_config.format = { type: "json_schema", schema }`. The schema
  is `anyOf` the plan object or `{ error: string }`; every object has `additionalProperties: false` and all
  keys required; enums for `role`, `confidence` and cost `kind`; no min/max or array-size keywords (not
  supported), and no totals. The server `JSON.parse`s the first text block (no fence stripping); anything
  unparseable is the 502 "unreadable plan". `normalisePlan` stays the second check: it clamps numbers,
  trims strings, caps array lengths and **recomputes all totals**. Never trust model totals.
- **Seniority:** hours are sized for a mid-level baseline, then junior about 1.3x, senior about 0.85x,
  mixed about 1.0x (a 1 senior : 2 mid : 1 junior blend, a ratio, not a headcount).
- **Solo teams:** with 1 person, phases run in sequence (no overlap) and that person covers every role.
- **Scope:** huge or multi-feature requests get an MVP slice, said in the summary, with the deferred parts
  in `outOfScope`.
- **Capacity check** (`normalisePlan(raw, teamSize)`): 1 person-day = 6 productive hours (`HOURS_PER_DAY`,
  also stated in the prompt). If `totalDays < totalHours / (teamSize × 6)`, every phase's `startDay` and
  `durationDays` is multiplied by the same factor (rounded up to half days, so order and overlaps are kept),
  totals are recomputed and `calendarAdjusted: true` is set.
- **Timeouts:** Turnstile siteverify 4 s, Anthropic call 45 s (`maxDuration` 60 s).
- Default model: `claude-haiku-5-5` (cheapest). `ANTHROPIC_MODEL` env var can switch to Sonnet.
- Request: `max_tokens` 8000 on Haiku, 4000 on pricier models (`maxTokensFor`),
  `output_config: { effort: "low", format }`, no `temperature`/`top_p`/`top_k`, `thinking` omitted (adaptive by default; its tokens count
  against `max_tokens`). On failure the server logs only `stop_reason`,
  token usage and text length, never the feature or model text.

**Working style.** The user message carries `Working style: …`. For `ai-assisted` the prompt lowers hours
only for work agents do well (code, tests, boilerplate, scripts, configuration, docs), keeps hours as
human effort, puts a human review task in every build phase, shrinks the calendar less than the effort,
names the review bottleneck and separation of duties as risks, and never states a fixed productivity
gain. The plan shape is the same in both modes; the team line reads e.g. "2 people, senior, with AI agents".

## UI states
`idle → submitting → success | error`. While submitting: disable the form, move focus to the results
section and scroll it into view (smooth unless reduced motion; on phones the results sit below the form).
Show a plan-shaped skeleton (4 summary cards, 5 timeline bars), the status line ("Planning phases…",
announced once) and a visual-only step line that rotates every 2.5 s ("Reading your brief…" ...), plus
"Usually about 10 seconds." On success focus moves to the plan heading; on error to the banner.
A failed estimate never wipes the last successful plan (example or live): it stays below the banner.
Under every plan, above the footer note: "Want this scoped for your real project?" with Email me and
LinkedIn links (never a phone number). A chip click fills the field and puts the caret at its end.
The client rejects plans with malformed tasks or absurd totals (hours over 100000, days over 2000,
weeks over 400) with the "incomplete plan" banner, and an error boundary around the plan shows a short
fallback if rendering throws.

## Output tabs

**Tab 1 — Timeline** (default; was "Phases and timeline", shortened in M11 so tabs fit one line on phones)
- Summary row: total effort hours, calendar weeks, team (e.g. "4 people, mixed"), confidence badge.
  Each item has a one-line hint under its value (`estimatorCopy.summary.hints`). Confidence is defined
  in the prompt by counting six facts the description states (users, existing systems, data,
  integrations, limits, out of scope): high at four or more, medium at two or three, low at one or
  none. Its hint changes with the level (`hints.confidence.low|medium|high`).
- Under the submit button, a note says the estimator uses Claude Haiku for speed and the plan is a
  starting point, not a quote (`estimatorCopy.modelNote`).
- Timeline: one horizontal bar per phase. `left = startDay / totalDays`, `width = durationDays / totalDays`.
  Week gridlines every 5 working days, with "Week 1", "Week 2"... centred under each span (at most 6
  labels; long plans label every 2nd or 3rd week). Label "Day 3 to 7" on each bar. Maths lives in `lib/timeline.ts`.
- Phase cards below: name, goal, duration, task count.
- Assumptions and risks as two short lists.

**Tab 2 — Tasks**
- Role totals as chips above the table (hours per role, sorted descending).
- Table grouped by phase: Task · Role · Hours. Phase subtotal rows. Grand total footer.
- Below 600px the Role column is hidden and the role shows as a muted second line in the Task cell, so
  Task and Hours fit 320px with no sideways scroll.

Tabs use proper ARIA (`role="tablist"`, `aria-selected`, arrow-key navigation).

**Tab 3 — Budget** (`components/estimator/BudgetView.tsx`, numbers in `lib/budget.ts`), in MYR:
- **Build:** people cost = total hours × an assumed in-house rate per seniority (junior RM 40, mid
  RM 75, senior RM 120, mixed RM 78 per hour: mid-range Klang Valley salary × 1.3 for EPF, SOCSO, EIS
  and overheads ÷ 160 hours; approved by Izzat 2026-11-17; mixed is the 1 senior, 2 mid, 1 junior blend,
  set 2026-11-19). Contingency = 20% of people cost (`CONTINGENCY`, rounded to whole ringgit), its own row
  and part of the build total. With AI agents, seats = team size × started
  months of the calendar × RM 80–400 (standard to premium business seat). Plus the model's one-off items.
- **Running costs after launch:** the model's monthly items and their total.
- The model lists only tools and running costs (3 to 8, ranges, whole ringgit, only what the feature
  adds); it never prices people or seats. `normalisePlan` drops bad items, clamps each value to 0..200,000 and
  orders each range. Notes under the table name the rates and say the ranges are for planning only.

## Footer note under results
"Estimates are generated by Claude for illustration. Real plans need a real team's input."

Under the example plan: "This example was written by hand to show the format. Live estimates are
generated by Claude." The stored plan must never be presented as model output unless it is replaced by
a real reply.

## Testing
- Unit: `validateRequest`, `normalisePlan` (incl. the capacity check), `lib/prompt.ts`, `lib/budget.ts`,
  `lib/timeline.ts` (pure functions, no network).
- Unit: `tests/unit/route.test.ts` calls `POST` with `fetch` mocked for Turnstile and Anthropic.
- Unit: `tests/unit/estimatorService.test.ts` runs `runEstimate` with fake deps (order, refund, cache,
  outcomes); `tests/unit/estimatorEvents.test.ts` mocks the Neon driver and Upstash `fetch`.
- E2E: Playwright intercepts `POST /api/estimate` with `page.route` and returns
  `tests/fixtures/plan.json`. Never hit the real API in tests. Turnstile uses Cloudflare's test site key.
