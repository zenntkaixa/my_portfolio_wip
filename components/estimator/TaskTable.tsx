import type { Plan } from "@/lib/estimate";
import { estimatorCopy } from "@/lib/content";
import { roleTotals } from "@/lib/timeline";

/**
 * Tab 2 of the results: role total chips and a task table grouped by phase.
 * Spec: docs/03-estimator-spec.md → "Tab 2".
 */
export function TaskTable({ plan }: { plan: Plan }) {
  const c = estimatorCopy.tasks;
  const totals = roleTotals(plan.phases.flatMap((ph) => ph.tasks));
  return (
    <div className="tab2">
      <ul className="chips tab2-chips" role="list" aria-label={c.roleChipsLabel}>
        {totals.map((r) => (
          <li key={r.role}>{c.chip(r.role, r.hours)}</li>
        ))}
      </ul>
      <div className="tab2-scroll" role="region" aria-label={c.regionLabel} tabIndex={0}>
        <table className="tab2-table">
          <caption className="sr-only">{c.caption}</caption>
          <thead>
            <tr>
              <th scope="col">{c.task}</th>
              <th scope="col">{c.role}</th>
              <th scope="col">{c.hours}</th>
            </tr>
          </thead>
          {plan.phases.map((ph, pi) => (
            <tbody key={`${pi}-${ph.name}`} data-testid="phase-body">
              <tr className="tab2-phase">
                <th scope="rowgroup" colSpan={3}>
                  {ph.name}
                </th>
              </tr>
              {ph.tasks.map((t, i) => (
                <tr key={`${pi}-${i}`}>
                  <td>{t.task}</td>
                  <td>{t.role}</td>
                  <td>{t.hours}</td>
                </tr>
              ))}
              <tr className="tab2-sub">
                <th scope="row" colSpan={2}>
                  {c.subtotal}
                </th>
                <td>{ph.tasks.reduce((n, t) => n + t.hours, 0)}</td>
              </tr>
            </tbody>
          ))}
          <tfoot>
            <tr>
              <th scope="row" colSpan={2}>
                {c.total}
              </th>
              <td>{plan.totalHours}</td>
            </tr>
          </tfoot>
        </table>
      </div>
    </div>
  );
}
