import { describe, expect, it, vi } from "vitest";
import type { EstimateRequest, Plan } from "@/lib/estimate";
import type { ModelResult } from "@/lib/estimator/anthropic";
import { cacheKey, type PlanCache } from "@/lib/estimator/cache";
import type { EventRow } from "@/lib/estimator/events";
import { runEstimate, type EstimateDeps } from "@/lib/estimator/service";
import fixture from "../fixtures/plan.json";

const req: EstimateRequest = { feature: "Let users reset their password by email link", teamSize: 2, seniority: "mixed", mode: "traditional", token: "t" };
const reply = (over: Partial<Extract<ModelResult, { kind: "reply" }>> = {}): ModelResult => ({
  kind: "reply",
  model: "claude-haiku-5-5",
  text: JSON.stringify(fixture.plan),
  stopReason: "end_turn",
  inputTokens: 1000,
  outputTokens: 2000,
  ...over,
});

function deps(over: Partial<EstimateDeps> = {}) {
  const store = new Map<string, Plan>();
  const cache: PlanCache = { get: async (k) => store.get(k) ?? null, set: async (k, p) => void store.set(k, p) };
  const refund = vi.fn(async () => {});
  const rows: EventRow[] = [];
  let t = 1000;
  const d: EstimateDeps = {
    verifyHuman: vi.fn(async () => true),
    checkLimits: vi.fn(async () => ({ ok: true as const, refund })),
    cache,
    callModel: vi.fn(async () => reply()),
    recordEvent: (row) => void rows.push(row),
    now: () => (t += 250),
    ...over,
  };
  return { d, rows, refund, store };
}

describe("runEstimate", () => {
  it("returns the normalised plan and records one ok row with usage, cost and plan fields", async () => {
    const { d, rows, store } = deps();
    const r = await runEstimate(req, "1.1.1.1", 1000, d);
    expect(r.status).toBe(200);
    expect(rows).toHaveLength(1);
    expect(rows[0]).toMatchObject({ outcome: "ok", status: 200, duration_ms: 250, model: "claude-haiku-5-5", input_tokens: 1000, output_tokens: 2000, cost_usd: 0.0011, team_size: 2, seniority: "mixed", mode: "traditional", cache_hit: false });
    expect(rows[0].phase_count).toBeGreaterThan(0);
    expect(rows[0].total_hours).toBeGreaterThan(0);
    expect(store.has(cacheKey(req))).toBe(true);
  });

  it("serves a second identical request from the cache, still through Turnstile and the limiter", async () => {
    const { d, rows } = deps();
    await runEstimate(req, "1.1.1.1", 0, d);
    const r = await runEstimate({ ...req, feature: "  LET users   reset their password by email link " }, "1.1.1.1", 0, d);
    expect(r.status).toBe(200);
    expect(d.callModel).toHaveBeenCalledTimes(1);
    expect(d.verifyHuman).toHaveBeenCalledTimes(2);
    expect(d.checkLimits).toHaveBeenCalledTimes(2);
    expect(rows[1]).toMatchObject({ outcome: "ok", cache_hit: true, model: null, cost_usd: null });
  });

  it("stops at a failed human check before the limiter", async () => {
    const { d, rows } = deps({ verifyHuman: async () => false });
    expect((await runEstimate(req, "ip", 0, d)).status).toBe(403);
    expect(d.checkLimits).not.toHaveBeenCalled();
    expect(rows[0].outcome).toBe("human_check_failed");
  });

  it("returns 429 with Retry-After and skips the cache and the model", async () => {
    const get = vi.fn(async () => null);
    const { d, rows } = deps({ checkLimits: async () => ({ ok: false, reason: "Slow down.", retryAfter: 60 }), cache: { get, set: async () => {} } });
    const r = await runEstimate(req, "ip", 0, d);
    expect(r).toMatchObject({ status: 429, headers: { "Retry-After": "60" }, body: { error: "Slow down." } });
    expect(get).not.toHaveBeenCalled();
    expect(d.callModel).not.toHaveBeenCalled();
    expect(rows[0].outcome).toBe("rate_limited");
  });

  it("refunds only on an upstream error status", async () => {
    const up = deps({ callModel: async () => ({ kind: "http_error", model: "m", status: 529, errorType: "overloaded_error" }) });
    const r = await runEstimate(req, "ip", 0, up.d);
    expect(r).toMatchObject({ status: 502, detail: { error_type: "overloaded_error" } });
    expect(up.refund).toHaveBeenCalledOnce();
    expect(up.rows[0].outcome).toBe("upstream_error");

    const to = deps({ callModel: async () => ({ kind: "failed", model: "m", errorName: "TimeoutError" }) });
    expect((await runEstimate(req, "ip", 0, to.d)).status).toBe(504);
    expect(to.refund).not.toHaveBeenCalled();
    expect(to.rows[0].outcome).toBe("timeout");
  });

  it.each([
    [reply({ stopReason: "max_tokens" }), 502, "cut_off"],
    [reply({ stopReason: "refusal", text: "" }), 422, "refused"],
    [reply({ text: "not json" }), 502, "bad_plan"],
    [reply({ text: "{}" }), 502, "bad_plan"],
    [reply({ text: '{"error":"Not software."}' }), 422, "unsupported"],
  ])("maps a bad reply to its status and outcome, and never caches it", async (result, status, outcome) => {
    const { d, rows, store } = deps({ callModel: async () => result });
    expect((await runEstimate(req, "ip", 0, d)).status).toBe(status);
    expect(rows[0]).toMatchObject({ outcome, status, model: "claude-haiku-5-5", input_tokens: 1000 });
    expect(store.size).toBe(0);
  });
});

describe("cacheKey", () => {
  it("ignores case and spacing but not the other inputs", () => {
    expect(cacheKey({ ...req, feature: " LET  users reset their password by email link" })).toBe(cacheKey(req));
    expect(cacheKey(req)).toMatch(/^plan:[0-9a-f]{12}:[0-9a-f]{64}$/);
    expect(cacheKey({ ...req, teamSize: 3 })).not.toBe(cacheKey(req));
    expect(cacheKey({ ...req, mode: "ai-assisted" })).not.toBe(cacheKey(req));
    expect(cacheKey({ ...req, seniority: "senior" })).not.toBe(cacheKey(req));
  });
});
