import { describe, expect, it } from "vitest";
import plan from "../fixtures/plan.json";
import { formatWait, isPlan, isScope, parseRetryAfter } from "@/lib/estimatorClient";
import { buildPlan } from "@/lib/estimateModel";
import type { Scope } from "@/lib/estimate";

const built = buildPlan(plan.scope as Scope, { teamSize: 4, seniority: "mixed", mode: "traditional" });

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

describe("isScope", () => {
  const s = plan.scope;
  const task = s.phases[0].tasks[0];
  const withTask = (t: unknown) => ({ ...s, phases: [{ ...s.phases[0], tasks: [t] }] });
  it("accepts the fixture scope", () => expect(isScope(s)).toBe(true));
  it("rejects a bad category, hours out of range and missing facts", () => {
    expect(isScope(withTask({ ...task, category: "magic" }))).toBe(false);
    expect(isScope(withTask({ ...task, baseHours: 0 }))).toBe(false);
    expect(isScope(withTask({ ...task, baseHours: 401 }))).toBe(false);
    expect(isScope(withTask({ ...task, baseHours: "8" }))).toBe(false);
    expect(isScope(withTask({ task: "a", role: "b", hours: 8 }))).toBe(false); // the old plan shape
    expect(isScope({ ...s, facts: { ...s.facts, users: "yes" } })).toBe(false);
    const { facts: _f, ...noFacts } = s;
    expect(isScope(noFacts)).toBe(false);
  });
  it("rejects no phases, a zero-day phase and non-objects", () => {
    expect(isScope({ ...s, phases: [] })).toBe(false);
    expect(isScope({ ...s, phases: [{ ...s.phases[0], durationDays: 0 }] })).toBe(false);
    expect(isScope(null)).toBe(false);
    expect(isScope({ ...s, openQuestions: undefined })).toBe(false);
  });
});

describe("isPlan", () => {
  const withPhases = (phases: unknown) => ({ ...built, phases });
  it("rejects non-object phases and tasks, and malformed tasks", () => {
    expect(isPlan(withPhases([null]))).toBe(false);
    const ph = built.phases[0];
    expect(isPlan(withPhases([{ ...ph, tasks: ["x"] }]))).toBe(false);
    expect(isPlan(withPhases([{ ...ph, tasks: [{ task: "a", role: "b" }] }]))).toBe(false);
    expect(isPlan(withPhases([{ ...ph, tasks: [{ task: 1, role: "b", hours: 2 }] }]))).toBe(false);
    expect(isPlan(withPhases([{ ...ph, tasks: [{ task: "a", role: "b", hours: NaN }] }]))).toBe(false);
  });
  it("rejects non-finite or absurd totals", () => {
    expect(isPlan({ ...built, totalHours: Infinity })).toBe(false);
    expect(isPlan({ ...built, totalHours: 100001 })).toBe(false);
    expect(isPlan({ ...built, totalDays: 2001 })).toBe(false);
    expect(isPlan({ ...built, calendarWeeks: 401 })).toBe(false);
    expect(isPlan({ ...built, totalHours: 100000, totalDays: 2000, calendarWeeks: 400 })).toBe(true);
  });
  it("accepts the fixture plan", () => expect(isPlan(built)).toBe(true));
  it("accepts plans without openQuestions/outOfScope but rejects non-string lists", () => {
    const { openQuestions: _q, outOfScope: _o, ...older } = built;
    expect(isPlan(older)).toBe(true);
    expect(isPlan({ ...built, openQuestions: [1] })).toBe(false);
    expect(isPlan({ ...built, outOfScope: "x" })).toBe(false);
  });
  it("rejects a plan without a costs list", () => {
    const { costs: _costs, ...noCosts } = built;
    expect(isPlan(noCosts)).toBe(false);
  });
  it("rejects non-objects and missing fields", () => {
    expect(isPlan(null)).toBe(false);
    expect(isPlan("plan")).toBe(false);
    expect(isPlan({ title: "x" })).toBe(false);
    expect(isPlan({ ...built, summary: 5 })).toBe(false);
    expect(isPlan({ ...built, totalHours: "180" })).toBe(false);
  });
  it("rejects bad phases and lists", () => {
    expect(isPlan({ ...built, phases: "none" })).toBe(false);
    expect(isPlan({ ...built, phases: [{ name: "a" }] })).toBe(false);
    expect(isPlan({ ...built, risks: [1] })).toBe(false);
  });
});
