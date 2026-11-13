export const SENIORITY = ["junior", "mid", "senior", "mixed"] as const;
export type Seniority = (typeof SENIORITY)[number];

export const ROLES = ["BA", "Architect", "Backend", "Frontend", "QA", "DevOps", "PM"] as const;

export type Role = (typeof ROLES)[number];

const roleKey = (v: string) => v.toLowerCase().replace(/[\s_-]+/g, "");

const ROLE_ALIASES: Record<string, Role> = {
  ...Object.fromEntries(ROLES.map((r) => [roleKey(r), r])),
  tester: "QA",
  qaengineer: "QA",
  qualityassurance: "QA",
  businessanalyst: "BA",
  analyst: "BA",
  solutionarchitect: "Architect",
  projectmanager: "PM",
  productmanager: "PM",
  frontenddeveloper: "Frontend",
  ui: "Frontend",
  backenddeveloper: "Backend",
  api: "Backend",
  ops: "DevOps",
  sre: "DevOps",
  infrastructure: "DevOps",
};

/** Map the model's free-text role onto the fixed ROLES list; unknown or empty becomes Backend. */
export function normaliseRole(v: unknown): Role {
  const key = roleKey(str(v, 60));
  // Own keys only, so "constructor" or "__proto__" can't return an Object.prototype member.
  return Object.hasOwn(ROLE_ALIASES, key) ? ROLE_ALIASES[key] : "Backend";
}

export const FEATURE_MIN = 20;
export const FEATURE_MAX = 1500;

/**
 * Remove anything that looks like a <feature> or </feature> tag (any case, spacing or attributes),
 * repeating until stable so nested tricks like "</fea</feature>ture>" can't rebuild one.
 */
export function stripFeatureTags(text: string) {
  const tag = /<\s*\/?\s*feature\b[^>]*>/gi;
  let out = text;
  for (let prev = ""; prev !== out; ) {
    prev = out;
    out = out.replace(tag, "");
  }
  return out;
}

/**
 * Output cap per model request. Haiku is cheap enough to give thinking plus a long plan room (8000);
 * pricier models get a lower cap so the worst case under the daily cap stays bounded.
 */
export function maxTokensFor(model: string) {
  return model.includes("haiku") ? 8000 : 4000;
}

export type EstimateRequest = {
  feature: string;
  teamSize: number;
  seniority: Seniority;
  token: string;
};

export type Task = { task: string; role: string; hours: number };
export type Phase = {
  name: string;
  goal: string;
  startDay: number;
  durationDays: number;
  tasks: Task[];
};
export type Plan = {
  title: string;
  summary: string;
  assumptions: string[];
  phases: Phase[];
  risks: string[];
  confidence: "low" | "medium" | "high";
  totalHours: number;
  totalDays: number;
  calendarWeeks: number;
};

export function validateRequest(body: unknown): { ok: true; value: EstimateRequest } | { ok: false; error: string } {
  if (!body || typeof body !== "object") return { ok: false, error: "Send a JSON body with feature, teamSize and seniority." };
  const b = body as Record<string, unknown>;
  const feature = typeof b.feature === "string" ? b.feature.trim() : "";
  if (feature.length < FEATURE_MIN) return { ok: false, error: `Describe the feature in at least ${FEATURE_MIN} characters.` };
  if (feature.length > FEATURE_MAX) return { ok: false, error: `Keep the description under ${FEATURE_MAX} characters.` };
  // With the u flag this matches only unpaired surrogates: broken text the model API may reject.
  if (/[\uD800-\uDFFF]/u.test(feature)) return { ok: false, error: "The description contains characters that can't be read. Retype it and try again." };
  const teamSize = b.teamSize;
  if (typeof teamSize !== "number" || !Number.isInteger(teamSize) || teamSize < 1 || teamSize > 12) return { ok: false, error: "Team size must be between 1 and 12." };
  const seniority = b.seniority as Seniority;
  if (!SENIORITY.includes(seniority)) return { ok: false, error: "Pick a seniority level." };
  const token = typeof b.token === "string" ? b.token : "";
  if (!token) return { ok: false, error: "Complete the human check, then try again." };
  return { ok: true, value: { feature, teamSize, seniority, token } };
}

export const str = (v: unknown, max = 400) => (typeof v === "string" ? v.trim().slice(0, max) : "");
const num = (v: unknown, min: number, max: number) => {
  const n = Number(v);
  if (!Number.isFinite(n)) return min;
  return Math.min(max, Math.max(min, Math.round(n * 2) / 2));
};
const strList = (v: unknown, limit: number) =>
  Array.isArray(v) ? v.map((x) => str(x, 300)).filter(Boolean).slice(0, limit) : [];

/** Turn whatever the model returned into a safe, consistent Plan. Totals are computed here, not trusted. */
export function normalisePlan(raw: unknown): Plan | null {
  if (!raw || typeof raw !== "object") return null;
  const r = raw as Record<string, unknown>;
  if (!Array.isArray(r.phases) || r.phases.length === 0) return null;

  const phases: Phase[] = r.phases.slice(0, 10).map((p) => {
    const ph = (p ?? {}) as Record<string, unknown>;
    const tasks = Array.isArray(ph.tasks)
      ? ph.tasks.slice(0, 12).map((t) => {
          const tk = (t ?? {}) as Record<string, unknown>;
          return { task: str(tk.task, 200), role: normaliseRole(tk.role), hours: num(tk.hours, 0.5, 400) };
        }).filter((t) => t.task)
      : [];
    return {
      name: str(ph.name, 60) || "Phase",
      goal: str(ph.goal, 240),
      startDay: num(ph.startDay, 0, 365),
      durationDays: num(ph.durationDays, 0.5, 120),
      tasks,
    };
  });

  const totalHours = phases.reduce((s, p) => s + p.tasks.reduce((a, t) => a + t.hours, 0), 0);
  // No usable task anywhere (e.g. the model used another key for task names): not a plan.
  if (totalHours === 0) return null;
  const totalDays = Math.max(...phases.map((p) => p.startDay + p.durationDays));
  const confidence = r.confidence === "low" || r.confidence === "high" ? r.confidence : "medium";

  return {
    title: str(r.title, 100) || "Delivery plan",
    summary: str(r.summary, 600),
    assumptions: strList(r.assumptions, 6),
    phases,
    risks: strList(r.risks, 6),
    confidence,
    // Task hours are in 0.5 steps, so the sum is exact. Not rounded, so it always equals the
    // phase subtotals and role totals the UI shows.
    totalHours,
    totalDays,
    calendarWeeks: Math.max(1, Math.round((totalDays / 5) * 10) / 10),
  };
}
