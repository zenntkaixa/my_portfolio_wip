import { describe, expect, it } from "vitest";
import { firstSentence, refinedBrief, stickyFacts, refineRoom, taskDiff } from "@/lib/refine";
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

describe("taskDiff fuzzy matching (B4e)", () => {
  it("treats reworded names as the same task and keeps different ones apart", () => {
    const d = taskDiff(["Build OTP API", "Write unit tests", "Build API"], ["Build the OTP service API", "Write tests", "Build UI"]);
    expect(d).toEqual({ added: ["Build UI"], removed: ["Build API"] });
  });
  it("matches each old task once", () => {
    expect(taskDiff(["Build API"], ["Build API", "build api"])).toEqual({ added: ["build api"], removed: [] });
  });
});

describe("stickyFacts (B4g)", () => {
  it("keeps facts stated before a refine, so confidence never drops", () => {
    const f = { users: true, systems: true, data: true, integrations: false, limits: false, outOfScope: false };
    const g = { users: false, systems: true, data: false, integrations: true, limits: false, outOfScope: false };
    expect(stickyFacts(f, g)).toEqual({ ...f, integrations: true });
  });
});

describe("firstSentence (W3)", () => {
  it("keeps the first sentence only", () => {
    expect(firstSentence("Add SMS login. The plan covers 4.5 phases.")).toBe("Add SMS login.");
    expect(firstSentence("No full stop")).toBe("No full stop");
    expect(firstSentence("Covers v2.0 rollout! Then more.")).toBe("Covers v2.0 rollout!");
  });
});

describe("refine.why and taskDiff (B4d)", () => {
  it("names added and removed tasks, case-insensitively", () => {
    const d = taskDiff(["Build API", "Old task"], ["build api", "Digest scheduling"]);
    expect(d).toEqual({ added: ["Digest scheduling"], removed: ["Old task"] });
    expect(estimatorCopy.refine.why(100, 130, d.added, d.removed)).toBe(" Added: Digest scheduling. Removed: Old task.");
  });
  it("shortens long lists", () => {
    expect(estimatorCopy.refine.why(1, 2, ["a", "b", "c", "d", "e"], [])).toBe(" Added: a, b and 3 more.");
  });
  it("says re-drafted, with the hour change, when most old tasks went (W5)", () => {
    expect(estimatorCopy.refine.why(100, 104.4, ["x", "y"], ["a", "b", "c"], 4)).toBe(" Plan re-drafted from your answers (+4 h).");
    expect(estimatorCopy.refine.why(100, 90, [], ["a", "b", "c"], 4)).toBe(" Plan re-drafted from your answers (−10 h).");
    expect(estimatorCopy.refine.why(100, 100, [], ["a", "b"], 4)).toBe(" Removed: a, b.");
  });
  it("says tasks are the same when only hours moved, and is quiet when nothing changed", () => {
    expect(estimatorCopy.refine.why(175, 202)).toBe(" Same tasks; hours re-estimated.");
    expect(estimatorCopy.refine.why(200, 200)).toBe("");
  });
});
