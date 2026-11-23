import { describe, expect, it } from "vitest";
import { buildPlan } from "@/lib/estimateModel";
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

describe("planToText task markers", () => {
  const ai = { ...sampleTeam, mode: "ai-assisted" } as const;
  const bi = { teamSize: sampleTeam.size, seniority: sampleTeam.seniority };
  const p = buildPlan(sampleScope, { ...bi, mode: "ai-assisted" });
  const lines = planToText(p, ai, budget(p, ai)).split("\n");
  it("tags AI-reduced and code-added tasks only in AI mode", () => {
    expect(lines.some((l) => l.endsWith(" [AI]"))).toBe(true);
    expect(lines.filter((l) => l.endsWith("[added by code]")).length).toBe(p.phases.flatMap((x) => x.tasks).filter((x) => x.addedByCode).length);
    const t = buildPlan(sampleScope, { ...bi, mode: "traditional" });
    const text = planToText(t, { ...ai, mode: "traditional" }, budget(t, ai));
    expect(text).not.toContain("[AI]");
    expect(text).not.toContain("[added by code]");
  });
});
