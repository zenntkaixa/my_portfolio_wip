import { Tile } from "@/components/Bento";
import { profile } from "@/lib/content";

/** Hero: initials avatar beside the name (the page's only h1) and role, then headline, summary, meta. */
export function HeroTile() {
  return (
    <Tile
      span={7}
      size="lg"
      title={profile.name}
      headingLevel={1}
      titleClassName="hero__name"
      id="about"
      className="tile--hero"
    >
      {/* Decorative: the h1 above already carries the name. Grid placement puts it beside the name. */}
      <div className="hero__avatar" aria-hidden="true">
        {profile.initials}
      </div>
      <p className="hero__role">{profile.role}</p>
      <p className="hero__headline">{profile.headline}</p>
      <p className="hero__summary">{profile.summary}</p>
      <p className="hero__meta tile__meta">
        <span>{profile.location}</span>
        {/* Spoken separator only; visually the flex gap separates the two items. */}
        <span className="sr-only">. </span>
        <span className="hero__availability">
          <span className="hero__dot" aria-hidden="true" />
          {profile.availability}
        </span>
      </p>
    </Tile>
  );
}
