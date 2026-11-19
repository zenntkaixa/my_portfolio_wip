import type { Plan } from "@/lib/estimate";

export const DEFAULT_RETRY_SECONDS = 60;
export const MAX_RETRY_SECONDS = 3600;

export const isObj = (v: unknown): v is Record<string, unknown> =>
  !!v && typeof v === "object";
const isStrList = (v: unknown) =>
  Array.isArray(v) && v.every((x) => typeof x === "string");

const num = (v: unknown, max = Infinity): v is number =>
  typeof v === "number" && Number.isFinite(v) && v <= max;

/** Shape and sanity check so a malformed or absurd body never crashes the renderers. */
export function isPlan(v: unknown): v is Plan {
  if (!isObj(v)) return false;
  if (typeof v.title !== "string" || typeof v.summary !== "string")
    return false;
  if (!isStrList(v.assumptions) || !isStrList(v.risks)) return false;
  if (
    !Array.isArray(v.costs) ||
    !v.costs.every((c) => isObj(c) && typeof c.item === "string" && num(c.low) && num(c.high))
  ) {
    return false;
  }
  if (!num(v.totalHours, 100000) || !num(v.totalDays, 2000) || !num(v.calendarWeeks, 400)) {
    return false;
  }
  return (
    Array.isArray(v.phases) &&
    v.phases.every(
      (p) =>
        isObj(p) &&
        typeof p.name === "string" &&
        num(p.startDay) &&
        num(p.durationDays) &&
        Array.isArray(p.tasks) &&
        p.tasks.every(
          (t) => isObj(t) && typeof t.task === "string" && typeof t.role === "string" && num(t.hours),
        ),
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
