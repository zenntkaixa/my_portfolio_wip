import type { Scope } from "@/lib/estimate";
import type { Team } from "@/lib/budget";
import { compareModes } from "@/lib/estimateCompare";
import { estimatorCopy } from "@/lib/content";
import { range } from "./money";
import { CompareBars } from "./BudgetChart";

/** Same scope built both ways (traditional and with AI agents); nothing is requested again. */
export function ModeComparison({ scope, team }: { scope: Scope; team: Team }) {
  const k = estimatorCopy.compare;
  const both = compareModes(scope, team);
  const cols = [
    { mode: "traditional", label: k.traditional },
    { mode: "ai-assisted", label: k.ai },
  ] as const;
  const cur = (m: string) => (m === team.mode ? "cmp-current" : undefined);
  return (
    <section aria-labelledby="cmp-heading" className="cmp">
      <h4 id="cmp-heading">{k.heading}</h4>
      <CompareBars trad={both.traditional.budget.build} ai={both["ai-assisted"].budget.build} />
      <table className="cmp-table" data-testid="compare">
        <caption className="sr-only">{k.caption}</caption>
        <thead>
          <tr>
            <th scope="col">{k.row}</th>
            {cols.map((c) => (
              <th key={c.mode} scope="col" className={cur(c.mode)} data-mode={c.mode}>
                {c.label}
                {c.mode === team.mode && <span className="pill pill--current cmp-tag">{k.current}</span>}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          <tr>
            <th scope="row">{k.effort}</th>
            {cols.map((c) => {
              const e = both[c.mode].plan.effort;
              return (
                <td key={c.mode} className={cur(c.mode)}>
                  {estimatorCopy.summary.hoursValue(e.likely)}
                  <span className="tab3-detail">{estimatorCopy.summary.rangeNote(e.best, e.worst)}</span>
                </td>
              );
            })}
          </tr>
          <tr>
            <th scope="row">{k.calendar}</th>
            {cols.map((c) => (
              <td key={c.mode} className={cur(c.mode)}>{estimatorCopy.summary.weeksValue(both[c.mode].plan.calendarWeeks)}</td>
            ))}
          </tr>
          <tr>
            <th scope="row">{k.people}</th>
            {cols.map((c) => (
              <td key={c.mode} className={cur(c.mode)}>{range(both[c.mode].budget.peopleRange)}</td>
            ))}
          </tr>
          <tr>
            <th scope="row">{k.seats}</th>
            {cols.map((c) => {
              const s = both[c.mode].budget.seats;
              return <td key={c.mode} className={cur(c.mode)}>{s ? range(s) : k.noSeats}</td>;
            })}
          </tr>
          <tr>
            <th scope="row">{k.build}</th>
            {cols.map((c) => (
              <td key={c.mode} className={cur(c.mode)}>{range(both[c.mode].budget.build)}</td>
            ))}
          </tr>
        </tbody>
      </table>
    </section>
  );
}
