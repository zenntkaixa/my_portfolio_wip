import type { CSSProperties } from "react";
import { Tile } from "@/components/Bento";
import { now } from "@/lib/content";

/** Now: current role and org, what the work is, then three stats. */
export function NowTile() {
  return (
    <Tile span={5} title="Right now" className="tile--now">
      <div>
        <p className="now__title">{now.title}</p>
        <p className="now__org">{now.org}</p>
      </div>
      <p>{now.detail}</p>
      {/* DOM order is dt then dd so it reads "label: value"; CSS shows the value on top. */}
      <dl className="stats">
        {now.stats.map((s) => (
          <div key={s.label} className="stats__item">
            <dt className="stats__label">{s.label}</dt>
            <dd className="stats__value">
              {/* Real value for screen readers and no-CSS visitors; the counting digits are CSS-only.
                  Values must start with a number ("8+", "100"): "Many" would count to 0 then show "0Many". */}
              <span className="sr-only">{s.value}</span>
              <span
                className="stats__count"
                aria-hidden="true"
                data-suffix={s.value.replace(/^\d+/, "")}
                style={{ "--to": parseInt(s.value, 10) } as CSSProperties}
              />
            </dd>
          </div>
        ))}
      </dl>
    </Tile>
  );
}
