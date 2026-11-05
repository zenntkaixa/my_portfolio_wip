import { Tile } from "@/components/Bento";
import { experience, education } from "@/lib/content";

/** Experience: a vertical timeline (period, then org and role), with education below. */
export function ExperienceTile() {
  return (
    <Tile span={7} title="Experience" id="experience" className="tile--experience">
      {/* Markers are removed by CSS, so role="list" keeps list semantics in Safari/VoiceOver. */}
      <ol className="timeline" role="list">
        {experience.map((e) => (
          <li key={`${e.org}-${e.period}`} className="timeline__item">
            {/* Hidden commas keep the parts separate when read aloud or copied as text. */}
            <span className="timeline__period">{e.period}</span>
            <span className="sr-only">, </span>
            <span className="timeline__body">
              <span className="timeline__org">{e.org}</span>
              <span className="sr-only">, </span>
              <span className="timeline__role">{e.role}</span>
            </span>
          </li>
        ))}
      </ol>
      <h3 className="experience__label">Education</h3>
      <p>{education}</p>
    </Tile>
  );
}
