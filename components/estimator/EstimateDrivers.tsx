import type { Plan, Seniority, Mode } from "@/lib/estimate";
import { CONFIDENCE_SPREAD, AI_FACTOR, HOURS_PER_DAY, REVIEW_SHARE, SENIORITY_FACTOR } from "@/lib/estimateModel";
import { CONTINGENCY } from "@/lib/budget";
import { estimatorCopy } from "@/lib/content";

const pct = (n: number) => Math.round(n * 100);

/** Every factor the code applied to this plan, built from the constants so the copy can't drift from the maths. */
export function EstimateDrivers({ plan, seniority, mode }: { plan: Plan; seniority: Seniority; mode: Mode }) {
  const d = estimatorCopy.drivers;
  const spread = CONFIDENCE_SPREAD[plan.confidence];
  const lines = [
    d.seniority(seniority, SENIORITY_FACTOR[seniority]),
    ...(mode === "ai-assisted" ? [d.ai(pct(1 - AI_FACTOR.worst), pct(1 - AI_FACTOR.best), pct(1 - AI_FACTOR.likely), pct(REVIEW_SHARE))] : []),
    d.spread(spread.best, spread.worst, plan.confidence),
    d.contingency(pct(CONTINGENCY[plan.confidence])),
    d.capacity(HOURS_PER_DAY),
  ];
  return (
    <details className="drivers">
      <summary>{d.heading}</summary>
      <p className="tab3-note">{d.intro}</p>
      <ul role="list" className="tab1-list">
        {lines.map((l) => (
          <li key={l}>{l}</li>
        ))}
      </ul>
    </details>
  );
}
