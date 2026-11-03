import type { Phase, Task } from "@/lib/estimate";

/** Position of one phase bar on the timeline, as percentages of the full width. */
export type Bar = { name: string; leftPct: number; widthPct: number; label: string };

/** Hours per role, sorted descending. */
export type RoleTotal = { role: string; hours: number };

/**
 * Convert phases into bar positions for the timeline chart.
 * Spec: docs/03-estimator-spec.md → "Tab 1". left = startDay / totalDays, width = durationDays / totalDays.
 * Label format: "Day 3 to 7" (1-based, inclusive).
 *
 * TODO(M2): implement and make tests/unit/timeline.test.ts pass.
 */
export function toBars(phases: Phase[], totalDays: number): Bar[] {
  void phases;
  void totalDays;
  return [];
}

/**
 * Week gridline positions (every 5 working days), as percentages. Excludes 0 and 100.
 *
 * TODO(M2): implement and make tests/unit/timeline.test.ts pass.
 */
export function weekMarkers(totalDays: number): number[] {
  void totalDays;
  return [];
}

/**
 * Sum task hours by role across all phases, sorted by hours descending.
 *
 * TODO(M2): implement and make tests/unit/timeline.test.ts pass.
 */
export function roleTotals(tasks: Task[]): RoleTotal[] {
  void tasks;
  return [];
}
