import { describe, expect, it } from "vitest";
import { pickRandom } from "@/lib/pick";
import { estimatorBriefs, estimatorExamples } from "@/lib/content";
import { FEATURE_MAX, validateRequest } from "@/lib/estimate";

describe("pickRandom", () => {
  it("returns n distinct items from the pool", () => {
    for (let run = 0; run < 50; run++) {
      const picked = pickRandom(estimatorExamples, 3);
      expect(picked).toHaveLength(3);
      expect(new Set(picked).size).toBe(3);
      for (const p of picked) expect(estimatorExamples).toContain(p);
    }
  });

  it("can reach the last item and never mutates the pool", () => {
    const pool = ["a", "b", "c", "d"];
    expect(pickRandom(pool, 1, () => 0.999)).toEqual(["d"]);
    expect(pickRandom(pool, 9)).toHaveLength(4);
    expect(pool).toEqual(["a", "b", "c", "d"]);
  });
});

describe("estimatorExamples", () => {
  it("has a pool of unique, valid-length features", () => {
    expect(estimatorExamples.length).toBeGreaterThanOrEqual(30);
    expect(new Set(estimatorExamples).size).toBe(estimatorExamples.length);
    for (const ex of estimatorExamples) expect(ex.length).toBeGreaterThanOrEqual(20);
  });
});

describe("estimatorBriefs", () => {
  it("has unique titles and texts that pass the request validation", () => {
    expect(estimatorBriefs.length).toBeGreaterThanOrEqual(6);
    expect(new Set(estimatorBriefs.map((b) => b.title)).size).toBe(estimatorBriefs.length);
    for (const b of estimatorBriefs) {
      expect(b.text.length).toBeLessThanOrEqual(FEATURE_MAX);
      expect(validateRequest({ feature: b.text, teamSize: 3, seniority: "mixed", token: "t" }).ok).toBe(true);
    }
  });
});
