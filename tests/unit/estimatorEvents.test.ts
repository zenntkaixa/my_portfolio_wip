import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

// Never reaches Neon or Upstash: the driver is mocked and fetch is stubbed.
const query = vi.hoisted(() => vi.fn());
vi.mock("@neondatabase/serverless", () => ({ neon: vi.fn(() => ({ query })) }));

import { costUsd, countPlans, usageStats, logEvent, recordEvent, type EventRow } from "@/lib/estimator/events";
import { upstashPlanCache, noCache } from "@/lib/estimator/cache";
import { eventRow } from "@/lib/estimator/service";
import fixture from "../fixtures/plan.json";

const row: EventRow = eventRow("ok", 200, 1234, { teamSize: 4, seniority: "mixed", mode: "traditional" }, { model: "claude-haiku-5-5" });

beforeEach(() => {
  query.mockReset();
  vi.spyOn(console, "error").mockImplementation(() => {});
  vi.spyOn(console, "info").mockImplementation(() => {});
  vi.spyOn(console, "warn").mockImplementation(() => {});
});
afterEach(() => {
  vi.unstubAllEnvs();
  vi.unstubAllGlobals();
  vi.restoreAllMocks();
});

describe("costUsd", () => {
  it("prices Haiku per million tokens and returns null for unknown models or missing usage", () => {
    expect(costUsd("claude-haiku-5-5", 1_000_000, 1_000_000)).toBe(0.6);
    expect(costUsd("claude-haiku-5-5", 3, 0)).toBe(0); // below a micro-dollar
    expect(costUsd("claude-haiku-5-5", 900, 1200)).toBe(0.00069);
    expect(costUsd("some-other-model", 900, 1200)).toBeNull();
    expect(costUsd("claude-haiku-5-5", null, 1200)).toBeNull();
    expect(costUsd(null, 1, 1)).toBeNull();
  });
});

describe("recordEvent", () => {
  it("does nothing without DATABASE_URL", async () => {
    vi.stubEnv("DATABASE_URL", "");
    await recordEvent(row);
    expect(query).not.toHaveBeenCalled();
  });

  it("sends a parameterised INSERT with the values in column order", async () => {
    vi.stubEnv("DATABASE_URL", "postgres://u:p@db.example/portfolio");
    query.mockResolvedValue([]);
    await recordEvent(row);
    const [text, params] = query.mock.calls[0] as [string, unknown[]];
    expect(text).toMatch(/^INSERT INTO estimate_events \(outcome, status, duration_ms, .*cache_hit\) VALUES \(\$1, .*\$15\)$/);
    expect(params).toEqual(["ok", 200, 1234, "claude-haiku-5-5", null, null, null, "traditional", "mixed", 4, null, null, null, null, false]);
  });

  it("swallows errors and logs only the error name", async () => {
    vi.stubEnv("DATABASE_URL", "postgres://u:secretpw@db.example/portfolio");
    query.mockRejectedValue(new TypeError("connect failed for postgres://u:secretpw@db.example"));
    await expect(recordEvent(row)).resolves.toBeUndefined();
    const logged = JSON.stringify(vi.mocked(console.error).mock.calls);
    expect(logged).toContain("TypeError");
    expect(logged).not.toContain("secretpw");
  });
});

describe("countPlans", () => {
  it("returns null without DATABASE_URL or on error, else the count of ok rows", async () => {
    vi.stubEnv("DATABASE_URL", "");
    expect(await countPlans()).toBeNull();
    vi.stubEnv("DATABASE_URL", "postgres://u:p@db.example/portfolio");
    query.mockResolvedValueOnce([{ n: "42" }]);
    expect(await countPlans()).toBe(42);
    expect(query.mock.calls[0][0]).toContain("WHERE outcome = 'ok'");
    query.mockRejectedValueOnce(new Error("down"));
    expect(await countPlans()).toBeNull();
  });
});

describe("logEvent", () => {
  it("writes one JSON line: info for ok, error otherwise", () => {
    logEvent(row);
    logEvent({ ...row, outcome: "timeout", status: 504 }, { error_name: "TimeoutError" });
    expect(JSON.parse(String(vi.mocked(console.info).mock.calls[0][0]))).toMatchObject({ event: "estimate", outcome: "ok" });
    expect(JSON.parse(String(vi.mocked(console.error).mock.calls[0][0]))).toMatchObject({ outcome: "timeout", error_name: "TimeoutError" });
  });
});

describe("upstashPlanCache", () => {
  const env = { UPSTASH_REDIS_REST_URL: "https://example-db.upstash.io", UPSTASH_REDIS_REST_TOKEN: "tok" };
  const plan = fixture.scope;

  it("is off without Upstash", () => {
    expect(upstashPlanCache({})).toBe(noCache);
  });

  it("reads and writes with a 24-hour TTL", async () => {
    const sent: unknown[] = [];
    vi.stubGlobal(
      "fetch",
      vi.fn(async (_url: string, init?: RequestInit) => {
        const cmd = JSON.parse(String(init?.body)) as string[];
        sent.push(cmd);
        return Response.json({ result: cmd[0] === "GET" ? JSON.stringify(plan) : "OK" });
      }),
    );
    const cache = upstashPlanCache(env);
    expect(await cache.get("plan:v1:abc")).toEqual(plan);
    await cache.set("plan:v1:abc", plan as never);
    expect(sent[1]).toEqual(["SET", "plan:v1:abc", JSON.stringify(plan), "EX", "86400"]);
  });

  it("treats errors and odd values as a miss", async () => {
    vi.stubGlobal("fetch", vi.fn(async () => Response.json({ error: "boom" })));
    const cache = upstashPlanCache(env);
    expect(await cache.get("k")).toBeNull();
    await expect(cache.set("k", plan as never)).resolves.toBeUndefined();
    vi.stubGlobal("fetch", vi.fn(async () => Response.json({ result: '{"not":"a plan"}' })));
    expect(await cache.get("k")).toBeNull();
    // The old light check passed this (phases + facts); a task with no hours must be a miss.
    const broken = { ...plan, phases: [{ ...plan.phases[0], tasks: [{ task: "x", role: "BA", category: "code" }] }] };
    vi.stubGlobal("fetch", vi.fn(async () => Response.json({ result: JSON.stringify(broken) })));
    expect(await cache.get("k")).toBeNull();
  });
});

describe("usageStats", () => {
  const dbRow = { plans: "12", median_ms: "4200", p95_ms: 9100.5, cache_rate: "0.25", avg_cost: "0.0015" };

  it("is null without DATABASE_URL", async () => {
    vi.stubEnv("DATABASE_URL", "");
    expect(await usageStats()).toBeNull();
    expect(query).not.toHaveBeenCalled();
  });

  it("maps the row to seconds, percent and US cents with one fixed query", async () => {
    vi.stubEnv("DATABASE_URL", "postgres://u:p@db.example/portfolio");
    query.mockResolvedValue([dbRow]);
    expect(await usageStats()).toEqual({ plans: 12, medianS: 4.2, p95S: 9.1005, cacheHitPct: 25, costCents: 0.15 });
    expect(query).toHaveBeenCalledTimes(1);
    expect(query.mock.calls[0]).toHaveLength(1); // no parameters: no user input
  });

  it("is null for no rows, no plans, all-cache-hit (null timings) or a failing query", async () => {
    vi.stubEnv("DATABASE_URL", "postgres://u:p@db.example/portfolio");
    query.mockResolvedValueOnce([]);
    expect(await usageStats()).toBeNull();
    query.mockResolvedValueOnce([{ ...dbRow, plans: "0" }]);
    expect(await usageStats()).toBeNull();
    query.mockResolvedValueOnce([{ ...dbRow, median_ms: null, p95_ms: null, avg_cost: null }]);
    expect(await usageStats()).toBeNull();
    query.mockRejectedValueOnce(new Error("down"));
    expect(await usageStats()).toBeNull();
  });
});
