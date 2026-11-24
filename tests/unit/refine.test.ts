import { describe, expect, it } from "vitest";
import { refinedBrief, refineRoom } from "@/lib/refine";
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
