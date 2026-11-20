import { describe, expect, it } from "vitest";
import { normaliseScope } from "@/lib/estimate";
import { isPlan, isScope } from "@/lib/estimatorClient";
import { estimatorExamples } from "@/lib/content";
import { sampleFeature, samplePlan, sampleScope, sampleTeam } from "@/lib/samplePlan";

describe("the stored example plan", () => {
  it("is a plan the results view accepts", () => {
    expect(isScope(sampleScope)).toBe(true);
    expect(isPlan(samplePlan)).toBe(true);
  });

  it("survives the same normalisation a live reply goes through and keeps its numbers", () => {
    expect(normaliseScope(sampleScope, sampleTeam.size)).toEqual(sampleScope);
    expect([samplePlan.totalHours, samplePlan.totalDays, samplePlan.calendarWeeks, samplePlan.confidence]).toEqual([112, 13, 2.6, "medium"]);
    expect(samplePlan.calendarAdjusted).toBeUndefined();
  });

  it("is for the first example feature", () => {
    expect(sampleFeature).toBe(estimatorExamples[0]);
    expect(samplePlan.title.toLowerCase()).toContain("one-time code");
  });
});
