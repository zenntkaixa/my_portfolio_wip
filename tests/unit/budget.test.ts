import { describe, expect, it } from "vitest";
import { budget, CONTINGENCY, HOURLY_RATE, SEAT } from "@/lib/budget";
import { samplePlan } from "@/lib/samplePlan";

describe("budget", () => {
  const plan = { ...samplePlan, confidence: "medium" as const, totalHours: 100, effort: { best: 80, likely: 100, worst: 150 }, calendarWeeks: 5 };

  it("charges hours at the seniority rate and adds one-off costs to the build", () => {
    const b = budget(plan, { size: 3, seniority: "senior", mode: "traditional" });
    expect(b.rate).toBe(HOURLY_RATE.senior);
    expect(b.people).toBe(100 * HOURLY_RATE.senior);
    expect(b.seats).toBeNull();
    expect(b.oneOff).toEqual({ low: 3000, high: 8000 });
    expect(b.monthly).toEqual({ low: 200, high: 1050 });
    expect(b.contingency).toBe(2400);
    expect(b.peopleRange).toEqual({ low: 9600, high: 18000 });
    expect(b.contingencyRange).toEqual({ low: 1920, high: 3600 });
    // The build range is the sum of the rows: people and contingency at best and worst effort, plus one-off costs.
    expect(b.build).toEqual({ low: 9600 + 1920 + 3000, high: 18000 + 3600 + 8000 });
  });

  it("adds one seat per person for every started month when working with AI agents", () => {
    const b = budget(plan, { size: 3, seniority: "mixed", mode: "ai-assisted" });
    expect(b.seats).toEqual({ count: 3, months: 2, low: 3 * 2 * SEAT.low, high: 3 * 2 * SEAT.high });
    expect(b.build.low).toBe(6240 + 1248 + 3 * 2 * SEAT.low + 3000);
  });

  it("sets contingency by confidence: 10% high, 20% medium, 30% low", () => {
    expect(CONTINGENCY).toEqual({ high: 0.1, medium: 0.2, low: 0.3 });
    const team = { size: 2, seniority: "mid", mode: "traditional" } as const;
    expect(budget({ ...plan, confidence: "high" }, team)).toMatchObject({ people: 7500, contingencyRate: 0.1, contingency: 750 });
    expect(budget({ ...plan, confidence: "medium" }, team)).toMatchObject({ contingencyRate: 0.2, contingency: 1500 });
    expect(budget({ ...plan, confidence: "low" }, team)).toMatchObject({ contingencyRate: 0.3, contingency: 2250 });
  });

  it("adds medium (20%) contingency on people cost, rounded to whole ringgit, and blends mixed at RM 78", () => {
    expect(plan.confidence).toBe("medium");
    expect(HOURLY_RATE.mixed).toBe(78);
    const b = budget({ ...plan, totalHours: 12.5, effort: { best: 10, likely: 12.5, worst: 15 } }, { size: 1, seniority: "mixed", mode: "traditional" });
    expect(b.people).toBe(975);
    expect(b.contingency).toBe(195);
    expect(b.build).toEqual({ low: 780 + 156 + 3000, high: 1170 + 234 + 8000 });
  });

  it("charges at least one month of seats", () => {
    expect(budget({ ...plan, calendarWeeks: 1 }, { size: 2, seniority: "mid", mode: "ai-assisted" }).seats?.months).toBe(1);
  });
});
