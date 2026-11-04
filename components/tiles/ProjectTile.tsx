import { Tile } from "@/components/Bento";
import { ExternalLink } from "@/components/ExternalLink";
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
      <ul className="chips" role="list" aria-label="Tech stack">
        {p.stack.map((s) => (
          <li key={s}>{s}</li>
        ))}
      </ul>
      {/* A list, so the links stay separate items when copied or read in reading modes. */}
      <ul className="project__links" role="list">
        <li>
          <ExternalLink href={p.repo}>View code on GitHub</ExternalLink>
        </li>
        {p.live ? (
          <li>
            <ExternalLink href={p.live}>Live demo</ExternalLink>
          </li>
        ) : null}
      </ul>
    </Tile>
  );
}
