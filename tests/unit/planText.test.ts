import { describe, expect, it } from "vitest";
import { budget } from "@/lib/budget";
import { planToText } from "@/lib/planText";
import { estimatorCopy, profile } from "@/lib/content";
import { samplePlan, sampleScope, sampleTeam } from "@/lib/samplePlan";

describe("planToText", () => {
  const text = planToText(samplePlan, sampleTeam, budget(samplePlan, sampleTeam));
  it("has the title, every phase, contingency and the footer", () => {
    expect(text).toContain(samplePlan.title);
    for (const p of samplePlan.phases) expect(text).toContain(p.name);
    expect(text).toContain(estimatorCopy.budget.contingency(20));
    expect(text.endsWith(estimatorCopy.actions.footer(profile.name))).toBe(true);
  });
  it("works without team inputs", () => {
    const t = planToText(samplePlan, undefined, budget(samplePlan, sampleTeam));
    expect(t).not.toContain(`${estimatorCopy.actions.team}:`);
  });
});

describe("planToText range, facts and comparison", () => {
  const text = planToText(samplePlan, sampleTeam, budget(samplePlan, sampleTeam), sampleScope);
  it("states the effort range, contingency rate and missing facts", () => {
    expect(text).toContain(estimatorCopy.summary.rangeNote(samplePlan.effort.best, samplePlan.effort.worst));
    expect(text).toContain(estimatorCopy.budget.contingency(20));
    expect(text).toContain(estimatorCopy.summary.missing(samplePlan.missingFacts.map((f) => estimatorCopy.factLabels[f]).join(", ")));
  });
  it("includes both working styles only when the scope is given", () => {
    expect(text).toContain(estimatorCopy.compare.heading);
    expect(text).toContain(estimatorCopy.compare.ai);
    expect(planToText(samplePlan, sampleTeam, budget(samplePlan, sampleTeam))).not.toContain(estimatorCopy.compare.heading);
  });
});
