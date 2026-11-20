import type { Confidence, Mode, Plan, Seniority } from "@/lib/estimate";

/**
 * Assumed in-house cost per hour in MYR, approved by Izzat on 2026-11-17: a mid-range Klang Valley
 * monthly salary x 1.3 (EPF, SOCSO, EIS, equipment and overheads) / 160 working hours.
 * Mixed is the blend of 1 senior, 2 mid and 1 junior: (120 + 2 x 75 + 40) / 4, rounded to 78.
 */
export const HOURLY_RATE: Record<Seniority, number> = { junior: 40, mid: 75, senior: 120, mixed: 78 };

/**
 * Contingency on people cost for rework, sick days and scope wobble; part of the build total. Larger
 * when the description left more open (confidence from lib/estimateModel.ts).
 */
export const CONTINGENCY: Record<Confidence, number> = { high: 0.1, medium: 0.2, low: 0.3 };

/** AI coding agent seat per engineer per month in MYR: a standard business seat to a premium one. */
export const SEAT = { low: 80, high: 400 };

export type Range = { low: number; high: number };
export type Team = { size: number; seniority: Seniority; mode: Mode };
export type Budget = {
  rate: number;
  /** Likely effort x rate. */
  people: number;
  /** Best and worst effort x rate (plan.effort); the build range adds the contingency and seats to these. */
  peopleRange: Range;
  /** Share of people cost, from the plan's confidence (0.1, 0.2 or 0.3). */
  contingencyRate: number;
  contingency: number;
  contingencyRange: Range;
  seats: (Range & { count: number; months: number }) | null;
  oneOff: Range;
  monthly: Range;
  build: Range;
};

const sum = (items: Range[]): Range =>
  items.reduce((a, c) => ({ low: a.low + c.low, high: a.high + c.high }), { low: 0, high: 0 });

/** People cost and seats are calculated here, never by the model; the model only lists tool costs. */
export function budget(plan: Plan, team: Team): Budget {
  const rate = HOURLY_RATE[team.seniority];
  const people = Math.round(plan.totalHours * rate);
  const contingencyRate = CONTINGENCY[plan.confidence];
  const contingency = Math.round(people * contingencyRate);
  const peopleRange = { low: Math.round(plan.effort.best * rate), high: Math.round(plan.effort.worst * rate) };
  const contingencyRange = { low: Math.round(peopleRange.low * contingencyRate), high: Math.round(peopleRange.high * contingencyRate) };
  const months = Math.max(1, Math.ceil(plan.calendarWeeks / 4.33));
  const seats =
    team.mode === "ai-assisted"
      ? { count: team.size, months, low: team.size * months * SEAT.low, high: team.size * months * SEAT.high }
      : null;
  const oneOff = sum(plan.costs.filter((c) => c.kind === "one-off"));
  const monthly = sum(plan.costs.filter((c) => c.kind === "monthly"));
  // Exact: every row of the budget table is an integer and the total is the sum of the rows' lows and highs.
  const build = sum([peopleRange, contingencyRange, seats ?? { low: 0, high: 0 }, oneOff]);
  return { rate, people, peopleRange, contingencyRate, contingency, contingencyRange, seats, oneOff, monthly, build };
}
