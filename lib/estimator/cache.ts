// 24-hour plan cache in Upstash Redis. Off when Upstash is unset; any Upstash error is a silent miss.

import { createHash } from "node:crypto";
import type { EstimateRequest, Plan } from "@/lib/estimate";
import { upstashCommand, upstashConfig } from "@/lib/upstash";
import { requestBody } from "@/lib/prompt";
import { MODEL } from "./anthropic";

// Bump when normalisePlan or the plan shape changes; prompt, schema, model and request settings are hashed below.
const CACHE_REV = 1;
// A new model, prompt, schema or request setting starts a fresh cache instead of serving plans made by the old one.
const VERSION = createHash("sha256")
  .update(JSON.stringify([CACHE_REV, requestBody(MODEL, { feature: "", teamSize: 1, seniority: "mid", mode: "traditional" })]))
  .digest("hex")
  .slice(0, 12);

export const CACHE_TTL_S = 86_400;

export type PlanCache = {
  get: (key: string) => Promise<Plan | null>;
  set: (key: string, plan: Plan) => Promise<void>;
};

/** Same feature (case and spacing ignored), team size, seniority and mode share one key per model and prompt version. */
export function cacheKey({ feature, teamSize, seniority, mode }: Pick<EstimateRequest, "feature" | "teamSize" | "seniority" | "mode">) {
  const normalised = feature.trim().replace(/\s+/g, " ").toLowerCase();
  return `plan:${VERSION}:` + createHash("sha256").update(JSON.stringify([normalised, teamSize, seniority, mode])).digest("hex");
}

// We wrote the value ourselves, so a light shape check is enough to catch a stale or foreign entry.
function asPlan(raw: unknown): Plan | null {
  if (typeof raw !== "string") return null;
  try {
    const v = JSON.parse(raw) as Plan;
    return v && typeof v === "object" && Array.isArray(v.phases) && typeof v.totalHours === "number" ? v : null;
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
        return asPlan(await upstashCommand(config, ["GET", key]));
      } catch {
        return null;
      }
    },
    set: async (key, plan) => {
      try {
        await upstashCommand(config, ["SET", key, JSON.stringify(plan), "EX", CACHE_TTL_S]);
      } catch {
        // A failed write only costs a future cache hit.
      }
    },
  };
}
