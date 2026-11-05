import { Tile } from "@/components/Bento";
import { ExternalLink } from "@/components/ExternalLink";
import { profile } from "@/lib/content";

// Email and LinkedIn only. Never add a phone number (docs/04-content.md).
/** Contact: availability note, email as the primary button, then LinkedIn and GitHub links. */
export function ContactTile() {
  return (
    <Tile span={7} title="Let's talk" id="contact">
      <p>
        {profile.availability}. {profile.contactNote}
      </p>
      <p className="contact__primary">
        <a className="button-link" href={`mailto:${profile.email}`}>
          {profile.email}
        </a>
      </p>
      <ul className="contact__links" role="list">
        <li>
          <ExternalLink href={profile.linkedin}>LinkedIn</ExternalLink>
        </li>
        <li>
          <ExternalLink href={profile.github}>GitHub</ExternalLink>
        </li>
      </ul>
    </Tile>
  );
}
