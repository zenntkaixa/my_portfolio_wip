// Estimator orchestration, free of HTTP and env: Turnstile → rate limit → cache → Claude → normalise.
// The route parses and validates the request, then calls `runEstimate` with real adapters; tests inject fakes.

import { normalisePlan, str, type EstimateRequest, type Plan } from "@/lib/estimate";
import type { LimitResult } from "@/lib/rateLimit";
import type { ModelInput, ModelResult } from "@/lib/estimator/anthropic";
import { cacheKey, type PlanCache } from "@/lib/estimator/cache";
import { costUsd, type EventDetail, type EventRow, type Outcome } from "@/lib/estimator/events";

export type EstimateDeps = {
  verifyHuman: (token: string, ip: string) => Promise<boolean>;
  checkLimits: (ip: string) => Promise<LimitResult>;
  cache: PlanCache;
  callModel: (input: ModelInput) => Promise<ModelResult>;
  /** Logs and stores the request's event; must not block the response (the route defers the write). */
  recordEvent: (row: EventRow, detail?: EventDetail) => void;
  now: () => number;
};

export type SuccessBody = { plan: Plan; inputs: Pick<EstimateRequest, "teamSize" | "seniority" | "mode"> };

export type EstimateResult = {
  status: number;
  body: SuccessBody | { error: string };
  headers?: Record<string, string>;
  event: EventRow;
  detail?: EventDetail;
};

const MODEL_ERROR_MAX = 200;
const NOT_A_FEATURE = "The AI couldn't plan this request. Describe a software feature instead.";

type Inputs = Pick<EstimateRequest, "teamSize" | "seniority" | "mode"> | null;

/** Builds the event row; fields not passed are null. */
export function eventRow(
  outcome: Outcome,
  status: number,
  durationMs: number,
  inputs: Inputs,
  extra: Partial<Omit<EventRow, "outcome" | "status" | "duration_ms">> = {},
): EventRow {
  return {
    outcome,
    status,
    duration_ms: Math.max(0, Math.round(durationMs)),
    model: null,
    input_tokens: null,
    output_tokens: null,
    cost_usd: null,
    mode: inputs?.mode ?? null,
    seniority: inputs?.seniority ?? null,
    team_size: inputs?.teamSize ?? null,
    total_hours: null,
    phase_count: null,
    confidence: null,
    calendar_adjusted: null,
    cache_hit: false,
    ...extra,
  };
}

/** An error result for checks the route runs before the service (invalid input, misconfiguration). */
export function errorResult(
  outcome: Outcome,
  status: number,
  error: string,
  durationMs: number,
  inputs: Inputs = null,
  detail?: EventDetail,
): EstimateResult {
  return { status, body: { error }, event: eventRow(outcome, status, durationMs, inputs), detail };
}

function planFields(plan: Plan) {
  return {
    total_hours: plan.totalHours,
    phase_count: plan.phases.length,
    confidence: plan.confidence,
    calendar_adjusted: plan.calendarAdjusted === true,
  };
}

export async function runEstimate(req: EstimateRequest, ip: string, startedAt: number, deps: EstimateDeps): Promise<EstimateResult> {
  const result = await estimate(req, ip, startedAt, deps);
  deps.recordEvent(result.event, result.detail);
  return result;
}

async function estimate(req: EstimateRequest, ip: string, startedAt: number, deps: EstimateDeps): Promise<EstimateResult> {
  const { feature, teamSize, seniority, mode, token } = req;
  const inputs = { teamSize, seniority, mode };
  const elapsed = () => deps.now() - startedAt;
  const fail = (outcome: Outcome, status: number, error: string, extra: Parameters<typeof eventRow>[4] = {}, detail?: EventDetail, headers?: Record<string, string>): EstimateResult => ({
    status,
    body: { error },
    headers,
    event: eventRow(outcome, status, elapsed(), inputs, extra),
    detail,
  });

  // Verify the human check before spending a rate-limit slot, so fake tokens never burn the quota.
  if (!(await deps.verifyHuman(token, ip))) {
    return fail("human_check_failed", 403, "The human check didn't pass. Refresh the page and try again.");
  }

  // The limit applies to cache hits too, so the cache never becomes a way around it.
  const limit = await deps.checkLimits(ip);
  if (!limit.ok) return fail("rate_limited", 429, limit.reason, {}, undefined, { "Retry-After": String(limit.retryAfter) });

  const key = cacheKey(req);
  const cached = await deps.cache.get(key);
  if (cached) {
    return { status: 200, body: { plan: cached, inputs }, event: eventRow("ok", 200, elapsed(), inputs, { ...planFields(cached), cache_hit: true }) };
  }

  const reply = await deps.callModel({ feature, teamSize, seniority, mode });
  if (reply.kind === "http_error") {
    // An error status means no reply was generated or charged, so the visitor gets the slot back.
    // Timeouts and unusable replies below keep it: those calls can still cost money.
    await limit.refund();
    return fail("upstream_error", 502, "The AI service is busy right now. Try again in a minute.", { model: reply.model }, { upstream_status: reply.status, error_type: reply.errorType });
  }
  if (reply.kind === "failed") {
    return fail("timeout", 504, "The AI took too long to answer. Try a shorter description.", { model: reply.model }, { error_name: reply.errorName });
  }

  const input_tokens = reply.inputTokens ?? null;
  const output_tokens = reply.outputTokens ?? null;
  const usage = { model: reply.model, input_tokens, output_tokens, cost_usd: costUsd(reply.model, input_tokens, output_tokens) };
  const meta = { stop_reason: reply.stopReason };

  if (reply.stopReason === "max_tokens") {
    return fail("cut_off", 502, "The plan was too long to finish. Try a shorter or more focused description.", usage, meta);
  }
  if (reply.stopReason === "refusal") return fail("refused", 422, NOT_A_FEATURE, usage, meta);

  let raw: unknown;
  try {
    raw = JSON.parse(reply.text);
  } catch {
    return fail("bad_plan", 502, "The AI returned an unreadable plan. Try again.", usage, { ...meta, text_length: reply.text.length });
  }

  if (raw && typeof raw === "object" && "error" in raw && typeof (raw as { error: unknown }).error === "string") {
    const sentence = str((raw as { error: string }).error, MODEL_ERROR_MAX);
    return fail("unsupported", 422, sentence || NOT_A_FEATURE, usage, meta);
  }

  const plan = normalisePlan(raw, teamSize);
  if (!plan) return fail("bad_plan", 502, "The AI returned an incomplete plan. Try again with more detail.", usage, meta);

  await deps.cache.set(key, plan);
  return { status: 200, body: { plan, inputs }, event: eventRow("ok", 200, elapsed(), inputs, { ...usage, ...planFields(plan) }) };
}
