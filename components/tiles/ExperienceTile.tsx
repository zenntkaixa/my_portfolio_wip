import { Tile } from "@/components/Bento";
import { experience, education } from "@/lib/content";
import { barPosition } from "@/lib/careerSpan";

// shortcut: "now" is the year at build/revalidate time (the page is static); upgrade if it must be live.
const NOW = new Date().getFullYear();
const AXIS_START = 2017;
const TICKS = [2017, 2020, 2023, NOW];

/** Experience: a Gantt-style timeline (period, org, role and field, plus a decorative bar on a shared year axis), with education below. */
export function ExperienceTile() {
  return (
    <Tile span={7} title="Experience" id="experience" className="tile--experience">
      {/* Markers are removed by CSS, so role="list" keeps list semantics in Safari/VoiceOver. */}
      <ol className="timeline" role="list">
        {experience.map((e) => {
          const bar = barPosition(e.period, AXIS_START, NOW, NOW);
          return (
          <li key={`${e.org}-${e.period}`} className="timeline__item">
            {/* Hidden commas keep the parts separate when read aloud or copied as text. */}
            <span className="timeline__period">{e.period}</span>
            <span className="sr-only">, </span>
            <span className="timeline__body">
              <span className="timeline__org">{e.org}</span>
              {e.role && (
                <>
                  <span className="sr-only">, </span>
                  <span className="timeline__role">{e.role}</span>
                  <span className="sr-only">, </span>
                  <span className="timeline__field">{e.field}</span>
                </>
              )}
            </span>
            {bar && (
              <span
                aria-hidden="true"
                className={`timeline__bar${e.role ? "" : " timeline__bar--gap"}`}
                style={{ "--bar-left": `${bar.left}%`, "--bar-width": `${bar.width}%` } as React.CSSProperties}
              />
            )}
          </li>
          );
        })}
      </ol>
      <div className="timeline__axis" aria-hidden="true">
        {TICKS.map((y) => (
          <span key={y} style={{ "--tick": `${((y - AXIS_START) / (NOW - AXIS_START)) * 100}%` } as React.CSSProperties}>
            {y}
          </span>
        ))}
      </div>
      <h3 className="experience__label">Education</h3>
      <p>{education}</p>
    </Tile>
  );
}
