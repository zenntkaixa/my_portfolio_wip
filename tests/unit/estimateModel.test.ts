import { describe, expect, it } from "vitest";
import type { Category, Scope, ScopeTask } from "@/lib/estimate";
import {
  AGENT_FRIENDLY,
  AI_FACTOR,
  buildPlan,
  CONFIDENCE_SPREAD,
  confidenceFor,
  HOURS_PER_DAY,
  REVIEW_SHARE,
  SENIORITY_FACTOR,
} from "@/lib/estimateModel";
import { estimatorCopy } from "@/lib/content";
import { sampleScope } from "@/lib/samplePlan";
import { compareModes } from "@/lib/estimateCompare";
import { budget } from "@/lib/budget";

const REVIEW = estimatorCopy.aiPlan.reviewTask;
const facts = (n: number) => {
  const keys = ["users", "systems", "data", "integrations", "limits", "outOfScope"] as const;
  return Object.fromEntries(keys.map((k, i) => [k, i < n])) as Scope["facts"];
};
const t = (category: Category, baseHours: number, role = "Backend"): ScopeTask => ({ task: `${category} ${baseHours}`, role, category, baseHours });
const ph = (startDay: number, durationDays: number, tasks: ScopeTask[], name = `P${startDay}`) => ({ name, goal: "g", startDay, durationDays, tasks });
const scope = (phases: Scope["phases"], over: Partial<Scope> = {}): Scope => ({
  title: "T", summary: "S", assumptions: ["a"], risks: ["r"], facts: facts(2), costs: [], openQuestions: [], outOfScope: [], phases, ...over,
});
const trad = { teamSize: 4, seniority: "mid", mode: "traditional" } as const;
const ai = { ...trad, mode: "ai-assisted" } as const;

describe("published factors", () => {
  it("pins every constant", () => {
    expect(SENIORITY_FACTOR).toEqual({ junior: 1.3, mid: 1, senior: 0.85, mixed: 1 });
    expect(AGENT_FRIENDLY).toEqual(["code", "tests", "docs-config"]);
    expect(AI_FACTOR).toEqual({ best: 0.6, likely: 0.7, worst: 0.8 });
    expect(REVIEW_SHARE).toBe(0.15);
    expect(CONFIDENCE_SPREAD).toEqual({ high: { best: 0.9, worst: 1.15 }, medium: { best: 0.85, worst: 1.3 }, low: { best: 0.8, worst: 1.5 } });
    expect(HOURS_PER_DAY).toBe(6);
  });
});

describe("confidenceFor", () => {
  it.each([[0, "low"], [1, "low"], [2, "medium"], [3, "medium"], [4, "high"], [6, "high"]] as const)("%i facts -> %s", (n, level) => {
    expect(confidenceFor(facts(n))).toBe(level);
  });

  it("lists the missing facts on the plan in order", () => {
    const p = buildPlan(scope([ph(0, 5, [t("code", 10)])], { facts: facts(4) }), trad);
    expect(p.confidence).toBe("high");
    expect(p.missingFacts).toEqual(["limits", "outOfScope"]);
  });
});

describe("buildPlan hours", () => {
  const s = scope([ph(0, 5, [t("design", 10), t("code", 20), t("tests", 10, "QA"), t("integration", 8)])]);

  it.each([["junior", 1.3], ["mid", 1], ["senior", 0.85], ["mixed", 1]] as const)("%s scales every task by %d", (seniority, f) => {
    const p = buildPlan(s, { ...trad, seniority });
    expect(p.phases[0].tasks.map((x) => x.hours)).toEqual([10, 20, 10, 8].map((h) => Math.round(h * f * 2) / 2));
  });

  it("applies the AI band only to code, tests and docs-config, then adds one review task", () => {
    const p = buildPlan(scope([ph(0, 5, AGENT_FRIENDLY.map((c) => t(c, 10)).concat([t("discovery", 10), t("design", 10), t("integration", 10), t("security", 10), t("uat", 10), t("release", 10)]))]), ai);
    const hours = Object.fromEntries(p.phases[0].tasks.filter((x) => x.task !== REVIEW).map((x) => [x.category, x.hours]));
    expect(hours).toEqual({ code: 7, tests: 7, "docs-config": 7, discovery: 10, design: 10, integration: 10, security: 10, uat: 10, release: 10 });
    expect(p.phases[0].tasks.filter((x) => x.task === REVIEW)).toEqual([{ task: REVIEW, role: "Backend", category: "code", hours: 3 }]); // 15% of 21
  });

  it("gives the review task to the phase's most-hours role, rounds to 0.5 h with a 0.5 h minimum, and skips phases without agent work", () => {
    const p = buildPlan(scope([
      ph(0, 2, [t("discovery", 8, "BA")]),
      ph(2, 5, [t("code", 10, "Backend"), t("code", 30, "Frontend")]),
      ph(7, 2, [t("tests", 2, "QA")]),
    ]), ai);
    expect(p.phases[0].tasks.some((x) => x.task === REVIEW)).toBe(false);
    expect(p.phases[1].tasks.at(-1)).toEqual({ task: REVIEW, role: "Frontend", category: "code", hours: 4 }); // 0.15 x 28 = 4.2
    expect(p.phases[2].tasks.at(-1)).toMatchObject({ task: REVIEW, role: "QA", hours: 0.5 }); // 0.15 x 1.5 = 0.225
  });

  it("never makes a tiny code-only phase cost more with agents", () => {
    const s2 = scope([ph(0, 1, [t("code", 2)])]);
    // 2 h -> 1.5 h with agents + 0.5 h review (was a 1 h minimum, so 2.5 h).
    expect(buildPlan(s2, ai).totalHours).toBe(2);
    for (const h of [1, 2, 3, 5]) {
      const s1 = scope([ph(0, 1, [t("code", h)])]);
      expect(buildPlan(s1, ai).totalHours).toBeLessThanOrEqual(buildPlan(s1, trad).totalHours);
    }
    expect(buildPlan(scope([ph(0, 1, [t("code", 3)])]), ai).totalHours).toBe(2.5); // 2 + 0.5 review, cheaper than 3
  });

  it("builds both modes from one scope: same tasks, only agent work reduced, plus review tasks", () => {
    const a = buildPlan(sampleScope, trad);
    const b = buildPlan(sampleScope, ai);
    a.phases.forEach((p, i) => {
      const bTasks = b.phases[i].tasks.filter((x) => x.task !== REVIEW);
      expect(bTasks.map(({ task, role, category }) => [task, role, category])).toEqual(p.tasks.map(({ task, role, category }) => [task, role, category]));
      p.tasks.forEach((x, j) => expect(bTasks[j].hours).toBe(AGENT_FRIENDLY.includes(x.category) ? Math.round(x.hours * 0.7 * 2) / 2 : x.hours));
    });
    expect(b.totalHours).toBeLessThan(a.totalHours);
    expect(a.phases.flatMap((p) => p.tasks).some((x) => x.task === REVIEW)).toBe(false);
  });

  it("adds the AI assumption and review risk only with agents, and the separation-of-duties risk for 1 or 2 people", () => {
    const c = estimatorCopy.aiPlan;
    expect(buildPlan(sampleScope, trad).risks).not.toContain(c.reviewRisk);
    expect(buildPlan(sampleScope, trad).assumptions).not.toContain(c.assumption);
    expect(buildPlan(sampleScope, ai).risks).toContain(c.reviewRisk);
    expect(buildPlan(sampleScope, ai).risks).not.toContain(c.soloRisk);
    expect(buildPlan(sampleScope, { ...ai, teamSize: 2 }).risks).toContain(c.soloRisk);
    const full = scope(sampleScope.phases, { assumptions: Array(6).fill("a"), risks: Array(6).fill("r") });
    expect(buildPlan(full, { ...ai, teamSize: 1 }).risks).toHaveLength(6);
    expect(buildPlan(full, ai).assumptions).toHaveLength(6);
  });
});

describe("buildPlan effort range", () => {
  it.each([[4, "high"], [2, "medium"], [0, "low"]] as const)("traditional with %i facts spreads around likely by the %s band", (n, level) => {
    const p = buildPlan(scope([ph(0, 5, [t("code", 100)])], { facts: facts(n) }), trad);
    expect(p.effort).toEqual({ best: Math.round(100 * CONFIDENCE_SPREAD[level].best), likely: 100, worst: Math.round(100 * CONFIDENCE_SPREAD[level].worst) });
    expect(p.effort.likely).toBe(p.totalHours);
  });

  it("with agents, best and worst also use the AI band's best and worst factors", () => {
    const p = buildPlan(scope([ph(0, 5, [t("code", 100), t("uat", 20)])]), ai);
    // likely 70 + 20 + review 10.5; best (60 + 20 + 9) x 0.85; worst (80 + 20 + 12) x 1.3
    expect(p.effort).toEqual({ likely: 100.5, best: Math.round(89 * 0.85), worst: Math.round(112 * 1.3) });
  });
});

describe("buildPlan calendar", () => {
  it("is deterministic: the same scope and inputs give an identical plan", () => {
    expect(buildPlan(sampleScope, ai)).toEqual(buildPlan(structuredClone(sampleScope), ai));
  });

  it("keeps the model's calendar when it covers the hours, unflagged", () => {
    const p = buildPlan(scope([ph(0, 5, [t("code", 20), t("code", 20)]), ph(5, 5, [t("tests", 20), t("tests", 20)])]), { ...trad, teamSize: 2 });
    expect(p.phases.map((x) => [x.startDay, x.durationDays])).toEqual([[0, 5], [5, 5]]);
    expect(p.totalDays).toBe(10);
    expect("calendarAdjusted" in p).toBe(false);
  });

  it("stretches a phase to its hours / (min(team, tasks) x 6), keeps back to back, and flags it", () => {
    const p = buildPlan(scope([ph(0, 2, [t("code", 60), t("code", 60)]), ph(2, 2, [t("tests", 30)]), ph(4, 1, [t("release", 3)])]), trad);
    // 120 h by 2 people = 10 days; 30 h by 1 person = 5 days; 3 h stays at the model's 1 day.
    expect(p.phases.map((x) => [x.startDay, x.durationDays])).toEqual([[0, 10], [10, 5], [15, 1]]);
    expect(p.calendarAdjusted).toBe(true);
    expect(p.calendarWeeks).toBe(3.2);
  });

  it("keeps an overlap at the same fraction of the stretched predecessor, and keeps gaps", () => {
    const p = buildPlan(scope([ph(0, 4, [t("code", 48)]), ph(2, 4, [t("tests", 12)]), ph(8, 1, [t("release", 2)])]), trad);
    // Phase 1: 48 h / 6 = 8 days; phase 2 started halfway into it, so day 4; phase 3 kept its 2-day gap.
    expect(p.phases.map((x) => [x.startDay, x.durationDays])).toEqual([[0, 8], [4, 4], [10, 1]]);
  });

  it("runs a solo team's phases in sequence even when the model overlapped them", () => {
    const p = buildPlan(scope([ph(0, 4, [t("code", 12)]), ph(1, 4, [t("tests", 12)]), ph(2, 2, [t("release", 6)])]), { ...trad, teamSize: 1 });
    expect(p.phases.map((x) => [x.startDay, x.durationDays])).toEqual([[0, 4], [4, 4], [8, 2]]);
    expect(p.totalDays).toBeGreaterThanOrEqual(p.totalHours / HOURS_PER_DAY);
  });

  it("stretches overlapping phases that need more people than the team has", () => {
    const p = buildPlan(scope([ph(0, 5, [t("code", 30), t("code", 30)]), ph(0, 5, [t("tests", 30), t("tests", 30)])]), { ...trad, teamSize: 2 });
    // Each phase fits 2 people in 5 days, but running both at once needs 4: 120 h / 12 h = 10 days.
    expect(p.totalDays).toBe(10);
    expect(p.calendarAdjusted).toBe(true);
  });

  it("scales each phase's model days by its adjusted ÷ base hours, unflagged", () => {
    const s2 = scope([ph(0, 10, [t("code", 60), t("code", 60)]), ph(10, 2, [t("uat", 12)])]);
    // Junior: 156 / 120 x 10 = 13 days. Senior: 102 / 120 x 10 = 8.5. With agents: (42 + 42 + 12.5) / 120 x 10 = 8.04 -> 8.5.
    expect(buildPlan(s2, { ...trad, seniority: "junior" }).phases.map((x) => [x.startDay, x.durationDays])).toEqual([[0, 13], [13, 3]]); // uat 15.5 / 12 x 2 = 2.6 -> 3
    expect(buildPlan(s2, { ...trad, seniority: "senior" }).phases.map((x) => [x.startDay, x.durationDays])).toEqual([[0, 8.5], [8.5, 2]]);
    const a = buildPlan(s2, ai);
    expect(a.phases.map((x) => [x.startDay, x.durationDays])).toEqual([[0, 8.5], [8.5, 2]]);
    expect("calendarAdjusted" in a).toBe(false);
  });

  it("example scope: fewer weeks with agents, more with juniors, at every team size", () => {
    for (const teamSize of [1, 2, 4, 8]) {
      const w = (seniority: "junior" | "senior" | "mixed", mode: "traditional" | "ai-assisted") => buildPlan(sampleScope, { teamSize, seniority, mode }).calendarWeeks;
      for (const sen of ["junior", "senior", "mixed"] as const) expect(w(sen, "ai-assisted")).toBeLessThanOrEqual(w(sen, "traditional"));
      for (const mode of ["traditional", "ai-assisted"] as const) expect(w("junior", mode)).toBeGreaterThanOrEqual(w("senior", mode));
    }
    expect(buildPlan(sampleScope, { teamSize: 4, seniority: "mixed", mode: "ai-assisted" }).calendarWeeks).toBe(2.5);
  });

  it("gives the example plan its documented numbers", () => {
    const p = buildPlan(sampleScope, { teamSize: 4, seniority: "mixed", mode: "traditional" });
    expect([p.totalHours, p.totalDays, p.calendarWeeks, p.confidence]).toEqual([112, 13, 2.6, "medium"]);
    expect(p.effort).toEqual({ best: 95, likely: 112, worst: 146 });
  });
});

describe("effort range order", () => {
  const scopes = [sampleScope, scope([ph(0, 3, [t("code", 2), t("discovery", 4)]), ph(3, 5, [t("tests", 40), t("docs-config", 3), t("release", 6)])])];
  it("best <= likely <= worst for every seniority, mode and confidence", () => {
    for (const s of scopes)
      for (const n of [0, 2, 4])
        for (const seniority of ["junior", "mid", "senior", "mixed"] as const)
          for (const mode of ["traditional", "ai-assisted"] as const) {
            const e = buildPlan({ ...s, facts: facts(n) }, { teamSize: 3, seniority, mode }).effort;
            expect(e.best).toBeLessThanOrEqual(e.likely);
            expect(e.likely).toBeLessThanOrEqual(e.worst);
          }
  });
});

describe("compareModes", () => {
  it("builds the same scope both ways with the team, each with its own budget", () => {
    const team = { size: 4, seniority: "mixed", mode: "ai-assisted" } as const;
    const c = compareModes(sampleScope, team);
    for (const mode of ["traditional", "ai-assisted"] as const) {
      const plan = buildPlan(sampleScope, { teamSize: 4, seniority: "mixed", mode });
      expect(c[mode]).toEqual({ plan, budget: budget(plan, { ...team, mode }) });
    }
    expect(c.traditional.budget.seats).toBeNull();
    expect(c["ai-assisted"].plan.totalHours).toBeLessThan(c.traditional.plan.totalHours);
  });
});
