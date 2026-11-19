import type { Plan } from "@/lib/estimate";
import { budget, HOURLY_RATE, SEAT, type Range, type Team } from "@/lib/budget";
import { estimatorCopy } from "@/lib/content";

// The no-break space keeps "RM" with its number; a range can still wrap after its dash on narrow screens.
const rm = (n: number) => `RM\u00a0${n.toLocaleString("en-MY")}`;
const range = (r: Range) => (r.low === r.high ? rm(r.low) : `${rm(r.low)}–${r.high.toLocaleString("en-MY")}`);

/**
 * Tab 3 of the results: people cost and seats calculated in lib/budget.ts, plus the model's tool and
 * running cost ranges. Spec: docs/03-estimator-spec.md → "Tab 3".
 */
export function BudgetView({ plan, team }: { plan: Plan; team: Team }) {
  const c = estimatorCopy.budget;
  const b = budget(plan, team);
  const oneOff = plan.costs.filter((x) => x.kind === "one-off");
  const monthly = plan.costs.filter((x) => x.kind === "monthly");
  return (
    <div className="tab2">
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
                <span className="tab3-detail">{c.peopleDetail(plan.totalHours, b.rate, team.seniority)}</span>
              </td>
              <td>{rm(b.people)}</td>
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
              <td>{c.contingency}</td>
              <td>{rm(b.contingency)}</td>
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
      <p className="tab3-note">{c.seniorityNote}</p>
      <p className="tab3-note">{c.rateNote(HOURLY_RATE)}</p>
      <p className="tab3-note">{c.note}</p>
    </div>
  );
}
