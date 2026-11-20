// 24-hour scope cache in Upstash Redis. Off when Upstash is unset; any Upstash error is a silent miss.

import { createHash } from "node:crypto";
import type { EstimateRequest, Scope } from "@/lib/estimate";
import { isScope } from "@/lib/estimatorClient";
import { upstashCommand, upstashConfig } from "@/lib/upstash";
import { requestBody } from "@/lib/prompt";
import { MODEL } from "./anthropic";

// Bump when normaliseScope or the scope shape changes; prompt, schema, model and request settings are hashed below.
const CACHE_REV = 2;
// A new model, prompt, schema or request setting starts a fresh cache instead of serving plans made by the old one.
const VERSION = createHash("sha256")
  .update(JSON.stringify([CACHE_REV, requestBody(MODEL, { feature: "", teamSize: 1 })]))
  .digest("hex")
  .slice(0, 12);

export const CACHE_TTL_S = 86_400;

export type PlanCache = {
  get: (key: string) => Promise<Scope | null>;
  set: (key: string, scope: Scope) => Promise<void>;
};

/**
 * Same feature (case and spacing ignored) and team size share one key per model and prompt version.
 * Seniority and working style are applied in code, so every combination reuses one scope.
 */
export function cacheKey({ feature, teamSize }: Pick<EstimateRequest, "feature" | "teamSize">) {
  const normalised = feature.trim().replace(/\s+/g, " ").toLowerCase();
  return `plan:${VERSION}:` + createHash("sha256").update(JSON.stringify([normalised, teamSize])).digest("hex");
}

// Full shape check: a stale or foreign entry is a miss, never a crash in buildPlan.
function asScope(raw: unknown): Scope | null {
  if (typeof raw !== "string") return null;
  try {
    const v: unknown = JSON.parse(raw);
    return isScope(v) ? v : null;
  } catch {
    return null;
  }
}

export const noCache: PlanCache = { get: async () => null, set: async () => {} };

/** The Upstash-backed cache, or `noCache` when the two Upstash env vars are unset. */
export function upstashPlanCache(env: Record<string, string | undefined> = process.env): PlanCache {
  const config = upstashConfig(env);
  if (!config) return noCache;
  return {
    get: async (key) => {
      try {
        return asScope(await upstashCommand(config, ["GET", key]));
      } catch {
        return null;
      }
    },
    set: async (key, scope) => {
      try {
        await upstashCommand(config, ["SET", key, JSON.stringify(scope), "EX", CACHE_TTL_S]);
      } catch {
        // A failed write only costs a future cache hit.
      }
    },
  };
}
