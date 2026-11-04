import { Tile } from "@/components/Bento";
import { aiWorkflow } from "@/lib/content";

/** A real sequence, so it stays a native <ol>: the numbers are styled via ::marker in globals.css. */
export function AiWorkflowTile() {
  return (
    <Tile span={5} title="How I build with AI agents">
      <ol className="workflow">
        {aiWorkflow.map((s) => (
          <li key={s.step}>
            <strong className="workflow__step">{s.step}</strong>
            {/* Spoken separator only: the step name is on its own line visually. */}
            <span className="sr-only">:</span> {s.text}
          </li>
        ))}
      </ol>
    </Tile>
  );
}
