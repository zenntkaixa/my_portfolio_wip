import type { Plan } from "@/lib/estimate";
import type { Budget, Range, Team } from "@/lib/budget";
import { estimatorCopy, profile } from "@/lib/content";

const rm = (n: number) => `RM ${n.toLocaleString("en-MY")}`;
const range = (r: Range) => (r.low === r.high ? rm(r.low) : `${rm(r.low)}–${r.high.toLocaleString("en-MY")}`);

/** The plan as readable plain text for the clipboard. `team` is omitted when unknown. */
export function planToText(plan: Plan, team: Team | undefined, b: Budget): string {
  const a = estimatorCopy.actions;
  const c = estimatorCopy.budget;
  const list = (heading: string, items?: string[]) =>
    items?.length ? ["", heading, ...items.map((i) => `- ${i}`)] : [];
  const lines = [plan.title, "", plan.summary];
  if (team) lines.push("", `${a.team}: ${estimatorCopy.people(team.size)}, ${team.seniority}`);
  for (const p of plan.phases) {
    lines.push("", `${p.name} (${a.days(p.startDay, p.startDay + p.durationDays - 1)})`);
    for (const t of p.tasks) lines.push(`- ${t.task} — ${t.role} — ${t.hours} h`);
  }
  lines.push("", a.totals(plan.totalHours, plan.calendarWeeks), "", estimatorCopy.tabBudget);
  lines.push(`${c.people}: ${rm(b.people)}`);
  if (b.seats) lines.push(`${c.seats}: ${range(b.seats)}`);
  for (const x of plan.costs.filter((x) => x.kind === "one-off")) lines.push(`${x.item}: ${range(x)}`);
  lines.push(`${c.contingency}: ${rm(b.contingency)}`, `${c.buildTotal}: ${range(b.build)}`);
  for (const x of plan.costs.filter((x) => x.kind === "monthly")) lines.push(`${x.item}: ${range(x)}`);
  lines.push(`${c.monthlyTotal}: ${range(b.monthly)}`);
  lines.push(
    ...list(estimatorCopy.assumptionsHeading, plan.assumptions),
    ...list(estimatorCopy.risksHeading, plan.risks),
    ...list(estimatorCopy.questionsHeading, plan.openQuestions),
    ...list(estimatorCopy.outOfScopeHeading, plan.outOfScope),
    "",
    a.footer(profile.name),
  );
  return lines.join("\n");
}
