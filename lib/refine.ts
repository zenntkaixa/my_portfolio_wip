import { FEATURE_MAX } from "@/lib/estimate";
import type { Plan } from "@/lib/estimate";
import { estimatorCopy } from "@/lib/content";

export type Answer = { question: string; answer: string };

/**
 * B4: the brief for a refine is the original brief plus the answered questions as plain text. It goes through
 * the normal estimate request, so Turnstile, the limits, length validation and prompt handling all still apply.
 */
export function refinedBrief(brief: string, answers: Answer[]): string {
  const given = answers.map((a) => ({ q: a.question.trim(), a: a.answer.trim().replace(/\s+/g, " ") })).filter((a) => a.a);
  const base = brief.trim();
  if (given.length === 0) return base;
  const lines = given.map((a) => `- ${a.q} ${a.a}`).join("\n");
  // A second refine adds to the answers block the first one wrote, instead of repeating its heading.
  const lead = `\n\n${estimatorCopy.refine.lead}\n`;
  return base.includes(lead) ? `${base}\n${lines}` : `${base}${lead}${lines}`;
}

/** Characters left before the refined brief passes the request limit (negative when over). */
export const refineRoom = (brief: string, answers: Answer[]) => FEATURE_MAX - refinedBrief(brief, answers).length;

/** B4d: task names that appear only in the new plan (added) or only in the old one (removed). */
export function taskDiff(before: string[], after: string[]) {
  const norm = (t: string) => t.trim().toLowerCase();
  const had = new Set(before.map(norm));
  const has = new Set(after.map(norm));
  return { added: after.filter((t) => !had.has(norm(t))), removed: before.filter((t) => !has.has(norm(t))) };
}

export const taskNames = (plan: Plan) => plan.phases.flatMap((p) => p.tasks.filter((t) => !t.addedByCode).map((t) => t.task));

/** W3: the plan summary shows one sentence (saved plans were written before the prompt asked for one). */
// shortcut: splits at the first ". " so an abbreviation like "e.g. " ends it early; fine for model prose.
export const firstSentence = (text: string) => text.match(/^.*?[.!?](?=\s|$)/s)?.[0] ?? text;
