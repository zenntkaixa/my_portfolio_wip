import { describe, expect, it } from "vitest";
import { budget, CONTINGENCY, HOURLY_RATE, SEAT } from "@/lib/budget";
import { samplePlan } from "@/lib/samplePlan";

describe("budget", () => {
  const plan = { ...samplePlan, totalHours: 100, calendarWeeks: 5 };

  it("charges hours at the seniority rate and adds one-off costs to the build", () => {
    const b = budget(plan, { size: 3, seniority: "senior", mode: "traditional" });
    expect(b.rate).toBe(HOURLY_RATE.senior);
    expect(b.people).toBe(100 * HOURLY_RATE.senior);
    expect(b.seats).toBeNull();
    expect(b.oneOff).toEqual({ low: 3000, high: 8000 });
    expect(b.monthly).toEqual({ low: 200, high: 1050 });
    expect(b.contingency).toBe(2400);
    expect(b.build).toEqual({ low: 12000 + 2400 + 3000, high: 12000 + 2400 + 8000 });
  });

  it("adds one seat per person for every started month when working with AI agents", () => {
    const b = budget(plan, { size: 3, seniority: "mixed", mode: "ai-assisted" });
    expect(b.seats).toEqual({ count: 3, months: 2, low: 3 * 2 * SEAT.low, high: 3 * 2 * SEAT.high });
    expect(b.build.low).toBe(7800 + 1560 + 3 * 2 * SEAT.low + 3000);
  });

  it("adds 20% contingency on people cost, rounded to whole ringgit, and blends mixed at RM 78", () => {
    expect(CONTINGENCY).toBe(0.2);
    expect(HOURLY_RATE.mixed).toBe(78);
    const b = budget({ ...plan, totalHours: 12.5 }, { size: 1, seniority: "mixed", mode: "traditional" });
    expect(b.people).toBe(975);
    expect(b.contingency).toBe(195);
    expect(b.build.low).toBe(975 + 195 + 3000);
  });

  it("charges at least one month of seats", () => {
    expect(budget({ ...plan, calendarWeeks: 1 }, { size: 2, seniority: "mid", mode: "ai-assisted" }).seats?.months).toBe(1);
  });
});
