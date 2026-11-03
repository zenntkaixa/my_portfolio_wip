import { Tile } from "@/components/Bento";
import { experience, education } from "@/lib/content";

// TODO(M1, ui-builder): vertical timeline with period column in tabular numbers. Bento span 7.
export function ExperienceTile() {
  return (
    <Tile span={7} title="Experience" id="experience">
      <ol>
        {experience.map((e) => (
          <li key={e.org}>
            <strong>{e.org}</strong>, {e.role} <span>{e.period}</span>
          </li>
        ))}
      </ol>
      <p>{education}</p>
    </Tile>
  );
}
