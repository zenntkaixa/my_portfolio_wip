import type { CSSProperties } from "react";
import type { Plan } from "@/lib/estimate";
import { estimatorCopy as copy } from "@/lib/content";
import { missingText } from "@/lib/planText";
import { toBars, weekLabels, weekMarkers } from "@/lib/timeline";

type Geometry = CSSProperties & Record<`--${string}`, string>;

const pct = (n: number) => `${Number(n.toFixed(3))}%`;

/** Tab 1 of the results: summary row, timeline chart, phase cards, assumptions and risks. */
export function PhaseTimeline({ plan, teamLabel, teamSize }: { plan: Plan; teamLabel: string; teamSize: number }) {
  const bars = toBars(plan.phases, plan.totalDays);
  const markers = weekMarkers(plan.totalDays);
  const weeks = weekLabels(plan.totalDays);
  const questions = plan.openQuestions ?? [];
  const outOfScope = plan.outOfScope ?? [];

  return (
    <div className="results-phases">
      <dl className="tab1-summary" data-testid="summary">
        <div>
          <dt>{copy.summary.hours}</dt>
          <dd>{copy.summary.hoursValue(plan.totalHours)}</dd>
          <dd className="tab1-hint">
            {copy.summary.rangeNote(plan.effort.best, plan.effort.worst)}. {copy.summary.hints.hours}
          </dd>
        </div>
        <div>
          <dt>{copy.summary.weeks}</dt>
          <dd>{copy.summary.weeksValue(plan.calendarWeeks)}</dd>
          <dd className="tab1-hint">{copy.summary.hints.weeks}</dd>
        </div>
        <div>
          <dt>{copy.summary.team}</dt>
          <dd>{teamLabel}</dd>
          <dd className="tab1-hint">{copy.summary.hints.team}</dd>
        </div>
        <div>
          <dt>{copy.summary.confidence}</dt>
          <dd>
            <span className={`tab1-badge tab1-badge--${plan.confidence}`}>{plan.confidence}</span>
          </dd>
          <dd className="tab1-hint">{copy.summary.hints.confidence[plan.confidence]}</dd>
          <dd className="tab1-hint" data-testid="missing-facts">{missingText(plan)}</dd>
        </div>
      </dl>
      {plan.calendarAdjusted && <p className="tab3-note">{copy.calendarAdjusted(teamSize)}</p>}

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
      {/* Visual axis only: each row already says its days, and the summary gives calendar weeks. */}
      {bars.length > 0 && weeks.length > 0 && (
        <div className="tab1-axis" aria-hidden="true" data-testid="week-axis">
          {weeks.map((w) => (
            <span key={w.week} style={{ "--left": pct(w.centerPct) } as Geometry}>
              {copy.weekLabel(w.week)}
            </span>
          ))}
        </div>
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

      {(plan.assumptions.length > 0 || plan.risks.length > 0 || questions.length > 0 || outOfScope.length > 0) && (
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
          {questions.length > 0 && (
            <section aria-labelledby="tab1-questions">
              <h4 id="tab1-questions">{copy.questionsHeading}</h4>
              <ul role="list" className="tab1-list">
                {questions.map((x, i) => (
                  <li key={`${i}-${x}`}>{x}</li>
                ))}
              </ul>
            </section>
          )}
          {outOfScope.length > 0 && (
            <section aria-labelledby="tab1-scope">
              <h4 id="tab1-scope">{copy.outOfScopeHeading}</h4>
              <ul role="list" className="tab1-list">
                {outOfScope.map((x, i) => (
                  <li key={`${i}-${x}`}>{x}</li>
                ))}
              </ul>
            </section>
          )}
        </div>
      )}
    </div>
  );
}
