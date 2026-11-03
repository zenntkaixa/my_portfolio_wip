import { beforeEach, describe, expect, it, vi } from "vitest";

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
});
