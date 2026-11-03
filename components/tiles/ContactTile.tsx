import { Tile } from "@/components/Bento";
import { profile } from "@/lib/content";

// Email and LinkedIn only. Never add a phone number (docs/04-content.md).
// TODO(M1, ui-builder): primary email button, LinkedIn and GitHub as secondary links. Bento span 7.
export function ContactTile() {
  return (
    <Tile span={7} title="Let's talk" id="contact">
      <p>{profile.availability}. The fastest way to reach me is email.</p>
      <p>
        <a href={`mailto:${profile.email}`}>{profile.email}</a>
      </p>
      <p>
        <a href={profile.linkedin} target="_blank" rel="noreferrer">
          LinkedIn
        </a>{" "}
        <a href={profile.github} target="_blank" rel="noreferrer">
          GitHub
        </a>
      </p>
    </Tile>
  );
}
