import { Tile } from "@/components/Bento";
import { featuredProject as p } from "@/lib/content";

/** Featured project: lead tagline, description, highlights, stack chips, then repo and live links. */
export function ProjectTile() {
  return (
    <Tile span={7} title={`Featured project: ${p.name}`} id="projects">
      <p className="project__tagline">{p.tagline}</p>
      <p>{p.description}</p>
      <ul className="project__highlights">
        {p.highlights.map((h) => (
          <li key={h}>{h}</li>
        ))}
      </ul>
      <ul className="chips" aria-label="Tech stack">
        {p.stack.map((s) => (
          <li key={s}>{s}</li>
        ))}
      </ul>
      {/* A list, so the links stay separate items when copied or read in reading modes. */}
      <ul className="project__links">
        <li>
          <a href={p.repo} target="_blank" rel="noopener noreferrer">
            View code on GitHub<span className="sr-only"> (opens in a new tab)</span>
          </a>
        </li>
        {p.live ? (
          <li>
            <a href={p.live} target="_blank" rel="noopener noreferrer">
              Live demo<span className="sr-only"> (opens in a new tab)</span>
            </a>
          </li>
        ) : null}
      </ul>
    </Tile>
  );
}
