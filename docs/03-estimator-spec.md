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
    "totalHours": 180,
    "totalDays": 18,
    "calendarWeeks": 3.6
  },
  "inputs": { "teamSize": 4, "seniority": "mixed", "mode": "traditional" }
}
```

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

## Prompt
Lives in `app/api/estimate/route.ts` as `SYSTEM_PROMPT`. Owned by the `prompt-engineer` subagent.

- Roles allowed: `BA, Architect, Backend, Frontend, QA, DevOps, PM` (from `lib/estimate.ts`).
- Feature text is wrapped in `<feature>` tags and treated as untrusted data.
- Model returns JSON only. Server strips fences, parses, then `normalisePlan` clamps numbers,
  trims strings, caps array lengths and **recomputes all totals**. Never trust model totals.
- Default model: `claude-haiku-5-5` (cheapest). `ANTHROPIC_MODEL` env var can switch to Sonnet.
- Request: `max_tokens` 8000 on Haiku, 4000 on pricier models (`maxTokensFor`),
  `output_config: { effort: "low" }`, `thinking` omitted (adaptive by default; its tokens count
  against `max_tokens`). On failure the server logs only `stop_reason`,
  token usage and text length, never the feature or model text.

**Working style.** The user message carries `Working style: …`. For `ai-assisted` the prompt lowers hours
only for work agents do well (code, tests, boilerplate, scripts, configuration, docs), keeps hours as
human effort, puts a human review task in every build phase, shrinks the calendar less than the effort,
names the review bottleneck and separation of duties as risks, and never states a fixed productivity
gain. The plan shape is the same in both modes; the team line reads e.g. "2 people, senior, with AI agents".

## UI states
`idle → submitting → success | error`. While submitting: disable the form, show a skeleton of the
results area and a calm status line ("Planning phases…"). No spinners longer than needed.

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
- Wide table scrolls horizontally inside its own container on mobile.

Tabs use proper ARIA (`role="tablist"`, `aria-selected`, arrow-key navigation).

**Tab 3 — Budget** (`components/estimator/BudgetView.tsx`, numbers in `lib/budget.ts`), in MYR:
- **Build:** people cost = total hours × an assumed in-house rate per seniority (junior RM 40, mid
  RM 75, senior RM 120, mixed RM 80 per hour: mid-range Klang Valley salary × 1.3 for EPF, SOCSO, EIS
  and overheads ÷ 160 hours; approved by Izzat 2026-11-17). With AI agents, seats = team size × started
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
- Unit: `validateRequest`, `normalisePlan`, `lib/timeline.ts` (pure functions, no network).
- Unit: `tests/unit/route.test.ts` calls `POST` with `fetch` mocked for Turnstile and Anthropic.
- E2E: Playwright intercepts `POST /api/estimate` with `page.route` and returns
  `tests/fixtures/plan.json`. Never hit the real API in tests. Turnstile uses Cloudflare's test site key.
