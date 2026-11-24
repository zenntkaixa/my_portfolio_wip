import { describe, expect, it } from "vitest";
import { refinedBrief, refineRoom, taskDiff } from "@/lib/refine";
import { FEATURE_MAX } from "@/lib/estimate";
import { estimatorCopy } from "@/lib/content";

const brief = "Patients book a GP slot on our website and get an SMS reminder.";

describe("refinedBrief", () => {
  it("appends only the answered questions, trimmed and on one line each", () => {
    const text = refinedBrief(brief, [
      { question: "How many clinics?", answer: "  3 clinics,\n about 300 bookings a day " },
      { question: "Which SMS provider?", answer: "   " },
      { question: "Payments?", answer: "Not in this phase" },
    ]);
    expect(text).toBe(
      `${brief}\n\n${estimatorCopy.refine.lead}\n- How many clinics? 3 clinics, about 300 bookings a day\n- Payments? Not in this phase`,
    );
  });

  it("adds a second refine's answers to the existing block", () => {
    const once = refinedBrief(brief, [{ question: "A?", answer: "yes" }]);
    expect(refinedBrief(once, [{ question: "B?", answer: "no" }])).toBe(`${once}\n- B? no`);
  });

  it("returns the brief unchanged when nothing is answered", () => {
    expect(refinedBrief(`  ${brief} `, [{ question: "Q?", answer: "" }])).toBe(brief);
  });

  it("reports the room left under the request limit, negative when over", () => {
    expect(refineRoom(brief, [])).toBe(FEATURE_MAX - brief.length);
    expect(refineRoom(brief, [{ question: "Q?", answer: "x".repeat(FEATURE_MAX) }])).toBeLessThan(0);
  });
});

describe("refine.why and taskDiff (B4d)", () => {
  it("names added and removed tasks, case-insensitively", () => {
    const d = taskDiff(["Build API", "Old task"], ["build api", "Digest scheduling"]);
    expect(d).toEqual({ added: ["Digest scheduling"], removed: ["Old task"] });
    expect(estimatorCopy.refine.why(100, 130, d.added, d.removed)).toBe(" Added: Digest scheduling. Removed: Old task.");
  });
  it("shortens long lists", () => {
    expect(estimatorCopy.refine.why(1, 2, ["a", "b", "c", "d", "e"], [])).toBe(" Added: a, b, c and 2 more.");
  });
  it("says tasks are the same when only hours moved, and is quiet when nothing changed", () => {
    expect(estimatorCopy.refine.why(175, 202)).toBe(" Same tasks; hours re-estimated.");
    expect(estimatorCopy.refine.why(200, 200)).toBe("");
  });
});
