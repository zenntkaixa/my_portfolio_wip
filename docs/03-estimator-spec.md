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

Success `200` (ADR-013: the body is the model's scope; the client builds the plan from it):
```json
{
  "scope": {
    "title": "string",
    "summary": "string",
    "assumptions": ["string"],
    "phases": [
      { "name": "string", "goal": "string", "startDay": 0, "durationDays": 3,
        "tasks": [{ "task": "string", "role": "Backend", "category": "code", "baseHours": 12 }] }
    ],
    "risks": ["string"],
    "facts": { "users": true, "systems": false, "data": true, "integrations": true, "limits": false, "outOfScope": false },
    "costs": [{ "item": "string", "kind": "one-off | monthly", "low": 100, "high": 400 }],
    "openQuestions": ["string"],
    "outOfScope": ["string"]
  },
  "inputs": { "teamSize": 4, "seniority": "mixed", "mode": "traditional" }
}
```

A cache hit adds `"cached": true` to this body; fresh scopes leave it out. The UI then shows a note that this is the saved plan.

`category` is one of `discovery, design, code, tests, docs-config, integration, security, uat, release`.
`baseHours` is effort for one mid-level engineer working without AI tools. `facts` says which of six
things the description states. The client checks the body with `isScope`, then calls
`buildPlan(scope, { teamSize, seniority, mode })` (`lib/estimateModel.ts`) and checks the result with
`isPlan`. The built `Plan` has `phases[].tasks[] = { task, role, category, hours }`, `confidence`,
`missingFacts`, `effort { best, likely, worst }`, `totalHours` (= `effort.likely`), `totalDays`,
`calendarWeeks` and `calendarAdjusted?`, plus the scope's text fields and costs.

### Effort model (`buildPlan`, ADR-013)
Pure and deterministic: the same scope and inputs always give the same plan. All factors are exported
constants with unit tests.

| Step | Rule |
|---|---|
| Seniority | `baseHours` × junior 1.3, mid 1, senior 0.85, mixed 1 (a 1 senior : 2 mid : 1 junior blend); rounded to 0.5 h |
| AI agents | Only `code`, `tests`, `docs-config`: × 0.7 likely (band 0.6 best to 0.8 worst). Other categories unchanged |
| Review | With AI agents, each phase with agent work gets "Review and correct agent output" (marked `addedByCode`, shown with an "Added by code" tag): 15% of that phase's agent-work hours (0.5 h steps, at least 0.5 h, but never more than the hours the agents saved in that phase; no row when they saved nothing), the phase's most-hours role, category `code` |
| AI text | With AI agents, code adds one assumption (agents draft, a named engineer owns every change) and the review-bottleneck risk; with 1 or 2 people also the separation-of-duties risk |
| Confidence | Facts stated: 5+ high, 3–4 medium, 0–2 low. `missingFacts` lists the false ones |
| Effort range | likely = sum of task hours; best/worst = likely × high 0.9/1.15, medium 0.85/1.3, low 0.8/1.5. With AI agents best/worst also use the band's 0.6/0.8 on agent work |
| Calendar | Model's phase order and shape. Each phase's model days are first scaled by its adjusted hours ÷ base hours (seniority and AI; rounded up to half days, at least 0.5; a phase without tasks keeps its days). It then lasts max(scaled days, hours ÷ (min(team, tasks) × 6)), rounded up to half days. A phase that started after its predecessor ended keeps that gap (back to back stays back to back); one that overlapped starts at the same fraction into it. Team of 1: strictly in sequence. If the result is still shorter than total hours ÷ (team × 6), every phase is stretched by one factor. `calendarAdjusted` when the result is longer than the model's shape with the scaled days (so it means team capacity only). Example plan, mixed team of 4: 13 days (2.6 weeks) traditional, 12.5 days (2.5 weeks) with AI agents |

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

### Scope cache (M14, ADR-013)
Ok scopes are cached in Upstash for 24 hours (`lib/estimator/cache.ts`). Key: `plan:<version>:` (the version is a hash of the full request settings, model, prompt and schema plus a manual `CACHE_REV`, now 2, for `normaliseScope` changes, so changing any of them starts a fresh cache) + SHA-256 hex of
`JSON.stringify([feature trimmed, whitespace collapsed, lowercased, teamSize])`. Seniority and mode are
not in the key: every combination reuses one scope, so comparing them changes only the factors. Value: the
normalised scope JSON; `SET ... EX 86400`. The cache is read after Turnstile and the rate limit (a hit
still uses a slot), and a hit returns the same 200 shape. Only ok plans are written, after the response. Any
Upstash error is a silent miss; without the Upstash env vars (local, e2e) the cache is off.
The browser goes one step further: when the brief (same normalisation) and team size match the last live
plan, submit rebuilds that saved scope with `buildPlan` and sends no request, so switching seniority or
working style needs no token, never hits the rate limit and shows no cached note (review round 2).
Round 3: the seniority and working-style radios update the live plan on screen at once (no click), also when it
is kept under an error banner, as long as the team size is unchanged; focus stays on the radio. A note under
the working-style options says this doesn't count toward the hourly limit, and a 429 banner adds that the
radios still work. The confidence card shows "N of 6 facts"; in AI mode the drivers box states the real
range ratios and why it is wider.
The "Same scope, two working styles" table shows effort, calendar, people cost, AI agent seats and the
build total for both styles, so the AI column carries its seat cost.
Saved example plans (E5, Izzat 2026-11-24): `lib/examplePlans.json` holds a Claude scope for every example
chip and detailed brief at team size 4, made by hand with `npm run examples:generate` (about 43 Haiku calls,
US$0.05; re-run when the chips, prompt or schema change). Submitting an unchanged chip at team size 4 loads the
file (dynamic import, warmed on chip click) and builds the plan locally: no request, no token, no rate-limit
slot, and a "Saved plan for this example, generated by Claude on <date>" note. Any edit or another team size
is a live request. The hourly limit is 10 per visitor (was 5).

### Usage events and logging (M14, ADR-012)
Every request ends in exactly one outcome: `ok`, `invalid_input` (400/413/415), `misconfigured` (503),
`human_check_failed` (403), `rate_limited` (429), `upstream_error` (502, refunded), `timeout` (504),
`cut_off` (502), `refused` (422), `unsupported` (422, model `{error}`), `bad_plan` (502, unreadable or
incomplete). Its fields go to two places:
- **One JSON log line** (`{"event":"estimate", ...}`): `console.info` for ok, `console.warn` for `invalid_input`, `human_check_failed` and
  `rate_limited` (visitor-side, so Vercel's error view shows only server failures), `console.error` otherwise,
  plus short context such as `stop_reason`, `error_type`, `error_name`, `text_length`.
- `total_hours`, `phase_count`, `confidence` and `calendar_adjusted` come from `buildPlan(scope, inputs)`
  for the request's own seniority and mode, so cache hits log their own numbers.
- **One row** in Neon `estimate_events` (`db/schema.sql`), except for `invalid_input`, `misconfigured` and
  `human_check_failed` (free to trigger before the human check, so log only), written with `after()` so the visitor never
  waits; skipped when `DATABASE_URL` is unset. `cost_usd` comes from token usage and a per-model price
  table (unknown model: null). Cache hits store `cache_hit = true` and no model or usage.

Neither ever holds the feature text, plan text, IP or an upstream error body. `countPlans()` in
`lib/estimator/events.ts` returns the number of ok rows (null without `DATABASE_URL` or on error).

## Prompt
Lives in `lib/prompt.ts` (`SYSTEM_PROMPT`, `userMessage`, `requestBody`, `RESPONSE_SCHEMA`; pure functions
`lib/estimator/anthropic.ts` imports). Owned by the `prompt-engineer` subagent. ADR-011: the model proposes, code enforces;
ADR-013: the model proposes only the scope. The user message is `Team: N people.` plus the feature; it
never carries seniority or working style.

- Roles allowed: `BA, Architect, Backend, Frontend, QA, DevOps, PM` (from `lib/estimate.ts`).
- Feature text is wrapped in `<feature>` tags and treated as untrusted data.
- **Structured outputs:** the body sends `output_config.format = { type: "json_schema", schema }`. The schema
  is `anyOf` the scope object or `{ error: string }`; every object has `additionalProperties: false` and all
  keys required; enums for `role`, `category` and cost `kind`; `facts` is an object of six booleans; no
  min/max or array-size keywords (not supported), and no totals or confidence. The server `JSON.parse`s the
  first text block (no fence stripping); anything unparseable is the 502 "unreadable plan".
  `normaliseScope(raw, teamSize)` is the second check: it clamps numbers (`baseHours` 0.5..400, start
  0..365, duration 0.5..120), trims strings, caps array lengths, maps unknown roles to Backend and unknown
  categories to `integration` (no AI reduction), keeps facts as strict booleans, and returns null (502
  "incomplete plan") when no task is usable or the slowest build (junior, traditional) for this team is
  over 2000 days.
- **Base hours:** sized for one mid-level engineer working without AI tools, including review and fixes.
  The prompt states no multiplier: seniority and the AI band are applied in code.
- **Solo teams:** with 1 person, phases run in sequence (no overlap) and that person covers every role.
- **No mode text:** the scope is reused for every seniority and working style, so the prompt tells the
  model never to mention seniority, AI, agents, tooling or productivity.
- **Scope:** huge or multi-feature requests get an MVP slice, said in the summary, with the deferred parts
  in `outOfScope`.
- **Capacity:** 1 person-day = 6 productive hours (`HOURS_PER_DAY`, also stated in the prompt); the
  calendar itself is computed in `buildPlan` (see *Effort model*).
- **Timeouts:** Turnstile siteverify 4 s, Anthropic call 45 s (`maxDuration` 60 s).
- Default model: `claude-haiku-5-5` (cheapest). `ANTHROPIC_MODEL` env var can switch to Sonnet.
- Request: `max_tokens` 8000 on Haiku, 4000 on pricier models (`maxTokensFor`),
  `output_config: { effort: "low", format }`, no `temperature`/`top_p`/`top_k`, `thinking` omitted (adaptive by default; its tokens count
  against `max_tokens`). On failure the server logs only `stop_reason`,
  token usage and text length, never the feature or model text.

**Working style.** The model never sees it. The AI effect is a published per-category band applied in
code (see *Effort model*), shown as a range on the agent-friendly part of the work, never as a single
figure for the whole plan, and the prompt itself never mentions AI percentages. The calendar shrinks less
than the effort because only some tasks shrink and review is added. The plan shape is the same in both
modes; the team line reads e.g. "2 people, senior, with AI agents".

## UI states
`idle → submitting → success | error`. While submitting: disable the form, move focus to the results
section and scroll it into view (smooth unless reduced motion; on phones the results sit below the form).
Refine (B4, Izzat 2026-11-24): under the result tabs, when the plan has open questions, "Answer the questions to
refine the plan" shows one text input per question (300 characters each, any may be skipped) and "Refine this
plan". `lib/refine.ts` appends the answered ones to the plan's brief as plain text ("Answers to the open
questions:" then "- question answer" lines), the textarea takes that text, and it goes out as a normal estimate:
Turnstile, rate limit (counts as one), daily cap, cache, 1500-character limit and prompt handling all unchanged,
and no server change. A counter shows room left; the button is `aria-disabled` with its reason (no answer, too
long, waiting for the human check, cooldown, planning) so it stays focusable. The new plan shows "Refined from:
<confidence, hours, build range>. Now: <same>." until a plain estimate replaces it; radio rebuilds keep it.
The reason names at most 2 added and 2 removed tasks ("a, b and 3 more"); when more than half the old tasks
are gone it says "Plan re-drafted from your answers (+4 h)." instead (W5, B4e). Hidden in print. Answers are auto-growing textareas (`field-sizing: content`, 2 rows elsewhere; B4a). When the
hours move more than 5%, the "Refined from" line adds why ("More hours: your answers added detail…" or "Fewer
hours: …"; B4b). With no human-check token the reason names the widget by the Estimate button and a "Go to the
human check" button scrolls it into view, since a visible challenge renders there, far above (B4c). After any
result the loading height is released in the same render as the plan, so the scroll to the heading isn't thrown
off by the page shrinking mid-scroll; moves longer than a screen are instant (E12b).
Brief coach (E11): while a typed brief (not a chip) is 20 to 249 characters, a static tip under the counter names
the six facts (`estimatorCopy.coach`, linked by `aria-describedby`, not a live region). No detection: a keyword
guess could disagree with the model's own fact check.
Show the status line ("Planning phases…", announced once), the request flow lighting up (G1,
`RequestFlow live`, decorative): the five fast steps tick through at 250 ms each, then it holds on the model
step (Claude Haiku, in `--model`) until the response; later steps are faint. Then "Usually about 10 seconds."
The same flow, with each step's note, is the static "Path of one request" in "How it's built". On success focus moves to the plan heading (no browser jump), and on the next frame the
heading scrolls to the top of the screen (E12; smooth unless reduced motion); on error focus goes to the banner.
A failed estimate never wipes the last successful plan (example or live): it stays below the banner.
Under every plan, above the footer note: "Like how I break down work? Let's talk about your team." with Email me and
LinkedIn links (never a phone number). A chip click fills the field and puts the caret at its end.
The client rejects plans with malformed tasks or absurd totals (hours over 100000, days over 2000,
weeks over 400) with the "incomplete plan" banner, and an error boundary around the plan shows a short
fallback if rendering throws.

## Output tabs

Above the tabs, under the title, one plain-English answer line built in code (E8). The summary under it shows its first sentence only
(`firstSentence` in `lib/refine.ts`; the prompt also asks for one sentence of at most 30 words) (W3):
"About N weeks for a team of P, roughly RM Xk–Yk to build." (rounded calendar weeks, `budget().build`).

**Tab 1 — Timeline** (default; was "Phases and timeline", shortened in M11 so tabs fit one line on phones)
- Summary row: total effort hours, calendar weeks, team (e.g. "4 people, mixed"), confidence badge with six
  fact dots in `--model`, filled left to right by count like a meter (decorative; the "N of 6 facts" hint and
  "Not stated" say it in words). Headline hours and days are whole numbers; task rows keep half hours. Phones:
  Effort and Calendar share a row; Team and Confidence span it. From 720 px: Effort, Calendar and Team in a row,
  Confidence full width below. Assumptions, Risks, Questions and Not included are
  `<details>` disclosures, closed at every width with the item count in the heading, e.g. "Risks (4)" (E9, W3).
  Effort shows its best-to-worst range under the value; Calendar and Team have no hint (W1). Confidence is computed
  in code (`confidenceFor`) from the six facts the model reports the description states (users, existing
  systems, data, integrations, limits, out of scope): high at five or more, medium at three or four, low
  at two or fewer. Each fact is defined concretely in the prompt so runs agree: naming the user group
  counts as users (no number needed), naming an existing page or system counts as systems, and naming any
  outside service (a payment method, messaging channel, email or SMS provider) counts as integrations. A request that names no concrete capability ("make our app better") gets
  the error answer, like a non-software request; a short concrete one ("add dark mode") is planned. Its hint changes with the level (`hints.confidence.low|medium|high`).
- Under the submit button, one line: Claude Haiku, about 10 s, a starting point, not a quote
  (`estimatorCopy.modelNote`), then a closed "About plans" `<details>` holding the 24-hour cache note (W2).
- Timeline: one horizontal bar per phase. `left = startDay / totalDays`, `width = durationDays / totalDays`.
  Week gridlines every 5 working days, with "Week 1", "Week 2"... centred under each span (at most 6
  labels; long plans label every 2nd or 3rd week). Label "Day 3 to 7" on each bar. Maths lives in `lib/timeline.ts`.
- No separate phase cards (E10): each timeline row shows the phase name (h4), "Day x to y · N tasks" and the
  goal under its bar. Bars grow in over 300 ms, one row after another (60 ms apart; none with reduced motion).
- Assumptions and risks as two short lists.

**Tab 2 — Tasks**
- Role totals as chips above the table (hours per role, sorted descending); each chip has the role's colour dot, so the chips are the legend.
- Table grouped by phase: Task · Role · Hours. Phase subtotal rows. Grand total footer. Roles are outlined pills with a
  decorative colour dot (`--role-*` tokens). With AI agents, rows in code, tests and docs-config carry an "AI" tag;
  inserted review rows carry "Added by code". Copy plan marks them `[AI]` and `[added by code]`.
- Below 600px the Role column is hidden and the role shows as a muted second line in the Task cell, so
  Task and Hours fit 320px with no sideways scroll.

Tabs use proper ARIA (`role="tablist"`, `aria-selected`, arrow-key navigation).

**Tab 3 — Budget** (`components/estimator/BudgetView.tsx`, numbers in `lib/budget.ts`), in MYR.
Charts first (G2, `BudgetChart.tsx`): "Where the build money goes" is one stacked bar of the build total
(people, AI seats when on, tools and one-off costs, contingency; segment length = middle of each range) with
a legend that carries every range, so the bar is decorative. The "Same scope, two working styles" section opens
with two range bars (low to high build total, shared axis from zero with faint ticks at a round step such as
RM 0 · 10k · 20k · 30k; `role="img"` with both ranges in its label).
The tables stay as the full view:
- **Build:** people cost = total hours × an assumed in-house rate per seniority (junior RM 40, mid
  RM 75, senior RM 120, mixed RM 78 per hour: mid-range Klang Valley salary × 1.3 for EPF, SOCSO, EIS
  and overheads ÷ 160 hours; approved by Izzat 2026-11-17; mixed is the 1 senior, 2 mid, 1 junior blend,
  set 2026-11-19). Contingency = 10% (high confidence), 20% (medium) or 30% (low) of people cost (`CONTINGENCY`,
  `budget().contingencyRate`, rounded to whole ringgit), its own row
  and part of the build total. With AI agents, seats = team size × started
  months of the calendar × RM 80–400 (standard to premium business seat). Plus the model's one-off items.
- **Running costs after launch:** the model's monthly items and their total.
- The model lists only tools and running costs (3 to 8, ranges, whole ringgit, only what the feature
  adds); it never prices people or seats. `normaliseScope` drops bad items, clamps each value to 0..200,000 and
  orders each range. Notes under the table name the rates and say the ranges are for planning only.

## Footer note under results
"Estimates are generated by Claude for illustration. Real plans need a real team's input."

Under the example plan: "This example was written by hand to show the format. Live estimates are
generated by Claude." The stored plan must never be presented as model output unless it is replaced by
a real reply.

## Testing
- Unit: `validateRequest`, `normaliseScope`, `buildPlan` and its factors (`tests/unit/estimateModel.test.ts`),
  `lib/prompt.ts` (incl. no multiplier or percentage text), `lib/budget.ts`, `lib/timeline.ts` (pure
  functions, no network).
- Unit: `tests/unit/route.test.ts` calls `POST` with `fetch` mocked for Turnstile and Anthropic.
- Unit: `tests/unit/estimatorService.test.ts` runs `runEstimate` with fake deps (order, refund, cache,
  outcomes); `tests/unit/estimatorEvents.test.ts` mocks the Neon driver and Upstash `fetch`.
- E2E: Playwright intercepts `POST /api/estimate` with `page.route` and returns
  `tests/fixtures/plan.json` (a `{ scope, inputs }` body). Never hit the real API in tests. Turnstile uses Cloudflare's test site key.
