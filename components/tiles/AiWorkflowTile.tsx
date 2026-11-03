import { Tile } from "@/components/Bento";
import { aiWorkflow } from "@/lib/content";

// TODO(M1, ui-builder): numbered steps (a real sequence, so numbers are meaningful). Bento span 5.
export function AiWorkflowTile() {
  return (
    <Tile span={5} title="How I build with AI agents">
      <ol>
        {aiWorkflow.map((s) => (
          <li key={s.step}>
            <strong>{s.step}.</strong> {s.text}
          </li>
        ))}
      </ol>
    </Tile>
  );
}
