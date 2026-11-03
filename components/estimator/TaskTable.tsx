import type { Plan } from "@/lib/estimate";

/**
 * Tab 2 of the results: role total chips and a task table grouped by phase.
 * Spec: docs/03-estimator-spec.md → "Tab 2". Use roleTotals() from lib/timeline.ts.
 *
 * TODO(M2, ui-builder): role chips, phase subtotal rows, horizontal scroll container on mobile.
 */
export function TaskTable({ plan }: { plan: Plan }) {
  return (
    <div className="results-table">
      <table>
        <caption className="sr-only">Tasks by phase with effort hours</caption>
        <thead>
          <tr>
            <th scope="col">Task</th>
            <th scope="col">Role</th>
            <th scope="col">Hours</th>
          </tr>
        </thead>
        <tbody>
          {plan.phases.flatMap((ph) =>
            ph.tasks.map((t, i) => (
              <tr key={`${ph.name}-${i}`}>
                <td>
                  {ph.name}: {t.task}
                </td>
                <td>{t.role}</td>
                <td>{t.hours}</td>
              </tr>
            )),
          )}
        </tbody>
        <tfoot>
          <tr>
            <th scope="row" colSpan={2}>
              Total
            </th>
            <td>{plan.totalHours}</td>
          </tr>
        </tfoot>
      </table>
    </div>
  );
}
