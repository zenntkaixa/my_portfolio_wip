import { Tile } from "@/components/Bento";
import { ExternalLink } from "@/components/ExternalLink";
import { certifications, certificationsNote, guidewireCheck } from "@/lib/content";

/** Certifications: name (linked to its verification page when there is one) left, year right; no year renders nothing. */
export function CertificationsTile() {
  return (
    <Tile span={5} tabletSpan={3} title="Certifications" id="certifications">
      <p className="certs__note">{certificationsNote}</p>
      <ul className="certs" role="list">
        {certifications.map((c) => (
          <li key={c.name} className="certs__item">
            <span className="certs__name">{c.url ? <ExternalLink href={c.url}>{c.name}</ExternalLink> : c.name}</span>
            {c.year ? (
              <>
                <span className="sr-only">, </span>
                <span className="certs__year">{c.year}</span>
              </>
            ) : null}
          </li>
        ))}
      </ul>
      <p className="certs__note">
        <ExternalLink href={guidewireCheck.url}>{guidewireCheck.link}</ExternalLink>
        {guidewireCheck.after}
      </p>
    </Tile>
  );
}
