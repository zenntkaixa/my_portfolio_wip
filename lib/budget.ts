import type { Mode, Plan, Seniority } from "@/lib/estimate";

/**
 * Assumed in-house cost per hour in MYR, approved by Izzat on 2026-11-17: a mid-range Klang Valley
 * monthly salary x 1.3 (EPF, SOCSO, EIS, equipment and overheads) / 160 working hours.
 */
export const HOURLY_RATE: Record<Seniority, number> = { junior: 40, mid: 75, senior: 120, mixed: 80 };

/** AI coding agent seat per engineer per month in MYR: a standard business seat to a premium one. */
export const SEAT = { low: 80, high: 400 };

export type Range = { low: number; high: number };
export type Team = { size: number; seniority: Seniority; mode: Mode };
export type Budget = {
  rate: number;
  people: number;
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
  const months = Math.max(1, Math.ceil(plan.calendarWeeks / 4.33));
  const seats =
    team.mode === "ai-assisted"
      ? { count: team.size, months, low: team.size * months * SEAT.low, high: team.size * months * SEAT.high }
      : null;
  const oneOff = sum(plan.costs.filter((c) => c.kind === "one-off"));
  const monthly = sum(plan.costs.filter((c) => c.kind === "monthly"));
  const build = sum([{ low: people, high: people }, seats ?? { low: 0, high: 0 }, oneOff]);
  return { rate, people, seats, oneOff, monthly, build };
}
