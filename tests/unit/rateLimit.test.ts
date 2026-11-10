import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

describe("checkLimits", () => {
  beforeEach(() => {
    vi.resetModules();
    process.env.RATE_LIMIT_PER_HOUR = "2";
    process.env.DAILY_LIMIT = "3";
  });

  it("limits each IP per hour", async () => {
    const { checkLimits } = await import("@/lib/rateLimit");
    expect(checkLimits("1.1.1.1").ok).toBe(true);
    expect(checkLimits("1.1.1.1").ok).toBe(true);
    const third = checkLimits("1.1.1.1");
    expect(third.ok).toBe(false);
    if (!third.ok) expect(third.retryAfter).toBeGreaterThan(0);
  });

  it("enforces the global daily cap across IPs", async () => {
    const { checkLimits } = await import("@/lib/rateLimit");
    expect(checkLimits("a").ok).toBe(true);
    expect(checkLimits("b").ok).toBe(true);
    expect(checkLimits("c").ok).toBe(true);
    expect(checkLimits("d").ok).toBe(false);
  });

  it("falls back to defaults for NaN, zero or negative env values", async () => {
    process.env.RATE_LIMIT_PER_HOUR = "abc";
    process.env.DAILY_LIMIT = "-1";
    const { checkLimits } = await import("@/lib/rateLimit");
    for (let i = 0; i < 5; i++) expect(checkLimits("z").ok).toBe(true);
    expect(checkLimits("z").ok).toBe(false); // default 5 per hour
    expect(checkLimits("y").ok).toBe(true); // default daily cap is not zero
  });
});

describe("checkLimits over time", () => {
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
    const { checkLimits } = await import("@/lib/rateLimit");
    expect(checkLimits("ip").ok).toBe(true);
    vi.advanceTimersByTime(10 * 60_000);
    expect(checkLimits("ip").ok).toBe(true);
    expect(checkLimits("ip").ok).toBe(false);
    vi.advanceTimersByTime(50 * 60_000 - 1);
    expect(checkLimits("ip").ok).toBe(false);
    vi.advanceTimersByTime(1);
    expect(checkLimits("ip").ok).toBe(true); // first hit just left the window
    expect(checkLimits("ip").ok).toBe(false); // second hit still inside
  });

  it("reports retryAfter in seconds and minutes in the message", async () => {
    const { checkLimits } = await import("@/lib/rateLimit");
    checkLimits("ip");
    vi.advanceTimersByTime(15 * 60_000);
    checkLimits("ip");
    const r = checkLimits("ip");
    expect(r.ok).toBe(false);
    if (!r.ok) {
      expect(r.retryAfter).toBe(45 * 60);
      expect(r.reason).toContain("2 estimates this hour");
      expect(r.reason).toContain("45 minutes");
    }
  });

  it("rounds retryAfter up to whole seconds and minutes", async () => {
    const { checkLimits } = await import("@/lib/rateLimit");
    checkLimits("ip");
    checkLimits("ip");
    vi.advanceTimersByTime(HOUR - 1500);
    const r = checkLimits("ip");
    if (r.ok) throw new Error("expected a block");
    expect(r.retryAfter).toBe(2);
    expect(r.reason).toContain("1 minutes");
  });

  it("isolates IPs from each other", async () => {
    const { checkLimits } = await import("@/lib/rateLimit");
    checkLimits("a");
    checkLimits("a");
    expect(checkLimits("a").ok).toBe(false);
    expect(checkLimits("b").ok).toBe(true);
  });

  it("resets the daily count when the UTC date rolls over", async () => {
    vi.stubEnv("DAILY_LIMIT", "2");
    vi.setSystemTime(new Date("2026-03-10T23:30:00Z"));
    vi.resetModules();
    const { checkLimits } = await import("@/lib/rateLimit");
    expect(checkLimits("a").ok).toBe(true);
    expect(checkLimits("b").ok).toBe(true);
    const blocked = checkLimits("c");
    expect(blocked.ok).toBe(false);
    if (!blocked.ok) expect(blocked.reason).toContain("today's limit");
    vi.setSystemTime(new Date("2026-03-11T00:00:01Z"));
    expect(checkLimits("c").ok).toBe(true);
  });

  it("prunes IPs whose hits are all outside the window", async () => {
    const { checkLimits, visitorCountForTests } = await import("@/lib/rateLimit");
    checkLimits("a");
    checkLimits("b");
    expect(visitorCountForTests()).toBe(2);
    vi.advanceTimersByTime(HOUR + 1000);
    checkLimits("c");
    expect(visitorCountForTests()).toBe(1);
  });

  it("keeps IPs that still have a recent hit when sweeping", async () => {
    const { checkLimits, visitorCountForTests } = await import("@/lib/rateLimit");
    checkLimits("old");
    vi.advanceTimersByTime(HOUR - 1000);
    checkLimits("recent");
    vi.advanceTimersByTime(2000);
    checkLimits("new");
    expect(visitorCountForTests()).toBe(2); // old pruned, recent and new kept
  });
});
