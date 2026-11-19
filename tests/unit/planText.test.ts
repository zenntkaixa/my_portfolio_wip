import { describe, expect, it } from "vitest";
import { budget } from "@/lib/budget";
import { planToText } from "@/lib/planText";
import { estimatorCopy, profile } from "@/lib/content";
import { samplePlan, sampleTeam } from "@/lib/samplePlan";

describe("planToText", () => {
  const text = planToText(samplePlan, sampleTeam, budget(samplePlan, sampleTeam));
  it("has the title, every phase, contingency and the footer", () => {
    expect(text).toContain(samplePlan.title);
    for (const p of samplePlan.phases) expect(text).toContain(p.name);
    expect(text).toContain(estimatorCopy.budget.contingency);
    expect(text.endsWith(estimatorCopy.actions.footer(profile.name))).toBe(true);
  });
  it("works without team inputs", () => {
    const t = planToText(samplePlan, undefined, budget(samplePlan, sampleTeam));
    expect(t).not.toContain(`${estimatorCopy.actions.team}:`);
  });
});
