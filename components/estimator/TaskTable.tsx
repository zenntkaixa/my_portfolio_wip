import type { Plan } from "@/lib/estimate";
import { RolePill } from "./RolePill";
import { estimatorCopy } from "@/lib/content";
import { AGENT_FRIENDLY } from "@/lib/estimateModel";
import { roleTotals } from "@/lib/timeline";

/**
 * Tab 2 of the results: role total chips and a task table grouped by phase.
 * Spec: docs/03-estimator-spec.md → "Tab 2".
 */
export function TaskTable({ plan, ai = false }: { plan: Plan; ai?: boolean }) {
  const c = estimatorCopy.tasks;
  const totals = roleTotals(plan.phases.flatMap((ph) => ph.tasks));
  return (
    <div className="tab2">
      <ul className="chips tab2-chips" role="list" aria-label={c.roleChipsLabel}>
        {totals.map((r) => (
          <li key={r.role}>
            <span className="role-dot" data-role={r.role} aria-hidden="true" />
            {c.chip(r.role, r.hours)}
          </li>
        ))}
      </ul>
      <div className="tab2-scroll" role="region" aria-label={c.regionLabel} tabIndex={0}>
        <table className="tab2-table">
          <caption className="sr-only">{c.caption}</caption>
          <thead>
            <tr>
              <th scope="col">{c.task}</th>
              <th scope="col" className="tab2-role">{c.role}</th>
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
                  <td>
                    {t.task}
                    {(t.addedByCode || (ai && AGENT_FRIENDLY.includes(t.category))) && (
                      <span className="tab2-tags">
                        {t.addedByCode ? (
                          <span className="pill">
                            {c.tagAdded}
                            <span className="sr-only">, {c.tagAddedHint}</span>
                          </span>
                        ) : (
                          <span className="pill">
                            {c.tagAi}
                            <span className="sr-only">, {c.tagAiHint}</span>
                          </span>
                        )}
                      </span>
                    )}
                    {/* Phones: the Role column is hidden, so the role sits under the task. */}
                    {" "}
                    <span className="tab2-role-line"><RolePill role={t.role} /></span>
                  </td>
                  <td className="tab2-role"><RolePill role={t.role} /></td>
                  <td>{t.hours}</td>
                </tr>
              ))}
              <tr className="tab2-sub">
                <th scope="row">{c.subtotal}</th>
                <td className="tab2-role" />
                <td>{ph.tasks.reduce((n, t) => n + t.hours, 0)}</td>
              </tr>
            </tbody>
          ))}
          <tfoot>
            <tr>
              <th scope="row">{c.total}</th>
              <td className="tab2-role" />
              <td>{plan.totalHours}</td>
            </tr>
          </tfoot>
        </table>
      </div>
    </div>
  );
}
