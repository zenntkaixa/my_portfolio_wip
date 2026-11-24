// Saved plans for every example chip and detailed brief (E5), so a chip submitted unchanged at team size 4
// shows a real Claude plan at once with no request. Run by hand, never in CI (about 43 calls, ~US$0.06):
//   npm run examples:generate      (needs ANTHROPIC_API_KEY in .env.local)
import { writeFileSync } from "node:fs";
import { requestBody } from "@/lib/prompt";
import { normaliseScope, type Scope } from "@/lib/estimate";
import { estimatorBriefs, estimatorExamples } from "@/lib/content";

const MODEL = process.env.ANTHROPIC_MODEL || "claude-haiku-5-5";
const TEAM_SIZE = 4;
const key = process.env.ANTHROPIC_API_KEY;
if (!key) throw new Error("ANTHROPIC_API_KEY is not set");

const features = [...estimatorExamples, ...estimatorBriefs.map((b) => b.text)];
const plans: Record<string, Scope> = {};
let cost = 0;
for (const feature of features) {
  const res = await fetch("https://api.anthropic.com/v1/messages", {
    method: "POST",
    headers: { "content-type": "application/json", "x-api-key": key, "anthropic-version": "2023-06-01" },
    body: JSON.stringify(requestBody(MODEL, { feature, teamSize: TEAM_SIZE })),
    signal: AbortSignal.timeout(60_000),
  });
  const data = (await res.json()) as { content?: { type: string; text?: string }[]; usage?: { input_tokens: number; output_tokens: number } };
  const u = data.usage ?? { input_tokens: 0, output_tokens: 0 };
  cost += (u.input_tokens * 0.1 + u.output_tokens * 0.5) / 1e6;
  let scope: Scope | null = null;
  try {
    scope = res.ok ? normaliseScope(JSON.parse(data.content?.find((b) => b.type === "text")?.text ?? ""), TEAM_SIZE) : null;
  } catch {
    scope = null;
  }
  // A refused or broken reply is skipped: that chip simply stays live.
  if (scope) plans[feature] = scope;
  console.log(scope ? "ok  " : "SKIP", feature.slice(0, 70));
}
const generated = new Date().toISOString().slice(0, 10);
writeFileSync("lib/examplePlans.json", JSON.stringify({ generated, model: MODEL, teamSize: TEAM_SIZE, plans }, null, 1) + "\n");
console.log(`\n${Object.keys(plans).length} of ${features.length} saved; cost about US$${cost.toFixed(4)}`);
