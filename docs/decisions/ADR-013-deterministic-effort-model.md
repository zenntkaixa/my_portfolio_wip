# ADR-013 — Deterministic effort model

**Status:** Accepted (2026-11-19). Narrows ADR-011: the model now proposes only the scope.

## Context
The prompt asked Haiku for final per-task hours already adjusted for seniority and working style, plus its
own confidence, with one call per combination. The same brief came back as 134 h, medium confidence, with
AI agents and 198 h, low confidence, traditional, with different tasks in each. A visitor comparing the two
saw scope drift, not the effect of AI agents, and a delivery lead would not trust either number.

## Decision
- **The model describes the work once.** Input: feature and team size only (team size still shapes
  phasing). Output: a *scope*: phases with their proposed start and length, tasks with a role, a
  `category` and `baseHours` (mid-level engineer, no AI tools), six `facts` booleans (what the description
  states), plus assumptions, risks, questions, out-of-scope items and tool costs. The prompt never mentions
  seniority, AI, multipliers or percentages.
- **Code applies every factor** in `buildPlan` (`lib/estimateModel.ts`), shared by the server (event row)
  and the client (display): seniority (junior 1.3, mid 1, senior 0.85, mixed 1); with AI agents, an effort
  band on `code`, `tests` and `docs-config` only (0.6 / 0.7 / 0.8: 20 to 40% less, 30% likely) and one
  human review task per phase with agent work (15% of that work, at least 0.5 h, capped at the hours the agents saved, so a phase never costs more with agents); confidence from facts
  (5+ high, 3–4 medium, 0–2 low; raised from 4+/2–3/0–1 on 2026-11-24 after review round 2); an effort range from confidence and the AI band; the calendar from the
  model's phase shape, each phase's days scaled by its adjusted ÷ base hours (so seniority and AI move
  the calendar, not only the hours), and the team's capacity; contingency by confidence (10 / 20 / 30%).
- **One cache entry per feature and team size.** Seniority and mode no longer reach the model, so all
  eight combinations reuse one scope and every comparison changes only what the factors change.

## Why the AI effect is a published band on part of the work
Published studies of AI coding agents disagree widely, and the gain depends on the task: drafting code and
tests speeds up, while discovery, decisions, integration with other teams, UAT and release do not. A
single headline figure for a whole plan would overclaim. So the band applies per category, is shown as a
range, and is paid back partly by the review time it creates; on the example plan the total drops about
11%, not 30%. The numbers live in one file with unit tests and can be tuned in one place.

## Consequences
- Same scope and inputs give the same plan, byte for byte; switching mode or seniority shows only the
  factor's effect. The scope (not the plan) is the API body: `{ scope, inputs, cached? }`.
- The calendar is computed, so the model's own wording ("two weeks") can still disagree with it;
  `calendarAdjusted` says when capacity made it longer than the model's shape scaled to the plan's hours.
- The factors are our assumptions, stated in the docs and the UI; they are not measured per team.
- `Scope`, `RESPONSE_SCHEMA`, `normaliseScope`, `isScope` and `docs/03-estimator-spec.md` change together.
