import { describe, expect, it } from "vitest";
import { maxTokensFor, stripFeatureTags, normaliseScope, validateRequest } from "@/lib/estimate";

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
    [{ ...valid, mode: "turbo" }, "working style"],
    [{ ...valid, mode: null }, "working style"],
    [{ ...valid, mode: "__proto__" }, "working style"],
    [{ ...valid, mode: ["ai-assisted"] }, "working style"],
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

  it("rejects unpaired surrogates but accepts emoji (paired surrogates)", () => {
    expect(validateRequest({ ...valid, feature: `${f(20)}\uD83D` }).ok).toBe(false);
    expect(validateRequest({ ...valid, feature: `${f(20)}\uDE00 tail` }).ok).toBe(false);
    expect(validateRequest({ ...valid, feature: `${f(20)} \u{1F600}` }).ok).toBe(true);
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

  it("defaults a missing mode to traditional and accepts ai-assisted", () => {
    const r = validateRequest(valid);
    expect(r.ok && r.value.mode).toBe("traditional");
    const ai = validateRequest({ ...valid, mode: "ai-assisted" });
    expect(ai.ok && ai.value.mode).toBe("ai-assisted");
  });

  it("ignores extra fields", () => {
    const r = validateRequest({ ...valid, admin: true, model: "x" });
    expect(r.ok && Object.keys(r.value).sort()).toEqual(["feature", "mode", "seniority", "teamSize", "token"]);
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

describe("normaliseScope limits and normalisation", () => {
  const task = (over: Record<string, unknown> = {}) => ({ task: "t", role: "QA", category: "tests", baseHours: 1, ...over });
  const phase = (over: Record<string, unknown> = {}) => ({ name: "P", goal: "g", startDay: 0, durationDays: 1, tasks: [task()], ...over });
  const scope = (over: Record<string, unknown> = {}) => normaliseScope({ title: "T", phases: [phase()], ...over }, 4)!;

  it("returns null for non-object input, no phases and non-array phases", () => {
    for (const bad of [null, undefined, 5, "x", true]) expect(normaliseScope(bad, 4)).toBeNull();
    expect(normaliseScope({ phases: [] }, 4)).toBeNull();
    expect(normaliseScope({ phases: "nope" }, 4)).toBeNull();
    expect(normaliseScope({ phases: { length: 2 } }, 4)).toBeNull();
  });

  it("ignores model totals and confidence; keeps only the scope keys", () => {
    const s = scope({ totalHours: 99999, confidence: "high", calendarAdjusted: true });
    expect(Object.keys(s).sort()).toEqual(["assumptions", "costs", "facts", "openQuestions", "outOfScope", "phases", "risks", "summary", "title"]);
  });

  it("caps phases, tasks, assumptions and risks", () => {
    const p = scope({
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
    const p = scope({
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
    const p = scope({ title: "  Hi  ", assumptions: ["  a ", "", "   ", 5], phases: [phase({ name: "  N ", goal: " G ", tasks: [task({ task: "  do it  " })] })] });
    expect(p.title).toBe("Hi");
    expect(p.assumptions).toEqual(["a"]);
    expect(p.phases[0].name).toBe("N");
    expect(p.phases[0].goal).toBe("G");
    expect(p.phases[0].tasks[0].task).toBe("do it");
  });

  it("drops tasks with an empty name and returns null when no phase has a usable task", () => {
    const p = scope({ phases: [phase({ tasks: [task({ task: "" }), task({ task: "   " }), task({ task: undefined }), null, task({ task: "keep" })] })] });
    expect(p.phases[0].tasks.map((t) => t.task)).toEqual(["keep"]);
    expect(normaliseScope({ phases: [phase({ tasks: [{ name: "wrong key", role: "QA", baseHours: 8 }] }), phase({ tasks: [] })] }, 4)).toBeNull();
  });

  it("tolerates a phase with no tasks array or a null phase", () => {
    const p = scope({ phases: [null, phase({ tasks: "x" }), phase()] });
    expect(p.phases).toHaveLength(3);
    expect(p.phases[0].name).toBe("Phase");
    expect(p.phases[0].tasks).toEqual([]);
  });

  it.each([[0, 0.5], [0.2, 0.5], [1.2, 1], [1.3, 1.5], [2.74, 2.5], [400, 400], [401, 400], ["abc", 0.5], [Infinity, 0.5]])(
    "baseHours %j -> %j",
    (baseHours, expected) => {
      expect(scope({ phases: [phase({ tasks: [task({ baseHours })] })] }).phases[0].tasks[0].baseHours).toBe(expected);
    },
  );

  it("ignores the old hours key", () => {
    expect(scope({ phases: [phase({ tasks: [{ task: "t", role: "QA", category: "code", hours: 40 }] })] }).phases[0].tasks[0].baseHours).toBe(0.5);
  });

  it("keeps known categories and maps unknown ones to integration (no AI reduction)", () => {
    const cats = ["discovery", "design", "code", "tests", "docs-config", "integration", "security", "uat", "release"];
    const p = scope({ phases: [phase({ tasks: [...cats, "Code", "magic", undefined].map((category) => task({ category })) })] });
    expect(p.phases[0].tasks.map((t) => t.category)).toEqual([...cats, "integration", "integration", "integration"]);
  });

  it("keeps the six facts as strict booleans, false when missing", () => {
    expect(scope({ facts: { users: true, systems: "yes", data: 1, integrations: true, extra: true } }).facts).toEqual({
      users: true, systems: false, data: false, integrations: true, limits: false, outOfScope: false,
    });
    expect(scope({ facts: null }).facts).toEqual({ users: false, systems: false, data: false, integrations: false, limits: false, outOfScope: false });
  });

  it("clamps startDay to 0..365 and durationDays to 0.5..120", () => {
    const a = scope({ phases: [phase({ startDay: -1, durationDays: 0 })] }).phases[0];
    expect([a.startDay, a.durationDays]).toEqual([0, 0.5]);
    const b = scope({ phases: [phase({ startDay: 1000, durationDays: 500 })] }).phases[0];
    expect([b.startDay, b.durationDays]).toEqual([365, 120]);
  });

  it("falls back for the title", () => {
    expect(scope({ title: "   " }).title).toBe("Delivery plan");
  });

  it("rejects a scope whose slowest build (junior) for this team is longer than the client can show (2000 days)", () => {
    const big = Array.from({ length: 10 }, (_, i) => phase({ name: `P${i}`, startDay: i, tasks: Array.from({ length: 12 }, () => task({ role: "Backend", category: "code", baseHours: 400 })) }));
    expect(normaliseScope({ phases: big }, 1)).toBeNull(); // 48,000 h x 1.3 / 6 h = 10,400 days
    expect(normaliseScope({ phases: big }, 8)).not.toBeNull(); // about 1,300 days
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
    expect(scope({ phases: [phase({ tasks: [task({ role })] })] }).phases[0].tasks[0].role).toBe(expected);
  });
});

describe("normaliseScope costs", () => {
  const base = { phases: [{ name: "Build", tasks: [{ task: "Do it", role: "Backend", category: "code", baseHours: 8 }] }] };

  it("keeps valid items, orders each range, clamps and drops bad ones", () => {
    const p = normaliseScope({
      ...base,
      costs: [
        { item: "Hosting", kind: "monthly", low: 300, high: 100 },
        { item: "Pen test", kind: "one-off", low: -50, high: 2e9 },
        { item: "Odd kind", kind: "weekly", low: 1.4, high: 2.6 },
        { item: "", kind: "monthly", low: 1, high: 2 },
        { item: "No numbers", kind: "monthly", low: "a", high: 5 },
        null,
      ],
    }, 4);
    expect(p?.costs).toEqual([
      { item: "Hosting", kind: "monthly", low: 100, high: 300 },
      { item: "Pen test", kind: "one-off", low: 0, high: 200_000 },
      { item: "Odd kind", kind: "monthly", low: 1, high: 3 },
    ]);
  });

  it("caps the list at 8 and treats a missing list as empty", () => {
    const many = Array.from({ length: 12 }, (_, i) => ({ item: `Item ${i}`, kind: "monthly", low: 1, high: 2 }));
    expect(normaliseScope({ ...base, costs: many }, 4)?.costs).toHaveLength(8);
    expect(normaliseScope(base, 4)?.costs).toEqual([]);
  });
});

describe("normaliseScope openQuestions and outOfScope", () => {
  const base = { phases: [{ name: "Build", tasks: [{ task: "Do it", role: "Backend", category: "code", baseHours: 8 }] }] };

  it("trims, drops empties and caps both lists at 3", () => {
    const p = normaliseScope({ ...base, openQuestions: [" q1 ", "", 5, "q2", "q3", "q4"], outOfScope: ["o".repeat(400), "b", "c", "d"] }, 4)!;
    expect(p.openQuestions).toEqual(["q1", "q2", "q3"]);
    expect(p.outOfScope).toHaveLength(3);
    expect(p.outOfScope[0]).toHaveLength(300);
  });

  it("defaults both to [] when missing or not a list", () => {
    expect(normaliseScope(base, 4)).toMatchObject({ openQuestions: [], outOfScope: [] });
    expect(normaliseScope({ ...base, openQuestions: "x", outOfScope: null }, 4)).toMatchObject({ openQuestions: [], outOfScope: [] });
  });
});
