import type { Plan, Scope } from "@/lib/estimate";
import { budget, HOURLY_RATE, SEAT, type Team } from "@/lib/budget";
import { estimatorCopy } from "@/lib/content";
import { range } from "./money";
import { ModeComparison } from "./ModeComparison";
import { EstimateDrivers } from "./EstimateDrivers";
import { BuildBar } from "./BudgetChart";

/**
 * Tab 3 of the results: people cost and seats calculated in lib/budget.ts, plus the model's tool and
 * running cost ranges. Spec: docs/03-estimator-spec.md → "Tab 3".
 */
export function BudgetView({ plan, team, scope }: { plan: Plan; team: Team; scope: Scope }) {
  const c = estimatorCopy.budget;
  const b = budget(plan, team);
  const oneOff = plan.costs.filter((x) => x.kind === "one-off");
  const monthly = plan.costs.filter((x) => x.kind === "monthly");
  return (
    <div className="tab2">
      <BuildBar b={b} />
      <div className="tab2-scroll" role="region" aria-label={c.regionLabel} tabIndex={0}>
        <table className="tab2-table tab3-table" data-testid="budget">
          <caption className="sr-only">{c.caption}</caption>
          <thead>
            <tr>
              <th scope="col">{c.item}</th>
              <th scope="col">{c.cost}</th>
            </tr>
          </thead>
          <tbody>
            <tr className="tab2-phase">
              <th scope="colgroup" colSpan={2}>{c.buildGroup}</th>
            </tr>
            <tr>
              <td>
                {c.people}
                <span className="tab3-detail">{c.peopleDetail(plan.effort.likely, b.rate, team.seniority)}</span>
              </td>
              <td>{range(b.peopleRange)}</td>
            </tr>
            {b.seats && (
              <tr>
                <td>
                  {c.seats}
                  <span className="tab3-detail">{c.seatsDetail(b.seats.count, b.seats.months, SEAT.low, SEAT.high)}</span>
                </td>
                <td>{range(b.seats)}</td>
              </tr>
            )}
            {oneOff.map((x, i) => (
              <tr key={`o-${i}`}>
                <td>{x.item}</td>
                <td>{range(x)}</td>
              </tr>
            ))}
            <tr>
              <td>
                {c.contingency(Math.round(b.contingencyRate * 100))}
                <span className="tab3-detail">{c.contingencyWhy}</span>
              </td>
              <td>{range(b.contingencyRange)}</td>
            </tr>
            <tr className="tab2-sub">
              <th scope="row">{c.buildTotal}</th>
              <td>{range(b.build)}</td>
            </tr>
          </tbody>
          <tbody>
            <tr className="tab2-phase">
              <th scope="colgroup" colSpan={2}>{c.monthlyGroup}</th>
            </tr>
            {monthly.length === 0 && (
              <tr>
                <td colSpan={2}>{c.none}</td>
              </tr>
            )}
            {monthly.map((x, i) => (
              <tr key={`m-${i}`}>
                <td>{x.item}</td>
                <td>{range(x)}</td>
              </tr>
            ))}
            <tr className="tab2-sub">
              <th scope="row">{c.monthlyTotal}</th>
              <td>{range(b.monthly)}</td>
            </tr>
          </tbody>
        </table>
      </div>
      <ModeComparison scope={scope} team={team} />
      <EstimateDrivers plan={plan} seniority={team.seniority} mode={team.mode} />
      {/* W4: the three footnotes share one disclosure. */}
      <details className="cost-notes">
        <summary>{c.notesSummary}</summary>
        <p className="tab3-note">{c.seniorityNote}</p>
        <p className="tab3-note">{c.rateNote(HOURLY_RATE)}</p>
        <p className="tab3-note">{c.note}</p>
      </details>
    </div>
  );
}
