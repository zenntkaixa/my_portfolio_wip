import { describe, it } from "vitest";

// TODO(M2): replace these todos with real tests when lib/timeline.ts is implemented.
// Use the phases in tests/fixtures/plan.json (totalDays 13) as the main case.
describe("toBars", () => {
  it.todo("positions each bar as startDay/totalDays and durationDays/totalDays percentages");
  it.todo("labels bars 1-based and inclusive, e.g. 'Day 3 to 4'");
  it.todo("returns an empty array for zero phases");
});

describe("weekMarkers", () => {
  it.todo("returns a marker every 5 working days, excluding 0% and 100%");
});

describe("roleTotals", () => {
  it.todo("sums hours per role and sorts descending");
});
