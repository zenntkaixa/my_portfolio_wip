// Minimal Upstash Redis REST client (ADR-009). One command per call: POST <url> with a JSON array body,
// reply { "result": ... } or { "error": "..." }. Plain fetch, no dependency.

export type UpstashConfig = { url: string; token: string };

const TIMEOUT_MS = 1000;

/** Returns the trimmed config, or null unless both values are set and the URL is https. */
export function upstashConfig(env: Record<string, string | undefined>): UpstashConfig | null {
  const url = env.UPSTASH_REDIS_REST_URL?.trim();
  const token = env.UPSTASH_REDIS_REST_TOKEN?.trim();
  if (!url || !token) return null;
  let parsed: URL;
  try {
    parsed = new URL(url);
  } catch {
    return null;
  }
  if (parsed.protocol !== "https:" || parsed.username || parsed.password) return null;
  return { url: url.replace(/\/+$/, ""), token };
}

/** Error with a short, value-free reason that is safe to log. */
export class UpstashError extends Error {
  constructor(reason: string) {
    super(reason);
    this.name = "UpstashError";
  }
}

/** Sends one command and returns its `result`. Throws UpstashError on any failure or unexpected reply. */
export async function upstashCommand(config: UpstashConfig, command: (string | number)[]): Promise<unknown> {
  let res: Response;
  try {
    res = await fetch(config.url, {
      method: "POST",
      headers: { authorization: `Bearer ${config.token}`, "content-type": "application/json" },
      body: JSON.stringify(command.map(String)),
      signal: AbortSignal.timeout(TIMEOUT_MS),
      cache: "no-store",
    });
  } catch (err) {
    throw new UpstashError(err instanceof Error ? err.name : "fetch failed");
  }
  if (!res.ok) throw new UpstashError(`HTTP ${res.status}`);
  let data: unknown;
  try {
    data = await res.json();
  } catch (err) {
    throw new UpstashError(err instanceof Error && err.name === "TimeoutError" ? "TimeoutError" : "unparseable reply");
  }
  if (!data || typeof data !== "object") throw new UpstashError("unexpected reply");
  if ("error" in data) throw new UpstashError("error reply");
  if (!("result" in data)) throw new UpstashError("unexpected reply");
  return (data as { result: unknown }).result;
}
