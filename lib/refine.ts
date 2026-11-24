import { FEATURE_MAX } from "@/lib/estimate";
import { estimatorCopy } from "@/lib/content";

export type Answer = { question: string; answer: string };

/**
 * B4: the brief for a refine is the original brief plus the answered questions as plain text. It goes through
 * the normal estimate request, so Turnstile, the limits, length validation and prompt handling all still apply.
 */
export function refinedBrief(brief: string, answers: Answer[]): string {
  const given = answers.map((a) => ({ q: a.question.trim(), a: a.answer.trim().replace(/\s+/g, " ") })).filter((a) => a.a);
  if (given.length === 0) return brief.trim();
  return `${brief.trim()}\n\n${estimatorCopy.refine.lead}\n${given.map((a) => `- ${a.q} ${a.a}`).join("\n")}`;
}

/** Characters left before the refined brief passes the request limit (negative when over). */
export const refineRoom = (brief: string, answers: Answer[]) => FEATURE_MAX - refinedBrief(brief, answers).length;
