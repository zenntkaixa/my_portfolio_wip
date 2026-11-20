import { buildPlan } from "@/lib/estimateModel";

export const SENIORITY = ["junior", "mid", "senior", "mixed"] as const;
export type Seniority = (typeof SENIORITY)[number];
export const MODES = ["traditional", "ai-assisted"] as const;
export type Mode = (typeof MODES)[number];

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
  mode: Mode;
  token: string;
};

/** Task categories. Code applies the AI band only to the agent-friendly ones (lib/estimateModel.ts). */
export const CATEGORIES = ["discovery", "design", "code", "tests", "docs-config", "integration", "security", "uat", "release"] as const;
export type Category = (typeof CATEGORIES)[number];
/** What the description states; confidence counts the true ones. */
export const FACTS = ["users", "systems", "data", "integrations", "limits", "outOfScope"] as const;
export type Fact = (typeof FACTS)[number];
export type Confidence = "low" | "medium" | "high";
export type CostItem = { item: string; kind: "one-off" | "monthly"; low: number; high: number };

/** The model's output after normaliseScope: the work, independent of seniority and working style. */
export type ScopeTask = { task: string; role: string; category: Category; baseHours: number };
export type ScopePhase = { name: string; goal: string; startDay: number; durationDays: number; tasks: ScopeTask[] };
export type Scope = {
  title: string;
  summary: string;
  assumptions: string[];
  phases: ScopePhase[];
  risks: string[];
  facts: Record<Fact, boolean>;
  /** Tools and running costs in MYR, as ranges. People cost is calculated in lib/budget.ts. */
  costs: CostItem[];
  openQuestions: string[];
  outOfScope: string[];
};

/** A built plan (buildPlan in lib/estimateModel.ts): hours adjusted for seniority and working style. */
export type Task = { task: string; role: string; category: Category; hours: number };
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
  confidence: Confidence;
  /** Facts the description left out, in FACTS order. */
  missingFacts: Fact[];
  /** Effort range in hours; likely equals totalHours. */
  effort: { best: number; likely: number; worst: number };
  costs: CostItem[];
  /** Up to 3 questions a BA would ask the requester before committing. */
  openQuestions?: string[];
  /** Up to 3 things this plan deliberately leaves out (the deferred parts of an MVP slice). */
  outOfScope?: string[];
  totalHours: number;
  totalDays: number;
  calendarWeeks: number;
  /** Set when capacity made the calendar longer than the model's proposed phases. */
  calendarAdjusted?: true;
};

/** Longest plan the client shows (400 weeks). */
export const MAX_PLAN_DAYS = 2000;
export { HOURS_PER_DAY } from "@/lib/estimateModel";

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
  // Missing means traditional, so older clients keep working.
  const mode = (b.mode === undefined ? "traditional" : b.mode) as Mode;
  if (!MODES.includes(mode)) return { ok: false, error: "Pick a working style." };
  const token = typeof b.token === "string" ? b.token : "";
  if (!token) return { ok: false, error: "Complete the human check, then try again." };
  return { ok: true, value: { feature, teamSize, seniority, mode, token } };
}

export const str = (v: unknown, max = 400) => (typeof v === "string" ? v.trim().slice(0, max) : "");
const num = (v: unknown, min: number, max: number) => {
  const n = Number(v);
  if (!Number.isFinite(n)) return min;
  return Math.min(max, Math.max(min, Math.round(n * 2) / 2));
};
const strList = (v: unknown, limit: number) =>
  Array.isArray(v) ? v.map((x) => str(x, 300)).filter(Boolean).slice(0, limit) : [];

const COST_MAX = 200_000;
/** Up to 8 cost items; invalid ones are dropped, values clamped to 0..200,000 and ordered low to high. */
function normaliseCosts(v: unknown): CostItem[] {
  if (!Array.isArray(v)) return [];
  return v.slice(0, 8).flatMap((c) => {
    const o = (c ?? {}) as Record<string, unknown>;
    const item = str(o.item, 80);
    const a = Number(o.low);
    const b = Number(o.high);
    if (!item || !Number.isFinite(a) || !Number.isFinite(b)) return [];
    const [low, high] = [a, b].map((n) => Math.round(Math.min(COST_MAX, Math.max(0, n)))).sort((x, y) => x - y);
    return [{ item, kind: o.kind === "one-off" ? "one-off" : "monthly", low, high } as CostItem];
  });
}

const normaliseCategory = (v: unknown): Category =>
  // Unknown counts as integration: no AI reduction, so a bad label never shrinks the estimate.
  CATEGORIES.includes(v as Category) ? (v as Category) : "integration";

/**
 * Turn whatever the model returned into a safe Scope: strings trimmed, numbers clamped, lists capped.
 * Null when there is no usable task, or when the slowest build of it (junior, traditional) for this
 * team is longer than MAX_PLAN_DAYS.
 */
export function normaliseScope(raw: unknown, teamSize: number): Scope | null {
  if (!raw || typeof raw !== "object") return null;
  const r = raw as Record<string, unknown>;
  if (!Array.isArray(r.phases) || r.phases.length === 0) return null;

  const phases: ScopePhase[] = r.phases.slice(0, 10).map((p) => {
    const ph = (p ?? {}) as Record<string, unknown>;
    const tasks = Array.isArray(ph.tasks)
      ? ph.tasks.slice(0, 12).map((t) => {
          const tk = (t ?? {}) as Record<string, unknown>;
          return { task: str(tk.task, 200), role: normaliseRole(tk.role), category: normaliseCategory(tk.category), baseHours: num(tk.baseHours, 0.5, 400) };
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
  // No usable task anywhere (e.g. the model used another key for task names): not a plan.
  if (!phases.some((p) => p.tasks.length)) return null;

  const f = (r.facts ?? {}) as Record<string, unknown>;
  const scope: Scope = {
    title: str(r.title, 100) || "Delivery plan",
    summary: str(r.summary, 600),
    assumptions: strList(r.assumptions, 6),
    phases,
    risks: strList(r.risks, 6),
    facts: Object.fromEntries(FACTS.map((k) => [k, f[k] === true])) as Record<Fact, boolean>,
    costs: normaliseCosts(r.costs),
    openQuestions: strList(r.openQuestions, 3),
    outOfScope: strList(r.outOfScope, 3),
  };
  // A plan this long can't be shown (the client caps 2000 days / 400 weeks), so it is not a usable plan.
  // Check the slowest build: junior, in whichever mode takes longer (AI adds review tasks).
  if (MODES.some((mode) => buildPlan(scope, { teamSize, seniority: "junior", mode }).totalDays > MAX_PLAN_DAYS)) return null;
  return scope;
}
