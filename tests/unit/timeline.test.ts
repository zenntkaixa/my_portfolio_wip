import { describe, expect, it } from "vitest";
import fixture from "../fixtures/plan.json";
import type { Phase, Task } from "@/lib/estimate";
import { roleTotals, toBars, weekMarkers } from "@/lib/timeline";

const plan = fixture.plan as unknown as { phases: Phase[]; totalDays: number };
const phase = (startDay: number, durationDays: number, name = "P"): Phase => ({
  name,
  goal: "",
  startDay,
  durationDays,
  tasks: [],
});

describe("toBars", () => {
  it("positions each bar as startDay/totalDays and durationDays/totalDays percentages", () => {
    const bars = toBars(plan.phases, plan.totalDays);
    expect(bars).toHaveLength(plan.phases.length);
    plan.phases.forEach((p, i) => {
      expect(bars[i].name).toBe(p.name);
      expect(bars[i].leftPct).toBeCloseTo((p.startDay / plan.totalDays) * 100, 5);
      expect(bars[i].widthPct).toBeCloseTo((p.durationDays / plan.totalDays) * 100, 5);
    });
  });

  it("labels bars 1-based and inclusive, e.g. 'Day 3 to 4'", () => {
    const labels = toBars(plan.phases, plan.totalDays).map((b) => b.label);
    expect(labels).toEqual(["Day 1 to 2", "Day 3 to 4", "Day 5 to 10", "Day 9 to 12", "Day 13"]);
  });

  it("returns an empty array for zero phases", () => {
    expect(toBars([], 13)).toEqual([]);
  });

  it("returns an empty array when totalDays is 0, negative or not finite", () => {
    expect(toBars(plan.phases, 0)).toEqual([]);
    expect(toBars(plan.phases, -3)).toEqual([]);
    expect(toBars(plan.phases, Number.NaN)).toEqual([]);
    expect(toBars(plan.phases, Infinity)).toEqual([]);
  });

  it("labels a fractional sub-day duration as a single day", () => {
    expect(toBars([phase(0, 0.5)], 10)[0].label).toBe("Day 1");
  });

  it("labels a half-day start with whole days", () => {
    expect(toBars([phase(2.5, 2)], 10)[0].label).toBe("Day 3 to 5");
    expect(toBars([phase(2.5, 0.5)], 10)[0].label).toBe("Day 3");
  });

  it("labels a single-day phase as a single day", () => {
    expect(toBars([phase(12, 1)], 13)[0].label).toBe("Day 13");
  });

  it("trims a bar that overflows totalDays so left + width <= 100", () => {
    const [bar] = toBars([phase(8, 6)], 10);
    expect(bar.leftPct).toBeCloseTo(80, 5);
    expect(bar.widthPct).toBeCloseTo(20, 5);
    expect(bar.leftPct + bar.widthPct).toBeLessThanOrEqual(100 + 1e-9);
  });

  it("clamps a bar that starts past the end", () => {
    const [bar] = toBars([phase(20, 2)], 10);
    expect(bar.leftPct).toBeCloseTo(100, 5);
    expect(bar.widthPct).toBeCloseTo(0, 5);
  });

  it("preserves phase order", () => {
    const names = toBars([phase(5, 1, "B"), phase(0, 1, "A")], 10).map((b) => b.name);
    expect(names).toEqual(["B", "A"]);
  });
});

describe("weekMarkers", () => {
  it("returns a marker every 5 working days, excluding 0% and 100%", () => {
    const m = weekMarkers(plan.totalDays);
    expect(m).toHaveLength(2);
    expect(m[0]).toBeCloseTo((5 / 13) * 100, 5);
    expect(m[1]).toBeCloseTo((10 / 13) * 100, 5);
  });

  it("excludes the end when totalDays is a multiple of 5", () => {
    const m = weekMarkers(10);
    expect(m).toHaveLength(1);
    expect(m[0]).toBeCloseTo(50, 5);
  });

  it("returns [] when totalDays is 5 or less, or invalid", () => {
    expect(weekMarkers(5)).toEqual([]);
    expect(weekMarkers(3)).toEqual([]);
    expect(weekMarkers(0)).toEqual([]);
    expect(weekMarkers(Number.NaN)).toEqual([]);
    expect(weekMarkers(Infinity)).toEqual([]);
  });
});

describe("roleTotals", () => {
  it("sums hours per role across phases and sorts descending", () => {
    const tasks = plan.phases.flatMap((p) => p.tasks);
    expect(roleTotals(tasks)).toEqual([
      { role: "Backend", hours: 36 },
      { role: "Frontend", hours: 26 },
      { role: "QA", hours: 24 },
      { role: "Architect", hours: 12 },
      { role: "BA", hours: 8 },
      { role: "DevOps", hours: 6 },
    ]);
  });

  it("returns [] for no tasks", () => {
    expect(roleTotals([])).toEqual([]);
  });

  it("breaks ties by role name ascending", () => {
    const t = (role: string, hours: number): Task => ({ task: "x", role, hours });
    expect(roleTotals([t("QA", 4), t("BA", 4), t("Backend", 4), t("DevOps", 9)]).map((r) => r.role)).toEqual([
      "DevOps",
      "BA",
      "Backend",
      "QA",
    ]);
  });
});
