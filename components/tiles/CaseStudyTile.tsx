import { Tile } from "@/components/Bento";
import type { caseStudies } from "@/lib/content";

type Study = (typeof caseStudies)[number];

// TODO(M1, ui-builder): context line in --muted, stack chips. Bento span 4.
// Tablet: first two half width, third full width (page.tsx passes tabletSpan).
export function CaseStudyTile({ study, tabletSpan = 3 }: { study: Study; tabletSpan?: 3 | 6 }) {
  return (
    <Tile span={4} tabletSpan={tabletSpan} title={study.title}>
      <p>{study.context}</p>
      <p>{study.body}</p>
      <ul className="chips" aria-label="Tech stack">
        {study.stack.map((s) => (
          <li key={s}>{s}</li>
        ))}
      </ul>
    </Tile>
  );
}
