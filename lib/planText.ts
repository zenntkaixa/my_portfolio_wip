import type { Plan } from "@/lib/estimate";
import type { Budget, Range, Team } from "@/lib/budget";
import type { Scope } from "@/lib/estimate";
import { estimatorCopy, profile } from "@/lib/content";
import { AGENT_FRIENDLY } from "@/lib/estimateModel";
import { compareModes } from "@/lib/estimateCompare";

const rm = (n: number) => `RM ${n.toLocaleString("en-MY")}`;
const range = (r: Range) => (r.low === r.high ? rm(r.low) : `${rm(r.low)}–${r.high.toLocaleString("en-MY")}`);

/** Missing facts as a sentence, or the all-stated line. */
export const missingText = (plan: Plan) =>
  plan.missingFacts.length
    ? estimatorCopy.summary.missing(plan.missingFacts.map((f) => estimatorCopy.factLabels[f]).join(", "))
    : estimatorCopy.summary.allStated;

/** The plan as readable plain text for the clipboard. `team` is omitted when unknown; `scope` adds the comparison. */
export function planToText(plan: Plan, team: Team | undefined, b: Budget, scope?: Scope): string {
  const a = estimatorCopy.actions;
  const c = estimatorCopy.budget;
  const tk = estimatorCopy.tasks;
  const list = (heading: string, items?: string[]) =>
    items?.length ? ["", heading, ...items.map((i) => `- ${i}`)] : [];
  const lines = [plan.title, "", plan.summary];
  if (team) lines.push("", `${a.team}: ${estimatorCopy.people(team.size)}, ${team.seniority}`);
  for (const p of plan.phases) {
    lines.push("", `${p.name} (${a.days(p.startDay, p.startDay + p.durationDays - 1)})`);
    for (const t of p.tasks) {
      const tag = t.addedByCode ? ` [${tk.tagAdded.toLowerCase()}]` : team?.mode === "ai-assisted" && AGENT_FRIENDLY.includes(t.category) ? ` [${tk.tagAi}]` : "";
      lines.push(`- ${t.task} — ${t.role} — ${t.hours} h${tag}`);
    }
  }
  const e = plan.effort;
  lines.push("", a.totals(plan.totalHours, plan.calendarWeeks), estimatorCopy.summary.rangeNote(e.best, e.worst));
  lines.push(`${estimatorCopy.summary.confidence}: ${plan.confidence}. ${missingText(plan)}`, "", estimatorCopy.tabBudget);
  lines.push(`${c.people}: ${range(b.peopleRange)}`);
  if (b.seats) lines.push(`${c.seats}: ${range(b.seats)}`);
  for (const x of plan.costs.filter((x) => x.kind === "one-off")) lines.push(`${x.item}: ${range(x)}`);
  lines.push(`${c.contingency(Math.round(b.contingencyRate * 100))}: ${range(b.contingencyRange)}`, `${c.buildTotal}: ${range(b.build)}`);
  for (const x of plan.costs.filter((x) => x.kind === "monthly")) lines.push(`${x.item}: ${range(x)}`);
  lines.push(`${c.monthlyTotal}: ${range(b.monthly)}`);
  if (scope && team) {
    const k = estimatorCopy.compare;
    const both = compareModes(scope, team);
    lines.push("", k.heading);
    for (const m of ["traditional", "ai-assisted"] as const) {
      const { plan: p, budget: x } = both[m];
      lines.push(`${m === "traditional" ? k.traditional : k.ai}: ${k.hoursRange(p.effort.likely, p.effort.best, p.effort.worst)}, ${estimatorCopy.summary.weeksValue(p.calendarWeeks)}, ${range(x.peopleRange)}`);
    }
  }
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
