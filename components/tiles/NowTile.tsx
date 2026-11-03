import { Tile } from "@/components/Bento";
import { now } from "@/lib/content";

// TODO(M1, ui-builder): stats as a 3-up row with large tabular numbers. Bento span 5.
export function NowTile() {
  return (
    <Tile span={5} title="Right now">
      <p>
        <strong>{now.title}</strong>
        <br />
        {now.org}
      </p>
      <p>{now.detail}</p>
      <dl className="stats">
        {now.stats.map((s) => (
          <div key={s.label}>
            <dt>{s.label}</dt>
            <dd>{s.value}</dd>
          </div>
        ))}
      </dl>
    </Tile>
  );
}
