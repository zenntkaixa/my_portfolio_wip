// The deterministic effort model (ADR-013): the model describes the work once (a Scope), and this code
// applies seniority, the AI band, review time, confidence and the calendar. Same scope and inputs, same plan.
import type { Category, Confidence, Fact, Mode, Phase, Plan, Scope, Seniority, Task } from "@/lib/estimate";
import { estimatorCopy } from "@/lib/content";

/** Productive hours one person delivers in a working day; the calendar and the prompt both use it. */
export const HOURS_PER_DAY = 6;

/** Multiplier on mid-level hours. Mixed is a 1 senior : 2 mid : 1 junior blend, about mid. */
export const SENIORITY_FACTOR: Record<Seniority, number> = { junior: 1.3, mid: 1, senior: 0.85, mixed: 1 };

/** Work AI coding agents do well. Every other category keeps its hours. */
export const AGENT_FRIENDLY: readonly Category[] = ["code", "tests", "docs-config"];

/** Effort factor on agent-friendly tasks with AI agents: 20 to 40% less, 30% likely. */
export const AI_FACTOR = { best: 0.6, likely: 0.7, worst: 0.8 } as const;

/** Human review added per phase with agent work, as a share of that phase's agent-friendly hours. */
export const REVIEW_SHARE = 0.15;

/** Effort range around the likely total, wider the more the description left open. */
export const CONFIDENCE_SPREAD: Record<Confidence, { best: number; worst: number }> = {
  high: { best: 0.9, worst: 1.15 },
  medium: { best: 0.85, worst: 1.3 },
  low: { best: 0.8, worst: 1.5 },
};

export type BuildInputs = { teamSize: number; seniority: Seniority; mode: Mode };

/** Five or six stated facts is high, three or four medium, two or fewer low (review round 2: a one-line brief must not score high). */
export function confidenceFor(facts: Record<Fact, boolean>): Confidence {
  const n = Object.values(facts).filter(Boolean).length;
  return n >= 5 ? "high" : n >= 3 ? "medium" : "low";
}

const half = (n: number) => Math.max(0.5, Math.round(n * 2) / 2);
// Rounds up to the next half day, so a calendar never lands below the capacity minimum.
const ceilHalf = (n: number) => Math.max(0, Math.ceil(n * 2 - 1e-9) / 2); // max(0) turns -0 into 0
const hoursOf = (tasks: Task[]) => tasks.reduce((s, t) => s + t.hours, 0);

/** One phase's tasks for a seniority and an AI factor (null = traditional), plus its review task. */
function phaseTasks(tasks: Scope["phases"][number]["tasks"], seniority: Seniority, ai: number | null): Task[] {
  const out: Task[] = tasks.map((t) => ({
    task: t.task,
    role: t.role,
    category: t.category,
    hours: half(t.baseHours * SENIORITY_FACTOR[seniority] * (ai !== null && AGENT_FRIENDLY.includes(t.category) ? ai : 1)),
  }));
  const agentHours = hoursOf(out.filter((t) => AGENT_FRIENDLY.includes(t.category)));
  if (ai === null || agentHours === 0) return out;
  const byRole = new Map<string, number>();
  for (const t of out) byRole.set(t.role, (byRole.get(t.role) ?? 0) + t.hours);
  // Most hours wins; ties go to the role that appears first.
  const role = [...byRole].reduce((a, b) => (b[1] > a[1] ? b : a))[0];
  const tradAgentHours = tasks
    .filter((t) => AGENT_FRIENDLY.includes(t.category))
    .reduce((s, t) => s + half(t.baseHours * SENIORITY_FACTOR[seniority]), 0);
  // At least 0.5 h, but never more than the agents saved, so a phase never costs more with AI than without.
  const hours = Math.min(half(agentHours * REVIEW_SHARE), tradAgentHours - agentHours);
  if (hours <= 0) return out;
  return [...out, { task: estimatorCopy.aiPlan.reviewTask, role, category: "code", hours, addedByCode: true }];
}

const totalFor = (scope: Scope, seniority: Seniority, ai: number | null) =>
  scope.phases.reduce((s, p) => s + hoursOf(phaseTasks(p.tasks, seniority, ai)), 0);

/**
 * Lay phases out in the model's order. Each phase lasts its proposed days scaled by its adjusted hours ÷
 * base hours (so seniority and AI move the calendar), or with `capacity` the days its hours need
 * (people = min(team, tasks), HOURS_PER_DAY each) if longer. A phase that started after its predecessor
 * ended keeps that gap (back to back stays back to back); one that overlapped starts at the same fraction
 * into it. With `capacity`, solo teams run phases in sequence; without it this is the scaled shape.
 */
function layout(scope: Scope, phases: Phase[], teamSize: number, capacity: boolean): Phase[] {
  const out: Phase[] = [];
  phases.forEach((p, i) => {
    const m = scope.phases[i];
    const base = m.tasks.reduce((s, t) => s + t.baseHours, 0);
    const scaled = base > 0 ? Math.max(0.5, ceilHalf((m.durationDays * hoursOf(p.tasks)) / base)) : m.durationDays;
    const people = Math.max(1, Math.min(teamSize, p.tasks.length));
    const durationDays = capacity ? Math.max(scaled, ceilHalf(hoursOf(p.tasks) / (people * HOURS_PER_DAY))) : scaled;
    let startDay = 0;
    if (i > 0) {
      const mp = scope.phases[i - 1];
      const prev = out[i - 1];
      const prevEnd = prev.startDay + prev.durationDays;
      const gap = m.startDay - (mp.startDay + mp.durationDays);
      if (capacity && teamSize === 1) startDay = Math.max(...out.map((o) => o.startDay + o.durationDays));
      else if (gap >= 0) startDay = prevEnd + gap;
      else startDay = prev.startDay + ceilHalf((Math.max(0, m.startDay - mp.startDay) / mp.durationDays) * prev.durationDays);
    }
    out.push({ ...p, startDay, durationDays });
  });
  return out;
}

const endOf = (phases: { startDay: number; durationDays: number }[]) => Math.max(...phases.map((p) => p.startDay + p.durationDays));

/** Scope + team → plan. Pure and deterministic; the server (event logging) and the client (display) share it. */
export function buildPlan(scope: Scope, { teamSize, seniority, mode }: BuildInputs): Plan {
  const ai = mode === "ai-assisted";
  const built = scope.phases.map((p) => ({ name: p.name, goal: p.goal, startDay: p.startDay, durationDays: p.durationDays, tasks: phaseTasks(p.tasks, seniority, ai ? AI_FACTOR.likely : null) }));
  let phases = layout(scope, built, teamSize, true);
  // The model's shape scaled to these hours: calendarAdjusted means team capacity alone made it longer.
  const shapeDays = endOf(layout(scope, built, teamSize, false));
  const totalHours = phases.reduce((s, p) => s + hoursOf(p.tasks), 0);
  let totalDays = endOf(phases);
  // Overlapping phases can still ask for more people than the team has: stretch everything by one factor.
  const minDays = totalHours / (Math.max(1, teamSize) * HOURS_PER_DAY);
  if (totalDays < minDays) {
    const factor = minDays / totalDays;
    // Round start and end (not duration) so back-to-back phases stay back to back.
    phases = phases.map((p) => {
      const startDay = ceilHalf(p.startDay * factor);
      return { ...p, startDay, durationDays: ceilHalf((p.startDay + p.durationDays) * factor) - startDay };
    });
    totalDays = endOf(phases);
  }
  const confidence = confidenceFor(scope.facts);
  const spread = CONFIDENCE_SPREAD[confidence];
  const copy = estimatorCopy.aiPlan;
  const aiRisks = ai ? [copy.reviewRisk, ...(teamSize <= 2 ? [copy.soloRisk] : [])] : [];

  return {
    title: scope.title,
    summary: scope.summary,
    assumptions: ai ? [...scope.assumptions.slice(0, 5), copy.assumption] : scope.assumptions,
    phases,
    risks: [...scope.risks.slice(0, 6 - aiRisks.length), ...aiRisks],
    confidence,
    missingFacts: (Object.keys(scope.facts) as Fact[]).filter((f) => !scope.facts[f]),
    effort: {
      best: Math.round(spread.best * (ai ? totalFor(scope, seniority, AI_FACTOR.best) : totalHours)),
      likely: totalHours,
      worst: Math.round(spread.worst * (ai ? totalFor(scope, seniority, AI_FACTOR.worst) : totalHours)),
    },
    costs: scope.costs,
    openQuestions: scope.openQuestions,
    outOfScope: scope.outOfScope,
    // Task hours are in 0.5 steps, so the sum is exact and equals the subtotals the UI shows.
    totalHours,
    totalDays,
    calendarWeeks: Math.max(1, Math.round((totalDays / 5) * 10) / 10),
    ...(totalDays > shapeDays ? { calendarAdjusted: true as const } : {}),
  };
}
