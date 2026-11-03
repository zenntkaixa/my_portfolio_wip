import { Tile } from "@/components/Bento";
import { stack } from "@/lib/content";

// TODO(M1, ui-builder): grouped chips. Bento span 5, tablet span 3.
export function StackTile() {
  return (
    <Tile span={5} tabletSpan={3} title="Stack">
      {stack.map((g) => (
        <div key={g.group}>
          <h3>{g.group}</h3>
          <ul className="chips">
            {g.items.map((i) => (
              <li key={i}>{i}</li>
            ))}
          </ul>
        </div>
      ))}
    </Tile>
  );
}
