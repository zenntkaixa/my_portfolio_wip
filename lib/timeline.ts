import type { Phase, Task } from "@/lib/estimate";

/** Position of one phase bar on the timeline, as percentages of the full width. */
export type Bar = { name: string; leftPct: number; widthPct: number; label: string };

/** Hours per role, sorted descending. */
export type RoleTotal = { role: string; hours: number };

const clamp = (n: number, lo: number, hi: number) => Math.min(hi, Math.max(lo, n));

/**
 * Convert phases into bar positions for the timeline chart.
 * Spec: docs/03-estimator-spec.md → "Tab 1". left = startDay / totalDays, width = durationDays / totalDays,
 * both clamped to 0..100 with left + width never exceeding 100 (width is trimmed).
 * Label format: "Day 3 to 7" (1-based, inclusive), or "Day 3" when the phase fits in a single day.
 * Returns [] when totalDays is not a positive finite number or there are no phases.
 */
export function toBars(phases: Phase[], totalDays: number): Bar[] {
  if (!Number.isFinite(totalDays) || totalDays <= 0 || phases.length === 0) return [];
  return phases.map((p) => {
    const leftPct = clamp((p.startDay / totalDays) * 100, 0, 100);
    const widthPct = clamp((p.durationDays / totalDays) * 100, 0, 100 - leftPct);
    // startDay can be a half day (normalisePlan rounds to 0.5); labels use whole days.
    const start = Math.floor(p.startDay) + 1;
    const end = Math.ceil(p.startDay + p.durationDays);
    const label = end <= start ? `Day ${start}` : `Day ${start} to ${end}`;
    return { name: p.name, leftPct, widthPct, label };
  });
}

/**
 * Week gridline positions (every 5 working days), as percentages. Excludes 0 and 100.
 * Returns [] when totalDays is 5 or less, or not finite.
 */
export function weekMarkers(totalDays: number): number[] {
  if (!Number.isFinite(totalDays) || totalDays <= 5) return [];
  const markers: number[] = [];
  for (let d = 5; d < totalDays; d += 5) markers.push((d / totalDays) * 100);
  return markers;
}

/**
 * Sum task hours by role (pass tasks flattened across phases), sorted by hours descending,
 * ties broken by role name ascending.
 */
export function roleTotals(tasks: Task[]): RoleTotal[] {
  const sums = new Map<string, number>();
  for (const t of tasks) sums.set(t.role, (sums.get(t.role) ?? 0) + t.hours);
  return [...sums]
    .map(([role, hours]) => ({ role, hours }))
    .sort((a, b) => b.hours - a.hours || a.role.localeCompare(b.role));
}
