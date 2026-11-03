import type { Plan } from "@/lib/estimate";

/**
 * Tab 1 of the results: summary row, timeline chart, phase cards, assumptions and risks.
 * Spec: docs/03-estimator-spec.md → "Tab 1". Use toBars() and weekMarkers() from lib/timeline.ts.
 *
 * TODO(M2, ui-builder): replace this plain rendering with the designed version.
 */
export function PhaseTimeline({ plan, teamLabel }: { plan: Plan; teamLabel: string }) {
  return (
    <div className="results-phases">
      <p>
        {plan.totalHours} effort hours · about {plan.calendarWeeks} weeks · {teamLabel} · {plan.confidence} confidence
      </p>
      <ol>
        {plan.phases.map((ph) => (
          <li key={ph.name}>
            <strong>{ph.name}</strong> (day {ph.startDay + 1}, {ph.durationDays} days): {ph.goal}
          </li>
        ))}
      </ol>
      {plan.assumptions.length > 0 && (
        <>
          <h4>Assumptions</h4>
          <ul>{plan.assumptions.map((a) => <li key={a}>{a}</li>)}</ul>
        </>
      )}
      {plan.risks.length > 0 && (
        <>
          <h4>Risks</h4>
          <ul>{plan.risks.map((r) => <li key={r}>{r}</li>)}</ul>
        </>
      )}
    </div>
  );
}
