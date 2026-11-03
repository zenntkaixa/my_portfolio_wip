import { Tile } from "@/components/Bento";
import { featuredProject as p } from "@/lib/content";

// TODO(M1, ui-builder): stack chips, highlights list styling, "View code" and "Live demo" links
// (hide live link while p.live is empty). Bento span 7.
export function ProjectTile() {
  return (
    <Tile span={7} title={`Featured project: ${p.name}`} id="projects">
      <p>{p.tagline}</p>
      <p>{p.description}</p>
      <ul>
        {p.highlights.map((h) => (
          <li key={h}>{h}</li>
        ))}
      </ul>
      <ul className="chips" aria-label="Tech stack">
        {p.stack.map((s) => (
          <li key={s}>{s}</li>
        ))}
      </ul>
      <p>
        <a href={p.repo} target="_blank" rel="noreferrer">
          View code on GitHub
        </a>
        {p.live ? (
          <>
            {" "}
            <a href={p.live} target="_blank" rel="noreferrer">
              Live demo
            </a>
          </>
        ) : null}
      </p>
    </Tile>
  );
}
