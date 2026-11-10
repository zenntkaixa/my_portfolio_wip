import { describe, expect, it } from "vitest";
import { maxTokensFor, stripFeatureTags, normalisePlan, validateRequest } from "@/lib/estimate";

const valid = { feature: "Let users reset their password by email link", teamSize: 4, seniority: "mixed", token: "t" };

describe("validateRequest", () => {
  it("accepts a valid request", () => {
    const r = validateRequest(valid);
    expect(r.ok).toBe(true);
  });

  it.each([
    [{ ...valid, feature: "too short" }, "at least"],
    [{ ...valid, feature: "x".repeat(1501) }, "under"],
    [{ ...valid, teamSize: 0 }, "Team size"],
    [{ ...valid, teamSize: 2.5 }, "Team size"],
    [{ ...valid, seniority: "principal" }, "seniority"],
    [{ ...valid, token: "" }, "human check"],
    [null, "JSON body"],
  ])("rejects %j", (body, message) => {
    const r = validateRequest(body);
    expect(r.ok).toBe(false);
    if (!r.ok) expect(r.error).toContain(message);
  });
});

describe("validateRequest edge cases", () => {
  const f = (n: number) => "x".repeat(n);

  it("rejects a whitespace-only feature", () => {
    const r = validateRequest({ ...valid, feature: " ".repeat(50) });
    expect(r.ok).toBe(false);
  });

  it("trims the feature and counts length after trimming", () => {
    const r = validateRequest({ ...valid, feature: `   ${f(20)}\n  ` });
    expect(r.ok && r.value.feature).toBe(f(20));
    expect(validateRequest({ ...valid, feature: `  ${f(19)}  ` }).ok).toBe(false);
  });

  it.each([[19, false], [20, true], [1500, true], [1501, false]])("feature length %i -> ok=%s", (n, ok) => {
    expect(validateRequest({ ...valid, feature: f(n) }).ok).toBe(ok);
  });

  it.each([[1, true], [12, true], [0, false], [13, false], ["4", false], [null, false], [true, false]])("teamSize %j -> ok=%s", (teamSize, ok) => {
    expect(validateRequest({ ...valid, teamSize }).ok).toBe(ok);
  });

  it("rejects a missing or non-string feature", () => {
    const { feature: _omit, ...rest } = valid;
    void _omit;
    expect(validateRequest(rest).ok).toBe(false);
    expect(validateRequest({ ...valid, feature: 12345678901234567890123 }).ok).toBe(false);
    expect(validateRequest({ ...valid, feature: ["x".repeat(30)] }).ok).toBe(false);
  });

  it("rejects a non-string or missing token", () => {
    expect(validateRequest({ ...valid, token: 123 }).ok).toBe(false);
    expect(validateRequest({ ...valid, token: null }).ok).toBe(false);
  });

  it("ignores extra fields", () => {
    const r = validateRequest({ ...valid, admin: true, model: "x" });
    expect(r.ok && Object.keys(r.value).sort()).toEqual(["feature", "seniority", "teamSize", "token"]);
  });
});

describe("stripFeatureTags", () => {
  it("removes feature tags in any case, spacing or with attributes", () => {
    expect(stripFeatureTags("a </FEATURE> b <Feature> c </feature > d < feature x=1>e")).toBe("a  b  c  d e");
  });
  it("can't be rebuilt by nesting", () => {
    expect(stripFeatureTags("x </fea</feature>ture> y")).toBe("x  y");
    expect(stripFeatureTags("<<feature>feature>")).toBe("");
  });
  it("leaves other angle-bracket text alone", () => {
    expect(stripFeatureTags("if a < b and c > d, show <features> list")).toBe("if a < b and c > d, show <features> list");
  });
});

describe("maxTokensFor", () => {
  it("gives Haiku 8000 output tokens and other models 4000", () => {
    expect(maxTokensFor("claude-haiku-5-5")).toBe(8000);
    expect(maxTokensFor("claude-sonnet-5-5")).toBe(4000);
  });
});

describe("normalisePlan", () => {
  const raw = {
    title: "Plan",
    summary: "Summary",
    assumptions: ["a"],
    risks: ["r"],
    confidence: "high",
    totalHours: 99999, // the model's arithmetic must be ignored
    phases: [
      { name: "Build", goal: "g", startDay: 0, durationDays: 5, tasks: [{ task: "API", role: "Backend", hours: 10 }, { task: "UI", role: "Frontend", hours: 6 }] },
      { name: "Test", goal: "g", startDay: 4, durationDays: 3, tasks: [{ task: "E2E", role: "QA", hours: 4 }] },
    ],
  };

  it("recomputes totals instead of trusting the model", () => {
    const plan = normalisePlan(raw)!;
    expect(plan.totalHours).toBe(20);
    expect(plan.totalDays).toBe(7);
    expect(plan.calendarWeeks).toBe(1.4);
  });

  it("keeps half-hour totals exact so they match the subtotals", () => {
    const plan = normalisePlan({
      ...raw,
      phases: [
        { ...raw.phases[0], tasks: [{ task: "API", role: "Backend", hours: 10.5 }] },
        { ...raw.phases[1], tasks: [{ task: "E2E", role: "QA", hours: 8 }] },
      ],
    })!;
    expect(plan.totalHours).toBe(18.5);
  });

  it("clamps silly numbers and defaults bad confidence", () => {
    const plan = normalisePlan({
      ...raw,
      confidence: "certain",
      phases: [{ name: "X", startDay: -5, durationDays: 9999, tasks: [{ task: "t", hours: -3 }] }],
    })!;
    expect(plan.confidence).toBe("medium");
    expect(plan.phases[0].startDay).toBe(0);
    expect(plan.phases[0].durationDays).toBe(120);
    expect(plan.phases[0].tasks[0].hours).toBe(0.5);
    expect(plan.phases[0].tasks[0].role).toBe("Backend");
  });

  it("returns null when there are no phases", () => {
    expect(normalisePlan({ title: "x", phases: [] })).toBeNull();
    expect(normalisePlan("nope")).toBeNull();
  });
});

describe("normalisePlan limits and normalisation", () => {
  const task = (over: Record<string, unknown> = {}) => ({ task: "t", role: "QA", hours: 1, ...over });
  const phase = (over: Record<string, unknown> = {}) => ({ name: "P", goal: "g", startDay: 0, durationDays: 1, tasks: [task()], ...over });
  const plan = (over: Record<string, unknown> = {}) => normalisePlan({ title: "T", phases: [phase()], ...over })!;

  it("returns null for non-object input and non-array phases", () => {
    for (const bad of [null, undefined, 5, "x", true]) expect(normalisePlan(bad)).toBeNull();
    expect(normalisePlan({ phases: "nope" })).toBeNull();
    expect(normalisePlan({ phases: { length: 2 } })).toBeNull();
  });

  it("caps phases, tasks, assumptions and risks", () => {
    const p = plan({
      phases: Array.from({ length: 15 }, () => phase({ tasks: Array.from({ length: 20 }, () => task()) })),
      assumptions: Array.from({ length: 10 }, (_, i) => `a${i}`),
      risks: Array.from({ length: 10 }, (_, i) => `r${i}`),
    });
    expect(p.phases).toHaveLength(10);
    expect(p.phases[0].tasks).toHaveLength(12);
    expect(p.assumptions).toHaveLength(6);
    expect(p.risks).toHaveLength(6);
  });

  it("caps string lengths", () => {
    const p = plan({
      title: "t".repeat(500),
      summary: "s".repeat(1000),
      assumptions: ["a".repeat(400)],
      risks: ["r".repeat(400)],
      phases: [phase({ name: "n".repeat(100), goal: "g".repeat(500), tasks: [task({ task: "x".repeat(300), role: "R".repeat(100) })] })],
    });
    expect(p.title).toHaveLength(100);
    expect(p.summary).toHaveLength(600);
    expect(p.assumptions[0]).toHaveLength(300);
    expect(p.risks[0]).toHaveLength(300);
    expect(p.phases[0].name).toHaveLength(60);
    expect(p.phases[0].goal).toHaveLength(240);
    expect(p.phases[0].tasks[0].task).toHaveLength(200);
    expect(p.phases[0].tasks[0].role).toBe("Backend");
  });

  it("trims strings and drops empty list items", () => {
    const p = plan({ title: "  Hi  ", assumptions: ["  a ", "", "   ", 5], phases: [phase({ name: "  N ", goal: " G ", tasks: [task({ task: "  do it  " })] })] });
    expect(p.title).toBe("Hi");
    expect(p.assumptions).toEqual(["a"]);
    expect(p.phases[0].name).toBe("N");
    expect(p.phases[0].goal).toBe("G");
    expect(p.phases[0].tasks[0].task).toBe("do it");
  });

  it("drops tasks with an empty name", () => {
    const p = plan({ phases: [phase({ tasks: [task({ task: "" }), task({ task: "   " }), task({ task: undefined }), null, task({ task: "keep" })] })] });
    expect(p.phases[0].tasks.map((t) => t.task)).toEqual(["keep"]);
  });

  it("tolerates a phase with no tasks array or a null phase", () => {
    const p = plan({ phases: [null, phase({ tasks: "x" })] });
    expect(p.phases).toHaveLength(2);
    expect(p.phases[0].name).toBe("Phase");
    expect(p.phases[0].tasks).toEqual([]);
  });

  it.each([[0, 0.5], [0.2, 0.5], [1.2, 1], [1.3, 1.5], [2.74, 2.5], [400, 400], [401, 400], ["abc", 0.5], [Infinity, 0.5]])(
    "hours %j -> %j",
    (hours, expected) => {
      expect(plan({ phases: [phase({ tasks: [task({ hours })] })] }).phases[0].tasks[0].hours).toBe(expected);
    },
  );

  it("clamps startDay to 0..365 and durationDays to 0.5..120", () => {
    const a = plan({ phases: [phase({ startDay: -1, durationDays: 0 })] }).phases[0];
    expect([a.startDay, a.durationDays]).toEqual([0, 0.5]);
    const b = plan({ phases: [phase({ startDay: 1000, durationDays: 500 })] }).phases[0];
    expect([b.startDay, b.durationDays]).toEqual([365, 120]);
  });

  it("computes exact totals, max end day, and at least 1 calendar week", () => {
    const p = plan({
      phases: [
        phase({ startDay: 0, durationDays: 3, tasks: [task({ hours: 1.5 }), task({ hours: 2 })] }),
        phase({ startDay: 10, durationDays: 5, tasks: [task({ hours: 4 })] }),
        phase({ startDay: 2, durationDays: 2, tasks: [] }),
      ],
    });
    expect(p.totalHours).toBe(7.5);
    expect(p.totalDays).toBe(15);
    expect(p.calendarWeeks).toBe(3);
    const small = plan({ phases: [phase({ startDay: 0, durationDays: 1 })] });
    expect(small.calendarWeeks).toBe(1);
  });

  it("falls back for title and confidence", () => {
    const p = normalisePlan({ title: "   ", phases: [phase()] })!;
    expect(p.title).toBe("Delivery plan");
    expect(p.confidence).toBe("medium");
    expect(plan({ confidence: "low" }).confidence).toBe("low");
    expect(plan({ confidence: "HIGH" }).confidence).toBe("medium");
  });

  it.each([
    ["backend", "Backend"], ["Dev Ops", "DevOps"], ["devops", "DevOps"], ["DEV-OPS", "DevOps"], ["front_end", "Frontend"],
    ["Front End", "Frontend"], ["qa", "QA"], ["Tester", "QA"], ["QA Engineer", "QA"], ["Quality Assurance", "QA"],
    ["Business Analyst", "BA"], ["analyst", "BA"], ["ba", "BA"], ["architect", "Architect"], ["Solution Architect", "Architect"],
    ["Project Manager", "PM"], ["Product Manager", "PM"], ["pm", "PM"], ["Frontend Developer", "Frontend"], ["UI", "Frontend"],
    ["Backend Developer", "Backend"], ["Back End", "Backend"], ["API", "Backend"], ["Ops", "DevOps"], ["SRE", "DevOps"],
    ["Infrastructure", "DevOps"], ["Wizard", "Backend"], ["", "Backend"], [undefined, "Backend"], [42, "Backend"],
    ["constructor", "Backend"], ["__proto__", "Backend"], ["toString", "Backend"], ["hasOwnProperty", "Backend"],
  ])("role %j -> %s", (role, expected) => {
    const p = plan({ phases: [phase({ tasks: [task({ role })] })] });
    expect(p.phases[0].tasks[0].role).toBe(expected);
  });
});
