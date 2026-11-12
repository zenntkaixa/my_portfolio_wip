// Vercel Web Analytics serves its tracker same-origin once enabled in the dashboard (ADR-008).
export const ANALYTICS_SCRIPT_SRC = "/_vercel/insights/script.js";

/** True only for Vercel production builds; local dev, e2e and previews must not load the tracker. */
export function analyticsEnabled(env: { VERCEL_ENV?: string }): boolean {
  return env.VERCEL_ENV === "production";
}
