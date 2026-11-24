/** Parses "2025 to now", "2024 to 2025" or "2019" into start/end years. Returns null if unrecognised. */
export function parsePeriod(period: string, nowYear: number): { start: number; end: number } | null {
  const m = /^(\d{4})(?: to (\d{4}|now))?$/.exec(period.trim());
  if (!m) return null;
  const start = Number(m[1]);
  const end = m[2] === undefined ? start : m[2] === "now" ? nowYear : Number(m[2]);
  return end >= start ? { start, end } : null;
}

/** Bar position as percentages of the axis [axisStart, axisEnd]. A single-year period gets a one-year bar. */
export function barPosition(period: string, axisStart: number, axisEnd: number, nowYear: number) {
  const p = parsePeriod(period, nowYear);
  const total = axisEnd - axisStart;
  if (!p || total <= 0) return null;
  const end = p.end === p.start ? p.start + 1 : p.end;
  const left = ((p.start - axisStart) / total) * 100;
  const width = (Math.min(end, axisEnd) - p.start) / total * 100;
  return { left: Math.max(0, left), width: Math.max(0, width) };
}
