import { MODES, type Mode, type Plan, type Scope } from "@/lib/estimate";
import { buildPlan } from "@/lib/estimateModel";
import { budget, type Budget, type Team } from "@/lib/budget";

/** The same scope built both ways for the team's size and seniority; no new request (ADR-013). */
export function compareModes(scope: Scope, team: Team): Record<Mode, { plan: Plan; budget: Budget }> {
  const one = (mode: Mode) => {
    const plan = buildPlan(scope, { teamSize: team.size, seniority: team.seniority, mode });
    return { plan, budget: budget(plan, { ...team, mode }) };
  };
  return Object.fromEntries(MODES.map((m) => [m, one(m)])) as Record<Mode, { plan: Plan; budget: Budget }>;
}
