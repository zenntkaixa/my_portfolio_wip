import { Tile } from "@/components/Bento";
import { slug } from "@/lib/slug";
import { stack } from "@/lib/content";

/** Stack: chips grouped under small headings; each chips list is named by its heading. */
export function StackTile() {
  return (
    <Tile span={5} tabletSpan={3} title="Stack" id="stack">
      {stack.map((g) => {
        const headingId = `stack-${slug(g.group)}`;
        return (
          <div key={g.group} className="stack__group">
            <h3 id={headingId} className="stack__heading">
              {g.group}
            </h3>
            <ul className="chips" role="list" aria-labelledby={headingId}>
              {g.items.map((i) => (
                <li key={i}>{i}</li>
              ))}
            </ul>
          </div>
        );
      })}
    </Tile>
  );
}
