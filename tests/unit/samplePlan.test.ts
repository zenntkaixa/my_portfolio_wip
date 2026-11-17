import { describe, expect, it } from "vitest";
import { normalisePlan } from "@/lib/estimate";
import { isPlan } from "@/lib/estimatorClient";
import { estimatorExamples } from "@/lib/content";
import { sampleFeature, samplePlan } from "@/lib/samplePlan";

describe("the stored example plan", () => {
  it("is a plan the results view accepts", () => {
    expect(isPlan(samplePlan)).toBe(true);
  });

  it("survives the same normalisation a live reply goes through, totals included", () => {
    expect(normalisePlan(samplePlan)).toEqual(samplePlan);
  });

  it("is for the first example feature", () => {
    expect(sampleFeature).toBe(estimatorExamples[0]);
    expect(samplePlan.title.toLowerCase()).toContain("one-time code");
  });
});
