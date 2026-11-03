import { Tile } from "@/components/Bento";
import { certifications } from "@/lib/content";

// TODO(M1, ui-builder): compact list with year aligned right. Bento span 5, tablet span 3.
export function CertificationsTile() {
  return (
    <Tile span={5} tabletSpan={3} title="Certifications">
      <ul>
        {certifications.map((c) => (
          <li key={c.name}>
            {c.name} {c.year ? <span>{c.year}</span> : null}
          </li>
        ))}
      </ul>
    </Tile>
  );
}
