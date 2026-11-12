import { describe, expect, it } from "vitest";
import { ANALYTICS_SCRIPT_SRC, analyticsEnabled } from "@/lib/analytics";

describe("analyticsEnabled", () => {
  it("is on for Vercel production", () => {
    expect(analyticsEnabled({ VERCEL_ENV: "production" })).toBe(true);
  });

  it.each(["preview", "development", ""])("is off for VERCEL_ENV=%j", (value) => {
    expect(analyticsEnabled({ VERCEL_ENV: value })).toBe(false);
  });

  it("is off when VERCEL_ENV is unset", () => {
    expect(analyticsEnabled({})).toBe(false);
  });

  it("uses the same-origin Vercel path", () => {
    expect(ANALYTICS_SCRIPT_SRC).toBe("/_vercel/insights/script.js");
  });
});
