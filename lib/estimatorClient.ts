import type { Plan } from "@/lib/estimate";

export const DEFAULT_RETRY_SECONDS = 60;
export const MAX_RETRY_SECONDS = 3600;

export const isObj = (v: unknown): v is Record<string, unknown> =>
  !!v && typeof v === "object";
const isStrList = (v: unknown) =>
  Array.isArray(v) && v.every((x) => typeof x === "string");

/** Minimal shape check so a malformed body never crashes the renderers. */
export function isPlan(v: unknown): v is Plan {
  if (!isObj(v)) return false;
  if (typeof v.title !== "string" || typeof v.summary !== "string")
    return false;
  if (!isStrList(v.assumptions) || !isStrList(v.risks)) return false;
  if (
    typeof v.totalHours !== "number" ||
    typeof v.totalDays !== "number" ||
    typeof v.calendarWeeks !== "number"
  ) {
    return false;
  }
  return (
    Array.isArray(v.phases) &&
    v.phases.every(
      (p) =>
        isObj(p) &&
        typeof p.name === "string" &&
        typeof p.startDay === "number" &&
        typeof p.durationDays === "number" &&
        Array.isArray(p.tasks),
    )
  );
}

/** Retry-After as seconds or an HTTP date. Invalid or missing falls back to 60; result is 1..3600. */
export function parseRetryAfter(
  header: string | null,
  now: number = Date.now(),
): number {
  const raw = header?.trim() ?? "";
  let seconds = NaN;
  if (/^\d+$/.test(raw)) seconds = Number(raw);
  else if (/[a-z]/i.test(raw)) {
    const at = Date.parse(raw);
    if (Number.isFinite(at)) seconds = Math.ceil((at - now) / 1000);
  }
  if (!Number.isFinite(seconds)) return DEFAULT_RETRY_SECONDS;
  return Math.min(Math.max(seconds, 1), MAX_RETRY_SECONDS);
}

export function formatWait(seconds: number): string {
  if (seconds < 60) return `${seconds}s`;
  return `${Math.floor(seconds / 60)}:${String(seconds % 60).padStart(2, "0")}`;
}
