import { describe, expect, it } from "vitest";
import plan from "../fixtures/plan.json";
import { formatWait, isPlan, parseRetryAfter } from "@/lib/estimatorClient";

describe("formatWait", () => {
  it("shows seconds under a minute", () => {
    expect(formatWait(3)).toBe("3s");
    expect(formatWait(59)).toBe("59s");
  });
  it("shows m:ss from a minute up", () => {
    expect(formatWait(60)).toBe("1:00");
    expect(formatWait(125)).toBe("2:05");
    expect(formatWait(3600)).toBe("60:00");
  });
});

describe("parseRetryAfter", () => {
  const now = Date.parse("2026-01-01T00:00:00Z");
  it("reads delta seconds", () => expect(parseRetryAfter("3", now)).toBe(3));
  it("reads an HTTP date", () => {
    expect(parseRetryAfter("Thu, 01 Jan 2026 00:02:00 GMT", now)).toBe(120);
  });
  it("treats a past HTTP date as 1 second", () => {
    expect(parseRetryAfter("Wed, 31 Dec 2025 23:00:00 GMT", now)).toBe(1);
  });
  it("falls back to 60 when missing or invalid", () => {
    expect(parseRetryAfter(null, now)).toBe(60);
    expect(parseRetryAfter("", now)).toBe(60);
    expect(parseRetryAfter("soon", now)).toBe(60);
    expect(parseRetryAfter("-5", now)).toBe(60);
  });
  it("raises 0 to 1 and caps at 3600", () => {
    expect(parseRetryAfter("0", now)).toBe(1);
    expect(parseRetryAfter("99999", now)).toBe(3600);
  });
});

describe("isPlan", () => {
  it("accepts the fixture plan", () => expect(isPlan(plan.plan)).toBe(true));
  it("rejects non-objects and missing fields", () => {
    expect(isPlan(null)).toBe(false);
    expect(isPlan("plan")).toBe(false);
    expect(isPlan({ title: "x" })).toBe(false);
    expect(isPlan({ ...plan.plan, summary: 5 })).toBe(false);
    expect(isPlan({ ...plan.plan, totalHours: "180" })).toBe(false);
  });
  it("rejects bad phases and lists", () => {
    expect(isPlan({ ...plan.plan, phases: "none" })).toBe(false);
    expect(isPlan({ ...plan.plan, phases: [{ name: "a" }] })).toBe(false);
    expect(isPlan({ ...plan.plan, risks: [1] })).toBe(false);
  });
});
