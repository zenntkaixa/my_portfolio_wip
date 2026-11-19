// HTTP in, HTTP out. Parsing and config guards live here; the order of the paid steps is in lib/estimator/service.ts.
import { after, NextResponse } from "next/server";
import { validateRequest } from "@/lib/estimate";
import { checkLimits } from "@/lib/rateLimit";
import { turnstileConfigProblem } from "@/lib/turnstileConfig";
import { callAnthropic } from "@/lib/estimator/anthropic";
import { upstashPlanCache } from "@/lib/estimator/cache";
import { logEvent, recordEvent, type EventDetail, type EventRow } from "@/lib/estimator/events";
import { verifyTurnstile } from "@/lib/estimator/turnstile";
import { errorResult, runEstimate, type EstimateResult } from "@/lib/estimator/service";

export const runtime = "nodejs";
export const maxDuration = 60;

const MAX_BODY = 8192;
const UNAVAILABLE = "The estimator is unavailable right now. Please try again later.";

// x-forwarded-for is only trustworthy behind Vercel's edge, which sets it. Elsewhere a client can spoof it.
function clientIp(req: Request) {
  const fwd = req.headers.get("x-forwarded-for");
  return (fwd?.split(",")[0] ?? req.headers.get("x-real-ip") ?? "unknown").trim();
}

// Outcomes anyone can trigger for free (before the human check passes) are logged but get no database row,
// so the table can't be grown by unverified traffic.
const LOG_ONLY = new Set(["invalid_input", "misconfigured", "human_check_failed"]);

/** One log line now; the database row after the response, so the visitor never waits for it. */
function report(row: EventRow, detail?: EventDetail) {
  logEvent(row, detail);
  if (!LOG_ONLY.has(row.outcome)) after(() => recordEvent(row));
}

function respond(r: EstimateResult) {
  return NextResponse.json(r.body, { status: r.status, headers: r.headers });
}

function reject(started: number, status: number, error: string) {
  const r = errorResult("invalid_input", status, error, Date.now() - started);
  report(r.event);
  return respond(r);
}

export async function POST(req: Request) {
  const started = Date.now();
  const ip = clientIp(req);

  const contentType = req.headers.get("content-type") ?? "";
  if (!contentType.toLowerCase().startsWith("application/json")) {
    return reject(started, 415, "Send the request as application/json.");
  }
  const declared = Number(req.headers.get("content-length") ?? 0);
  if (declared > MAX_BODY) return reject(started, 413, "The request is too large.");

  let body: unknown;
  try {
    const raw = await req.text();
    if (raw.length > MAX_BODY) return reject(started, 413, "The request is too large.");
    body = JSON.parse(raw);
  } catch {
    return reject(started, 400, "The request body must be JSON.");
  }

  const parsed = validateRequest(body);
  if (!parsed.ok) return reject(started, 400, parsed.error);
  const { teamSize, seniority, mode } = parsed.value;

  // Production (or any real secret) refuses to run on test keys or without a hostname binding, and a missing
  // API key is caught here too: no siteverify call, no rate-limit slot, no model call.
  const problem = turnstileConfigProblem(process.env) ?? (process.env.ANTHROPIC_API_KEY ? null : "missing API key");
  if (problem) {
    const r = errorResult("misconfigured", 503, UNAVAILABLE, Date.now() - started, { teamSize, seniority, mode }, { problem });
    report(r.event, r.detail);
    return respond(r);
  }

  const cache = upstashPlanCache();
  const result = await runEstimate(parsed.value, ip, started, {
    verifyHuman: verifyTurnstile,
    checkLimits,
    // The write happens after the response; the read is on the request path (1 s Upstash timeout).
    cache: { get: cache.get, set: async (key, plan) => after(() => cache.set(key, plan)) },
    callModel: callAnthropic,
    recordEvent: report,
    now: Date.now,
  });
  return respond(result);
}
