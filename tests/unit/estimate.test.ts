import { describe, expect, it } from "vitest";
import { maxTokensFor, normalisePlan, validateRequest } from "@/lib/estimate";

const valid = { feature: "Let users reset their password by email link", teamSize: 4, seniority: "mixed", token: "t" };

describe("validateRequest", () => {
  it("accepts a valid request", () => {
    const r = validateRequest(valid);
    expect(r.ok).toBe(true);
  });

  it.each([
    [{ ...valid, feature: "too short" }, "at least"],
    [{ ...valid, feature: "x".repeat(1501) }, "under"],
    [{ ...valid, teamSize: 0 }, "Team size"],
    [{ ...valid, teamSize: 2.5 }, "Team size"],
    [{ ...valid, seniority: "principal" }, "seniority"],
    [{ ...valid, token: "" }, "human check"],
    [null, "JSON body"],
  ])("rejects %j", (body, message) => {
    const r = validateRequest(body);
    expect(r.ok).toBe(false);
    if (!r.ok) expect(r.error).toContain(message);
  });
});

describe("maxTokensFor", () => {
  it("gives Haiku 8000 output tokens and other models 4000", () => {
    expect(maxTokensFor("claude-haiku-5-5")).toBe(8000);
    expect(maxTokensFor("claude-sonnet-5-5")).toBe(4000);
  });
});

describe("normalisePlan", () => {
  const raw = {
    title: "Plan",
    summary: "Summary",
    assumptions: ["a"],
    risks: ["r"],
    confidence: "high",
    totalHours: 99999, // the model's arithmetic must be ignored
    phases: [
      { name: "Build", goal: "g", startDay: 0, durationDays: 5, tasks: [{ task: "API", role: "Backend", hours: 10 }, { task: "UI", role: "Frontend", hours: 6 }] },
      { name: "Test", goal: "g", startDay: 4, durationDays: 3, tasks: [{ task: "E2E", role: "QA", hours: 4 }] },
    ],
  };

  it("recomputes totals instead of trusting the model", () => {
    const plan = normalisePlan(raw)!;
    expect(plan.totalHours).toBe(20);
    expect(plan.totalDays).toBe(7);
    expect(plan.calendarWeeks).toBe(1.4);
  });

  it("keeps half-hour totals exact so they match the subtotals", () => {
    const plan = normalisePlan({
      ...raw,
      phases: [
        { ...raw.phases[0], tasks: [{ task: "API", role: "Backend", hours: 10.5 }] },
        { ...raw.phases[1], tasks: [{ task: "E2E", role: "QA", hours: 8 }] },
      ],
    })!;
    expect(plan.totalHours).toBe(18.5);
  });

  it("clamps silly numbers and defaults bad confidence", () => {
    const plan = normalisePlan({
      ...raw,
      confidence: "certain",
      phases: [{ name: "X", startDay: -5, durationDays: 9999, tasks: [{ task: "t", hours: -3 }] }],
    })!;
    expect(plan.confidence).toBe("medium");
    expect(plan.phases[0].startDay).toBe(0);
    expect(plan.phases[0].durationDays).toBe(120);
    expect(plan.phases[0].tasks[0].hours).toBe(0.5);
    expect(plan.phases[0].tasks[0].role).toBe("Backend");
  });

  it("returns null when there are no phases", () => {
    expect(normalisePlan({ title: "x", phases: [] })).toBeNull();
    expect(normalisePlan("nope")).toBeNull();
  });
});
