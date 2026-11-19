import type { EstimateRequest } from "@/lib/estimate";
import { requestBody } from "@/lib/prompt";

export const MODEL = process.env.ANTHROPIC_MODEL || "claude-haiku-5-5";

export type ModelInput = Pick<EstimateRequest, "feature" | "teamSize" | "seniority" | "mode">;

export type ModelResult =
  /** The API answered with an error status: nothing was generated or billed. */
  | { kind: "http_error"; model: string; status: number; errorType: string }
  /** Timeout or network failure: the call may still have been billed. */
  | { kind: "failed"; model: string; errorName: string }
  | { kind: "reply"; model: string; text: string; stopReason: string | null; inputTokens?: number; outputTokens?: number };

type AnthropicResponse = {
  content?: { type: string; text?: string }[];
  stop_reason?: string | null;
  usage?: { input_tokens?: number; output_tokens?: number };
};

/** One Messages API call. Never throws; only metadata leaves this function besides the reply text. */
export async function callAnthropic(input: ModelInput): Promise<ModelResult> {
  const model = MODEL;
  try {
    const res = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "content-type": "application/json",
        "x-api-key": process.env.ANTHROPIC_API_KEY ?? "",
        "anthropic-version": "2023-06-01",
      },
      body: JSON.stringify(requestBody(model, input)),
      signal: AbortSignal.timeout(45_000),
    });
    if (!res.ok) {
      // The error type only, never the raw upstream body.
      const errorType = await res
        .json()
        .then((b: { error?: { type?: unknown } }) => (typeof b?.error?.type === "string" ? b.error.type : "unknown"))
        .catch(() => "unparseable");
      return { kind: "http_error", model, status: res.status, errorType };
    }
    const data = (await res.json()) as AnthropicResponse;
    return {
      kind: "reply",
      model,
      stopReason: data.stop_reason ?? null,
      inputTokens: data.usage?.input_tokens,
      outputTokens: data.usage?.output_tokens,
      // Structured outputs put the JSON in the first text block.
      text: (data.content ?? []).find((b) => b.type === "text")?.text ?? "",
    };
  } catch (err) {
    return { kind: "failed", model, errorName: err instanceof Error ? err.name : "unknown" };
  }
}
