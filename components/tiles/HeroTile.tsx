import { Tile } from "@/components/Bento";
import { profile } from "@/lib/content";

// TODO(M1, ui-builder): initials avatar block, display-size name (--fs-2xl), availability dot (--ok),
// location line. Bento span 7, size lg. See docs/01-design-system.md.
export function HeroTile() {
  return (
    <Tile span={7} size="lg" title={`About ${profile.name}`} hideTitle id="about" className="tile--hero">
      <div className="hero__avatar" aria-hidden="true">
        {profile.initials}
      </div>
      <p className="hero__name">{profile.name}</p>
      <p className="hero__role">{profile.role}</p>
      <p className="hero__headline">{profile.headline}</p>
      <p className="hero__summary">{profile.summary}</p>
      <p className="hero__meta">
        {profile.location}. {profile.availability}.
      </p>
    </Tile>
  );
}
