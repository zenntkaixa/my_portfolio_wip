# ADR-003 — Estimator returns structured JSON, totals computed server-side

**Status:** Accepted (2026-11-03)

## Context
LLM arithmetic is unreliable and output shape can drift.

## Decision
- The model returns JSON in a fixed schema (see 03-estimator-spec).
- `normalisePlan` clamps and trims every field, caps array lengths, and recomputes `totalHours`,
  `totalDays` and `calendarWeeks` from the tasks and phases.
- The UI renders only normalised data.

## Consequences
- Prompt changes must keep the schema stable or update `lib/estimate.ts` and its tests in the same commit.
