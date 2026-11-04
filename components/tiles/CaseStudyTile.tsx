import { Tile } from "@/components/Bento";
import type { caseStudies } from "@/lib/content";

type Study = (typeof caseStudies)[number];

/** Case study: title, muted context line, body, then stack chips pinned to the tile's bottom edge. */
export function CaseStudyTile({ study, tabletSpan = 3 }: { study: Study; tabletSpan?: 3 | 6 }) {
  return (
    <Tile span={4} tabletSpan={tabletSpan} title={study.title} className="tile--case">
      <p className="tile__meta">{study.context}</p>
      <p className="case__body">{study.body}</p>
      <ul className="chips" aria-label="Tech stack">
        {study.stack.map((s) => (
          <li key={s}>{s}</li>
        ))}
      </ul>
    </Tile>
  );
}
