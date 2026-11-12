import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

describe("checkLimitsInMemory", () => {
  beforeEach(() => {
    vi.resetModules();
    process.env.RATE_LIMIT_PER_HOUR = "2";
    process.env.DAILY_LIMIT = "3";
  });

  it("limits each IP per hour", async () => {
    const { checkLimitsInMemory } = await import("@/lib/rateLimit");
    expect(checkLimitsInMemory("1.1.1.1").ok).toBe(true);
    expect(checkLimitsInMemory("1.1.1.1").ok).toBe(true);
    const third = checkLimitsInMemory("1.1.1.1");
    expect(third.ok).toBe(false);
    if (!third.ok) expect(third.retryAfter).toBeGreaterThan(0);
  });

  it("enforces the global daily cap across IPs", async () => {
    const { checkLimitsInMemory } = await import("@/lib/rateLimit");
    expect(checkLimitsInMemory("a").ok).toBe(true);
    expect(checkLimitsInMemory("b").ok).toBe(true);
    expect(checkLimitsInMemory("c").ok).toBe(true);
    expect(checkLimitsInMemory("d").ok).toBe(false);
  });

  it("falls back to defaults for NaN, zero or negative env values", async () => {
    process.env.RATE_LIMIT_PER_HOUR = "abc";
    process.env.DAILY_LIMIT = "-1";
    const { checkLimitsInMemory } = await import("@/lib/rateLimit");
    for (let i = 0; i < 5; i++) expect(checkLimitsInMemory("z").ok).toBe(true);
    expect(checkLimitsInMemory("z").ok).toBe(false); // default 5 per hour
    expect(checkLimitsInMemory("y").ok).toBe(true); // default daily cap is not zero
  });
});

describe("checkLimitsInMemory over time", () => {
  const HOUR = 3_600_000;

  beforeEach(() => {
    vi.resetModules();
    vi.useFakeTimers();
    vi.setSystemTime(new Date("2026-03-10T10:00:00Z"));
    vi.stubEnv("RATE_LIMIT_PER_HOUR", "2");
    vi.stubEnv("DAILY_LIMIT", "100");
  });

  afterEach(() => {
    vi.useRealTimers();
    vi.unstubAllEnvs();
  });

  it("slides the window: allowed again an hour after the first hit", async () => {
    const { checkLimitsInMemory } = await import("@/lib/rateLimit");
    expect(checkLimitsInMemory("ip").ok).toBe(true);
    vi.advanceTimersByTime(10 * 60_000);
    expect(checkLimitsInMemory("ip").ok).toBe(true);
    expect(checkLimitsInMemory("ip").ok).toBe(false);
    vi.advanceTimersByTime(50 * 60_000 - 1);
    expect(checkLimitsInMemory("ip").ok).toBe(false);
    vi.advanceTimersByTime(1);
    expect(checkLimitsInMemory("ip").ok).toBe(true); // first hit just left the window
    expect(checkLimitsInMemory("ip").ok).toBe(false); // second hit still inside
  });

  it("reports retryAfter in seconds and minutes in the message", async () => {
    const { checkLimitsInMemory } = await import("@/lib/rateLimit");
    checkLimitsInMemory("ip");
    vi.advanceTimersByTime(15 * 60_000);
    checkLimitsInMemory("ip");
    const r = checkLimitsInMemory("ip");
    expect(r.ok).toBe(false);
    if (!r.ok) {
      expect(r.retryAfter).toBe(45 * 60);
      expect(r.reason).toContain("2 estimates this hour");
      expect(r.reason).toContain("45 minutes");
    }
  });

  it("rounds retryAfter up to whole seconds and minutes", async () => {
    const { checkLimitsInMemory } = await import("@/lib/rateLimit");
    checkLimitsInMemory("ip");
    checkLimitsInMemory("ip");
    vi.advanceTimersByTime(HOUR - 1500);
    const r = checkLimitsInMemory("ip");
    if (r.ok) throw new Error("expected a block");
    expect(r.retryAfter).toBe(2);
    expect(r.reason).toContain("1 minutes");
  });

  it("isolates IPs from each other", async () => {
    const { checkLimitsInMemory } = await import("@/lib/rateLimit");
    checkLimitsInMemory("a");
    checkLimitsInMemory("a");
    expect(checkLimitsInMemory("a").ok).toBe(false);
    expect(checkLimitsInMemory("b").ok).toBe(true);
  });

  it("resets the daily count when the UTC date rolls over", async () => {
    vi.stubEnv("DAILY_LIMIT", "2");
    vi.setSystemTime(new Date("2026-03-10T23:30:00Z"));
    vi.resetModules();
    const { checkLimitsInMemory } = await import("@/lib/rateLimit");
    expect(checkLimitsInMemory("a").ok).toBe(true);
    expect(checkLimitsInMemory("b").ok).toBe(true);
    const blocked = checkLimitsInMemory("c");
    expect(blocked.ok).toBe(false);
    if (!blocked.ok) expect(blocked.reason).toContain("today's limit");
    vi.setSystemTime(new Date("2026-03-11T00:00:01Z"));
    expect(checkLimitsInMemory("c").ok).toBe(true);
  });

  it("prunes IPs whose hits are all outside the window", async () => {
    const { checkLimitsInMemory, visitorCountForTests } = await import("@/lib/rateLimit");
    checkLimitsInMemory("a");
    checkLimitsInMemory("b");
    expect(visitorCountForTests()).toBe(2);
    vi.advanceTimersByTime(HOUR + 1000);
    checkLimitsInMemory("c");
    expect(visitorCountForTests()).toBe(1);
  });

  it("keeps IPs that still have a recent hit when sweeping", async () => {
    const { checkLimitsInMemory, visitorCountForTests } = await import("@/lib/rateLimit");
    checkLimitsInMemory("old");
    vi.advanceTimersByTime(HOUR - 1000);
    checkLimitsInMemory("recent");
    vi.advanceTimersByTime(2000);
    checkLimitsInMemory("new");
    expect(visitorCountForTests()).toBe(2); // old pruned, recent and new kept
  });
});

describe("checkLimits with Upstash (fetch mocked, never the real service)", () => {
  const NOW = new Date("2026-03-10T10:00:00Z").getTime();
  const IP = "203.0.113.7";

  type Sent = { url: string; headers: Record<string, string>; body: string[] };

  function mockUpstash(reply: () => Response | Promise<Response>) {
    const sent: Sent[] = [];
    const fn = vi.fn(async (input: string | URL | Request, init?: RequestInit) => {
      sent.push({ url: String(input), headers: init?.headers as Record<string, string>, body: JSON.parse(String(init?.body)) });
      return reply();
    });
    vi.stubGlobal("fetch", fn);
    return sent;
  }

  beforeEach(() => {
    vi.resetModules();
    vi.useFakeTimers({ toFake: ["Date"] });
    vi.setSystemTime(NOW);
    vi.stubEnv("RATE_LIMIT_PER_HOUR", "2");
    vi.stubEnv("DAILY_LIMIT", "3");
    vi.stubEnv("UPSTASH_REDIS_REST_URL", "https://example-db.upstash.io");
    vi.stubEnv("UPSTASH_REDIS_REST_TOKEN", "upstash-test-token");
    vi.spyOn(console, "error").mockImplementation(() => {});
  });

  afterEach(() => {
    vi.useRealTimers();
    vi.unstubAllEnvs();
    vi.unstubAllGlobals();
    vi.restoreAllMocks();
  });

  it("allows when the script returns {0, 0} and sends one EVAL with hashed keys and the limits", async () => {
    const sent = mockUpstash(() => Response.json({ result: [0, 0] }));
    const { checkLimits, LIMIT_SCRIPT, visitorKey } = await import("@/lib/rateLimit");
    expect(await checkLimits(IP)).toEqual({ ok: true });
    expect(sent).toHaveLength(1);
    const { url, headers, body } = sent[0];
    expect(url).toBe("https://example-db.upstash.io");
    expect(headers.authorization).toBe("Bearer upstash-test-token");
    expect(body.slice(0, 5)).toEqual(["EVAL", LIMIT_SCRIPT, "2", visitorKey(IP), "est:{rl}:d:2026-03-10"]);
    expect(body[3]).toMatch(/^est:\{rl\}:v:[0-9a-f]{32}$/);
    expect(body.slice(5, 9)).toEqual([String(NOW), String(NOW - 3_600_000), "2", "3"]);
    expect(body[9]).toMatch(new RegExp(`^${NOW}-[0-9a-f]{12}$`));
    expect(JSON.stringify(body)).not.toContain(IP);
    expect(JSON.stringify(body)).not.toContain("upstash-test-token");
  });

  it("uses a unique member per hit", async () => {
    const sent = mockUpstash(() => Response.json({ result: [0, 0] }));
    const { checkLimits } = await import("@/lib/rateLimit");
    await checkLimits(IP);
    await checkLimits(IP);
    expect(sent[0].body[9]).not.toBe(sent[1].body[9]);
  });

  it("blocks per visitor with the same message and Retry-After maths as in memory", async () => {
    const oldest = NOW - 15 * 60_000;
    mockUpstash(() => Response.json({ result: [2, String(oldest)] }));
    const { checkLimits } = await import("@/lib/rateLimit");
    const r = await checkLimits(IP);
    if (r.ok) throw new Error("expected a block");
    expect(r.retryAfter).toBe(45 * 60);
    expect(r.reason).toBe("You've used 2 estimates this hour. Try again in 45 minutes.");
  });

  it("rounds Retry-After up like the in-memory limiter", async () => {
    mockUpstash(() => Response.json({ result: [2, NOW - 3_600_000 + 1500] }));
    const { checkLimits } = await import("@/lib/rateLimit");
    const r = await checkLimits(IP);
    if (r.ok) throw new Error("expected a block");
    expect(r.retryAfter).toBe(2);
    expect(r.reason).toContain("1 minutes");
  });

  it("blocks on the daily cap with a 3600 s Retry-After", async () => {
    mockUpstash(() => Response.json({ result: [1, 0] }));
    const { checkLimits } = await import("@/lib/rateLimit");
    expect(await checkLimits(IP)).toEqual({
      ok: false,
      reason: "The demo has reached today's limit. Try again tomorrow.",
      retryAfter: 3600,
    });
  });

  const failures: [string, () => Response | Promise<Response>][] = [
    ["a network error", () => Promise.reject(new TypeError("fetch failed"))],
    ["a non-2xx status", () => new Response("nope", { status: 500 })],
    ["an {error} reply", () => Response.json({ error: "WRONGPASS invalid password" }, { status: 200 })],
    ["a reply without result", () => Response.json({ ok: true })],
    ["a non-JSON reply", () => new Response("<html>", { status: 200 })],
    ["a malformed result", () => Response.json({ result: "OK" })],
    ["an unknown result code", () => Response.json({ result: [7, 0] })],
  ];

  it.each(failures)("falls back to the in-memory limiter on %s", async (_label, reply) => {
    mockUpstash(reply);
    const { checkLimits } = await import("@/lib/rateLimit");
    expect((await checkLimits(IP)).ok).toBe(true);
    expect((await checkLimits(IP)).ok).toBe(true);
    const third = await checkLimits(IP);
    expect(third.ok).toBe(false); // in-memory per-hour limit of 2 still blocks
    const logged = JSON.stringify(vi.mocked(console.error).mock.calls);
    expect(logged).toContain("in-memory");
    expect(logged).not.toContain("upstash-test-token");
    expect(logged).not.toContain("example-db");
    expect(logged).not.toContain(IP);
    expect(logged).not.toContain("WRONGPASS");
  });

  it("falls back when Upstash takes longer than the 1 s timeout", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn(
        (_input: string | URL | Request, init?: RequestInit) =>
          new Promise<Response>((_resolve, reject) => {
            init?.signal?.addEventListener("abort", () => reject(init.signal?.reason));
          }),
      ),
    );
    const { checkLimits } = await import("@/lib/rateLimit");
    expect((await checkLimits(IP)).ok).toBe(true);
    expect(JSON.stringify(vi.mocked(console.error).mock.calls)).toContain("TimeoutError");
  });

  it("uses the in-memory limiter without calling fetch when the env vars are missing", async () => {
    vi.stubEnv("UPSTASH_REDIS_REST_TOKEN", "");
    const fn = vi.fn();
    vi.stubGlobal("fetch", fn);
    const { checkLimits } = await import("@/lib/rateLimit");
    expect((await checkLimits(IP)).ok).toBe(true);
    expect((await checkLimits(IP)).ok).toBe(true);
    expect((await checkLimits(IP)).ok).toBe(false);
    expect(fn).not.toHaveBeenCalled();
    expect(console.error).not.toHaveBeenCalled();
  });

  const oddBlocks: [string, unknown, number][] = [
    ["a non-numeric oldest score", "abc", 3600],
    ["an oldest score older than the window (clock skew)", NOW - 2 * 3_600_000, 1],
    ["an oldest score in the future (clock skew)", NOW + 60_000, 3600],
  ];

  it.each(oddBlocks)("still blocks on %s, with Retry-After clamped to 1..3600 s", async (_label, score, retryAfter) => {
    mockUpstash(() => Response.json({ result: [2, score] }));
    const { checkLimits } = await import("@/lib/rateLimit");
    const res = await checkLimits(IP);
    expect(res.ok).toBe(false);
    if (!res.ok) expect(res.retryAfter).toBe(retryAfter);
    expect(console.error).not.toHaveBeenCalled();
  });

  it("keeps blocking a visitor who used their hits in memory during an outage, after Upstash recovers", async () => {
    let healthy = false;
    mockUpstash(() => (healthy ? Response.json({ result: [0, 0] }) : new Response("down", { status: 503 })));
    const { checkLimits } = await import("@/lib/rateLimit");
    expect((await checkLimits(IP)).ok).toBe(true);
    expect((await checkLimits(IP)).ok).toBe(true);
    healthy = true; // Upstash never saw those two hits and would allow
    expect((await checkLimits(IP)).ok).toBe(false);
  });

  it("mirrors hits allowed by Upstash in memory, so a later fallback still blocks", async () => {
    let healthy = true;
    mockUpstash(() => (healthy ? Response.json({ result: [0, 0] }) : new Response("down", { status: 503 })));
    const { checkLimits } = await import("@/lib/rateLimit");
    expect((await checkLimits(IP)).ok).toBe(true);
    expect((await checkLimits(IP)).ok).toBe(true);
    healthy = false;
    expect((await checkLimits(IP)).ok).toBe(false);
  });

  it("hashes the IP into a stable, truncated SHA-256 key", async () => {
    const { visitorKey } = await import("@/lib/rateLimit");
    expect(visitorKey("1.2.3.4")).toBe(visitorKey("1.2.3.4"));
    expect(visitorKey("1.2.3.4")).not.toBe(visitorKey("1.2.3.5"));
    expect(visitorKey("1.2.3.4")).toMatch(/^est:\{rl\}:v:[0-9a-f]{32}$/);
  });
});
