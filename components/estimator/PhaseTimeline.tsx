import type { CSSProperties } from "react";
import type { Plan } from "@/lib/estimate";
import { estimatorCopy as copy } from "@/lib/content";
import { toBars, weekMarkers } from "@/lib/timeline";

type Geometry = CSSProperties & Record<`--${string}`, string>;

const pct = (n: number) => `${Number(n.toFixed(3))}%`;

/** Tab 1 of the results: summary row, timeline chart, phase cards, assumptions and risks. */
export function PhaseTimeline({ plan, teamLabel }: { plan: Plan; teamLabel: string }) {
  const bars = toBars(plan.phases, plan.totalDays);
  const markers = weekMarkers(plan.totalDays);

  return (
    <div className="results-phases">
      <dl className="tab1-summary" data-testid="summary">
        <div>
          <dt>{copy.summary.hours}</dt>
          <dd>{copy.summary.hoursValue(plan.totalHours)}</dd>
        </div>
        <div>
          <dt>{copy.summary.weeks}</dt>
          <dd>{copy.summary.weeksValue(plan.calendarWeeks)}</dd>
        </div>
        <div>
          <dt>{copy.summary.team}</dt>
          <dd>{teamLabel}</dd>
        </div>
        <div>
          <dt>{copy.summary.confidence}</dt>
          <dd>
            <span className={`tab1-badge tab1-badge--${plan.confidence}`}>{plan.confidence}</span>
          </dd>
        </div>
      </dl>

      {bars.length > 0 && (
        <ol className="tab1-timeline" role="list" aria-label={copy.timelineLabel(plan.totalDays)}>
          {bars.map((b, i) => (
            <li key={`${i}-${b.name}`} className="tab1-row">
              <div className="tab1-row__head">
                <span className="tab1-row__name">{b.name}</span>
                <span className="tab1-row__label">{b.label}</span>
              </div>
              <div className="tab1-track">
                <span className="tab1-weeks" aria-hidden="true">
                  {markers.map((m) => (
                    <i key={m} style={{ "--left": pct(m) } as Geometry} />
                  ))}
                </span>
                <span
                  className="tab1-bar"
                  data-testid="timeline-bar"
                  style={{ "--left": pct(b.leftPct), "--width": pct(b.widthPct) } as Geometry}
                />
              </div>
            </li>
          ))}
        </ol>
      )}

      <ul className="tab1-cards" role="list">
        {plan.phases.map((ph, i) => (
          <li key={`${i}-${ph.name}`} className="tab1-card" data-testid="phase-card">
            <h4>{ph.name}</h4>
            <p>{ph.goal}</p>
            <p className="tab1-card__meta">
              <span>{copy.duration(ph.durationDays)}</span>
              <span>{copy.taskCount(ph.tasks.length)}</span>
            </p>
          </li>
        ))}
      </ul>

      {(plan.assumptions.length > 0 || plan.risks.length > 0) && (
        <div className="tab1-lists">
          {plan.assumptions.length > 0 && (
            <section aria-labelledby="tab1-assumptions">
              <h4 id="tab1-assumptions">{copy.assumptionsHeading}</h4>
              <ul role="list" className="tab1-list">
                {plan.assumptions.map((a, i) => (
                  <li key={`${i}-${a}`}>{a}</li>
                ))}
              </ul>
            </section>
          )}
          {plan.risks.length > 0 && (
            <section aria-labelledby="tab1-risks">
              <h4 id="tab1-risks">{copy.risksHeading}</h4>
              <ul role="list" className="tab1-list tab1-list--risks">
                {plan.risks.map((r, i) => (
                  <li key={`${i}-${r}`}>{r}</li>
                ))}
              </ul>
            </section>
          )}
        </div>
      )}
    </div>
  );
}
