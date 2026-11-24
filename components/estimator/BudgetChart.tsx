import type { CSSProperties } from "react";
import type { Budget, Range } from "@/lib/budget";
import { estimatorCopy } from "@/lib/content";
import { range } from "./money";

type Geometry = CSSProperties & Record<`--${string}`, string>;
const mid = (r: Range) => (r.low + r.high) / 2;
const pct = (n: number) => `${Number(n.toFixed(3))}%`;

/** G2: the build total as one stacked bar; the legend carries every number, so the bar itself is decorative. */
export function BuildBar({ b }: { b: Budget }) {
  const c = estimatorCopy.budget;
  const parts = [
    { kind: "people", label: c.people, r: b.peopleRange },
    ...(b.seats ? [{ kind: "seats", label: c.seats, r: b.seats as Range }] : []),
    { kind: "tools", label: c.chart.tools, r: b.oneOff },
    { kind: "contingency", label: c.contingency(Math.round(b.contingencyRate * 100)), r: b.contingencyRange },
  ].filter((p) => p.r.high > 0);
  return (
    <figure className="bchart" aria-labelledby="bchart-heading">
      <figcaption id="bchart-heading" className="bchart__heading">
        {c.chart.heading}: {range(b.build)}
      </figcaption>
      <div className="bchart__bar" aria-hidden="true" data-testid="build-bar">
        {parts.map((p) => (
          <span key={p.kind} data-kind={p.kind} style={{ "--grow": String(mid(p.r)) } as Geometry} title={`${p.label}: ${range(p.r)}`} />
        ))}
      </div>
      <ul role="list" className="bchart__legend">
        {parts.map((p) => (
          <li key={p.kind}>
            <i data-kind={p.kind} aria-hidden="true" />
            {p.label} <span className="bchart__value">{range(p.r)}</span>
          </li>
        ))}
      </ul>
      <p className="bchart__note">{c.chart.note}</p>
    </figure>
  );
}

/** G2: build-total ranges for both working styles on one shared axis from zero. */
export function CompareBars({ trad, ai }: { trad: Range; ai: Range }) {
  const k = estimatorCopy.compare;
  // G10: a round step that gives about 4 ticks; the axis ends at the first tick at or past the largest high.
  const top = Math.max(trad.high, ai.high, 1);
  const raw = top / 4;
  const mag = 10 ** Math.floor(Math.log10(raw));
  const step = [1, 2, 5, 10].map((m) => m * mag).find((s) => s >= raw)!;
  const max = Math.ceil(top / step) * step;
  const ticks = Array.from({ length: max / step + 1 }, (_, i) => i * step);
  const rows = [
    { mode: "traditional", label: k.traditional, r: trad },
    { mode: "ai-assisted", label: k.ai, r: ai },
  ];
  return (
    <div className="cbars" role="img" aria-label={k.chartLabel(range(trad), range(ai))} data-testid="compare-bars">
      {rows.map((row) => (
        <div key={row.mode} className="cbars__row" data-mode={row.mode}>
          <span className="cbars__label">{row.label}</span>
          <span className="cbars__track">
            {ticks.slice(1, -1).map((t) => (
              <i key={t} className="cbars__tick" style={{ "--left": pct((t / max) * 100) } as Geometry} />
            ))}
            <span
              className="cbars__range"
              style={{ "--left": pct((row.r.low / max) * 100), "--width": pct(((row.r.high - row.r.low) / max) * 100) } as Geometry}
            />
          </span>
          <span className="cbars__value">{range(row.r)}</span>
        </div>
      ))}
      <div className="cbars__axis" aria-hidden="true">
        {ticks.map((t) => (
          <span key={t} style={{ "--left": pct((t / max) * 100) } as Geometry}>
            {k.tick(t)}
          </span>
        ))}
      </div>
    </div>
  );
}
