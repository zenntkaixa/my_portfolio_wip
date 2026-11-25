import { FEATURE_MAX } from "@/lib/estimate";
import type { Fact, Plan } from "@/lib/estimate";
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

/** B4e: words of two or more letters, so "Build OTP API" and "Build the OTP service API" share most of them. */
const words = (t: string) => new Set(t.toLowerCase().match(/[a-z0-9]{2,}/g) ?? []);
const similar = (a: Set<string>, b: Set<string>) => {
  const shared = [...a].filter((w) => b.has(w)).length;
  return shared / (a.size + b.size - shared || 1) >= 0.6; // Jaccard: reworded names match, "Build API" vs "Build UI" don't
};

/** B4d/B4e: task names only in the new plan (added) or only in the old one (removed); reworded names count as the same task. */
export function taskDiff(before: string[], after: string[]) {
  const left = before.map(words);
  const used = new Set<number>();
  const added = after.filter((t) => {
    const w = words(t);
    const i = left.findIndex((l, j) => !used.has(j) && similar(l, w));
    if (i < 0) return true;
    used.add(i);
    return false;
  });
  return { added, removed: before.filter((_, i) => !used.has(i)) };
}

/** B4g: a refine only adds answers to the brief, so a fact stated before stays stated and confidence can't drop. */
export const stickyFacts = (before: Record<Fact, boolean>, after: Record<Fact, boolean>) =>
  Object.fromEntries(Object.entries(after).map(([k, v]) => [k, v || before[k as Fact]])) as Record<Fact, boolean>;

export const taskNames = (plan: Plan) => plan.phases.flatMap((p) => p.tasks.filter((t) => !t.addedByCode).map((t) => t.task));

/** W3: the plan summary shows one sentence (saved plans were written before the prompt asked for one). */
// shortcut: splits at the first ". " so an abbreviation like "e.g. " ends it early; fine for model prose.
export const firstSentence = (text: string) => text.match(/^.*?[.!?](?=\s|$)/s)?.[0] ?? text;
