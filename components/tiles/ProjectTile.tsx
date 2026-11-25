import { Tile } from "@/components/Bento";
import { ExternalLink } from "@/components/ExternalLink";
import { featuredProject as p, profile } from "@/lib/content";

/** Featured project: lead tagline, description, tech line, stack chips, then repo and live links, after a dated personal GitHub stat. */
export function ProjectTile() {
  return (
    <Tile span={7} title={`Featured project: ${p.name}`} id="projects" className="tile--project">
      <p className="project__personal">
        <strong>{p.personal.value}</strong> {p.personal.text} ·{" "}
        <ExternalLink href={profile.github}>{p.personal.link}</ExternalLink>
      </p>
      <p className="project__tagline">{p.tagline}</p>
      <picture>
        <source media="(prefers-reduced-motion: reduce)" srcSet={p.preview.still} />
        {/* Plain img: a GIF is not optimised by next/image and needs no dependency. */}
        <img className="project__preview" src={p.preview.gif} alt={p.preview.alt} width={800} height={512} loading="lazy" />
      </picture>
      <div className="project__about">
        <p>{p.description}</p>
        <p className="project__tech">{p.tech}</p>
      </div>
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
