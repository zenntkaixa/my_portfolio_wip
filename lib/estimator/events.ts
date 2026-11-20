// Usage events in Neon Postgres (ADR-012): one row per estimator request, written after the response.
// Metadata only: never the feature text, the plan text, the IP or any upstream body.

import { neon } from "@neondatabase/serverless";

export type Outcome =
  | "ok"
  | "invalid_input"
  | "misconfigured"
  | "human_check_failed"
  | "rate_limited"
  | "upstream_error"
  | "timeout"
  | "cut_off"
  | "refused"
  | "unsupported"
  | "bad_plan";

/** Columns of `estimate_events` (db/schema.sql), minus id and created_at. */
export type EventRow = {
  outcome: Outcome;
  status: number;
  duration_ms: number;
  model: string | null;
  input_tokens: number | null;
  output_tokens: number | null;
  cost_usd: number | null;
  mode: string | null;
  seniority: string | null;
  team_size: number | null;
  total_hours: number | null;
  phase_count: number | null;
  confidence: string | null;
  calendar_adjusted: boolean | null;
  cache_hit: boolean;
};

/** Log-only context (stop_reason, error_type, text_length, ...). Short values, never user or model text. */
export type EventDetail = Record<string, string | number | null | undefined>;

/** USD per million tokens. */
const PRICES: Record<string, { input: number; output: number }> = {
  "claude-haiku-5-5": { input: 0.1, output: 0.5 },
};

/** Cost from token usage; null for an unknown model or missing usage. */
export function costUsd(model: string | null, inputTokens: number | null, outputTokens: number | null) {
  const price = model ? PRICES[model] : undefined;
  if (!price || inputTokens == null || outputTokens == null) return null;
  return Math.round(inputTokens * price.input + outputTokens * price.output) / 1e6;
}

const COLUMNS = [
  "outcome",
  "status",
  "duration_ms",
  "model",
  "input_tokens",
  "output_tokens",
  "cost_usd",
  "mode",
  "seniority",
  "team_size",
  "total_hours",
  "phase_count",
  "confidence",
  "calendar_adjusted",
  "cache_hit",
] as const satisfies readonly (keyof EventRow)[];

const INSERT = `INSERT INTO estimate_events (${COLUMNS.join(", ")}) VALUES (${COLUMNS.map((_, i) => "$" + (i + 1)).join(", ")})`;

function db() {
  const url = process.env.DATABASE_URL?.trim();
  return url ? neon(url) : null;
}

function logFailure(event: string, err: unknown) {
  console.error(JSON.stringify({ event, error: err instanceof Error ? err.name : "unknown" }));
}

/** Inserts one row with a parameterised query. Skipped when DATABASE_URL is unset; never throws. */
export async function recordEvent(row: EventRow): Promise<void> {
  try {
    const sql = db();
    if (sql) await sql.query(INSERT, COLUMNS.map((c) => row[c]));
  } catch (err) {
    logFailure("estimate_event_write_failed", err);
  }
}

/** Number of plans generated (outcome ok), or null when DATABASE_URL is unset or the query fails. */
export async function countPlans(): Promise<number | null> {
  try {
    const sql = db();
    if (!sql) return null;
    const rows = (await sql.query("SELECT count(*) AS n FROM estimate_events WHERE outcome = 'ok'")) as { n: unknown }[];
    const n = Number(rows[0]?.n);
    return Number.isFinite(n) ? n : null;
  } catch (err) {
    logFailure("estimate_count_failed", err);
    return null;
  }
}

export type UsageStats = { plans: number; medianS: number; p95S: number; cacheHitPct: number; costCents: number };

/** Last-30-days numbers for the "How it's built" panel; null when DATABASE_URL is unset, the query fails or there are no plans. */
export async function usageStats(): Promise<UsageStats | null> {
  try {
    const sql = db();
    if (!sql) return null;
    const rows = (await sql.query(
      `SELECT count(*) AS plans,
        percentile_cont(0.5) WITHIN GROUP (ORDER BY duration_ms) FILTER (WHERE NOT cache_hit) AS median_ms,
        percentile_cont(0.95) WITHIN GROUP (ORDER BY duration_ms) FILTER (WHERE NOT cache_hit) AS p95_ms,
        avg(CASE WHEN cache_hit THEN 1 ELSE 0 END) AS cache_rate,
        avg(cost_usd) FILTER (WHERE NOT cache_hit) AS avg_cost
      FROM estimate_events WHERE outcome = 'ok' AND created_at > now() - interval '30 days'`,
    )) as Record<string, unknown>[];
    const r = rows[0];
    const [plans, median, p95, rate, cost] = [r?.plans, r?.median_ms, r?.p95_ms, r?.cache_rate, r?.avg_cost].map((v) => (v == null ? NaN : Number(v)));
    if (![plans, median, p95, rate, cost].every(Number.isFinite) || plans < 1) return null;
    return { plans, medianS: median / 1000, p95S: p95 / 1000, cacheHitPct: rate * 100, costCents: cost * 100 };
  } catch (err) {
    logFailure("estimate_stats_failed", err);
    return null;
  }
}

// Turned away on the visitor's side (bad input, failed human check, over the limit): expected traffic, so a
// warning, which keeps Vercel's error view for real server failures.
const VISITOR_SIDE = new Set(["invalid_input", "human_check_failed", "rate_limited"]);

/** One JSON line per request: console.info for ok, console.warn for visitor-side outcomes, console.error otherwise. */
export function logEvent(row: EventRow, detail: EventDetail = {}) {
  // Detail first so it can never overwrite a row field; upstream strings are cut short.
  const safe = Object.fromEntries(Object.entries(detail).map(([k, v]) => [k, typeof v === "string" ? v.slice(0, 64) : v]));
  const line = JSON.stringify({ ...safe, event: "estimate", ...row });
  if (row.outcome === "ok") console.info(line);
  else if (VISITOR_SIDE.has(row.outcome)) console.warn(line);
  else console.error(line);
}
