import { useEffect, useState, type CSSProperties } from "react";
import { FACTS, type Plan } from "@/lib/estimate";
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
  // E9: the four lists start closed on phones (open on wider screens) to keep the results short.
  // Set after mount: the example plan is server-rendered open, and hydration would keep that attribute.
  const [wide, setWide] = useState(true);
  useEffect(() => setWide(window.matchMedia("(min-width: 720px)").matches), []);
  const list = (id: string, heading: string, items: string[], extra = "") =>
    items.length > 0 && (
      <section aria-labelledby={id}>
        <details open={wide}>
          <summary>
            <h4 id={id}>{heading}</h4>
          </summary>
          <ul role="list" className={`tab1-list${extra}`}>
            {items.map((x, i) => (
              <li key={`${i}-${x}`}>{x}</li>
            ))}
          </ul>
        </details>
      </section>
    );

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
            <span className="tab1-dots" aria-hidden="true" data-testid="fact-dots">
              {FACTS.map((f) => (
                <i key={f} data-on={plan.missingFacts.includes(f) ? undefined : ""} title={copy.factLabels[f]} />
              ))}
            </span>
          </dd>
          <dd className="tab1-hint">
            {copy.summary.factCount(Object.keys(copy.factLabels).length - plan.missingFacts.length, Object.keys(copy.factLabels).length)}
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
          {list("tab1-assumptions", copy.assumptionsHeading, plan.assumptions)}
          {list("tab1-risks", copy.risksHeading, plan.risks, " tab1-list--risks")}
          {list("tab1-questions", copy.questionsHeading, questions)}
          {list("tab1-scope", copy.outOfScopeHeading, outOfScope)}
        </div>
      )}
    </div>
  );
}
