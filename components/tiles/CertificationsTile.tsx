import { Tile } from "@/components/Bento";
import { certifications } from "@/lib/content";

/** Certifications: name on the left, year right-aligned; no year renders nothing. */
export function CertificationsTile() {
  return (
    <Tile span={5} tabletSpan={3} title="Certifications" id="certifications">
      <ul className="certs" role="list">
        {certifications.map((c) => (
          <li key={c.name} className="certs__item">
            <span className="certs__name">{c.name}</span>
            {c.year ? (
              <>
                <span className="sr-only">, </span>
                <span className="certs__year">{c.year}</span>
              </>
            ) : null}
          </li>
        ))}
      </ul>
    </Tile>
  );
}
