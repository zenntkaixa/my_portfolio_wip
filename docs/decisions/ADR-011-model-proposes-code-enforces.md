# ADR-011 — The model proposes, code enforces

**Status:** Accepted (2026-11-19). Narrowed by ADR-013: the model now proposes only the scope; seniority, AI band, confidence and calendar are computed in code.

## Context
The estimator's plans must look credible to delivery leads. Haiku is good at choosing phases and tasks
for a feature, but less reliable at arithmetic and consistency: it can give one person 300 hours in a week,
price people, or wrap its JSON in prose that a regex had to cut out. Prompt rules alone can't
guarantee numbers or shape.

## Decision
- **The model proposes:** phases, tasks, roles, hours, start days, assumptions, risks, open questions,
  out-of-scope items and tool costs. The prompt (`lib/prompt.ts`) gives it the 6 productive hours per
  person-day, seniority multipliers and the solo-team rule so its first draft is close.
- **Code enforces:** `normalisePlan` clamps numbers, caps lists, recomputes all totals and stretches any
  calendar shorter than `totalHours / (teamSize × 6)`, flagging it with `calendarAdjusted`.
  `lib/budget.ts` prices people (rate per seniority), 20% contingency and AI seats; the model never does.
- **Structured outputs guarantee shape:** the request sends a JSON schema (plan or `{ error }`), so the
  reply is parsed with `JSON.parse` and no fence stripping. Bounds the schema can't express (min/max,
  list sizes) stay in `normalisePlan`.

## Consequences
- Totals, calendar and money are deterministic and unit-tested, whatever the model writes.
- A stretched calendar can disagree with the model's own wording (e.g. "two weeks" in the summary); the
  `calendarAdjusted` flag lets the UI say the server adjusted it.
- The schema and `normalisePlan` must change together with the `Plan` type, its tests and
  `docs/03-estimator-spec.md`.
- If the API rejects part of the schema (e.g. a top-level `anyOf`), every call fails with an API error
  (the slot is refunded); the fix is to wrap the plan and error in one object.
