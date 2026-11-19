"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import {
  FEATURE_MAX,
  FEATURE_MIN,
  MODES,
  SENIORITY,
  type Plan,
  type Mode,
  type Seniority,
} from "@/lib/estimate";
import {
  formatWait,
  isObj,
  isPlan,
  parseRetryAfter,
} from "@/lib/estimatorClient";
import { estimatorBriefs, estimatorCopy, estimatorExamples, profile } from "@/lib/content";
import { sampleFeature, samplePlan, sampleTeam } from "@/lib/samplePlan";
import { pickRandom } from "@/lib/pick";
import { ExternalLink } from "@/components/ExternalLink";
import { Turnstile, type TurnstileHandle } from "./Turnstile";
import { PhaseTimeline } from "./PhaseTimeline";
import { TaskTable } from "./TaskTable";
import { ResultsBoundary } from "./ResultsBoundary";
import { ResultTabs } from "./ResultTabs";
import { BudgetView } from "./BudgetView";
import type { Team } from "@/lib/budget";

type Status =
  | { kind: "idle" }
  | { kind: "submitting" }
  | { kind: "success"; plan: Plan; teamLabel: string; team: Team; example?: true }
  | { kind: "error"; message: string; status: number };

const exampleStatus: Status = {
  kind: "success",
  plan: samplePlan,
  teamLabel: `${estimatorCopy.people(sampleTeam.size)}, ${sampleTeam.seniority}`,
  team: sampleTeam,
  example: true,
};

type Success = Extract<Status, { kind: "success" }>;

/** Visual-only progress line; the status line announces `planning` once, so this is aria-hidden by its parent. */
function PlanningStep() {
  const [i, setI] = useState(0);
  useEffect(() => {
    const id = setInterval(() => setI((n) => (n + 1) % estimatorCopy.steps.length), 2500);
    return () => clearInterval(id);
  }, []);
  return <p className="estimator__step">{estimatorCopy.steps[i]}</p>;
}

type Tab = "phases" | "tasks" | "budget";

type Chip = { label: string; text: string };

/** Two short examples, then one detailed brief that shows only its title. */
function pickChips(short: string[], brief: { title: string; text: string }): Chip[] {
  return [...short.map((text) => ({ label: text, text })), { label: estimatorCopy.briefChip(brief.title), text: brief.text }];
}

/**
 * The live AI demo. Spec: docs/03-estimator-spec.md.
 */
export function Estimator() {
  const [feature, setFeature] = useState("");
  const [teamSize, setTeamSize] = useState(4);
  const [seniority, setSeniority] = useState<Seniority>("mixed");
  const [mode, setMode] = useState<Mode>("traditional");
  // The page is static, so the server always renders the first three; the shuffle happens after hydration.
  const [examples, setExamples] = useState<Chip[] | null>(null);
  useEffect(() => setExamples(pickChips(pickRandom(estimatorExamples, 2), pickRandom(estimatorBriefs, 1)[0])), []);
  const [token, setToken] = useState<string | null>(null);
  const [status, setStatus] = useState<Status>(exampleStatus);
  // The last successful plan stays on screen under an error banner.
  const [lastOk, setLastOk] = useState<Success>(exampleStatus as Success);
  const [tab, setTab] = useState<Tab>("phases");
  const [cooldown, setCooldown] = useState(0);
  const turnstile = useRef<TurnstileHandle>(null);
  const heading = useRef<HTMLHeadingElement>(null);
  const bannerEl = useRef<HTMLDivElement>(null);
  const textarea = useRef<HTMLTextAreaElement>(null);
  const resultsEl = useRef<HTMLElement>(null);
  const focusField = useRef(false);
  const abortRef = useRef<AbortController | null>(null);
  // Focus moves to the results only after a user action, never for the example shown on load.
  const acted = useRef(false);

  // Abort any in-flight request on unmount.
  useEffect(() => () => abortRef.current?.abort(), []);

  const onToken = useCallback((t: string | null) => setToken(t), []);

  // One-second countdown after a 429; the timer is cleared on every change and on unmount.
  useEffect(() => {
    if (cooldown <= 0) return;
    const id = setTimeout(() => setCooldown((c) => c - 1), 1000);
    return () => clearTimeout(id);
  }, [cooldown]);

  useEffect(() => {
    if (!acted.current) return;
    // Returning to the stored example (typing after a field error) must not pull focus out of the field.
    if (status.kind === "success" && !status.example) heading.current?.focus();
    else if (status.kind === "error") {
      // 400 is shown inline: focus the field it describes. Other errors: the banner.
      if (status.status === 400) textarea.current?.focus();
      else bannerEl.current?.focus();
    }
  }, [status]);

  // Phones and tablets: the results sit below the form. Scroll after the render, since it removes the preview
  // link above. Desktop (the 1025px split in globals.css) keeps them beside the form, so no jump there.
  useEffect(() => {
    if (status.kind !== "submitting" || window.matchMedia("(min-width: 1025px)").matches) return;
    resultsEl.current?.scrollIntoView({
      block: "start",
      behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth",
    });
  }, [status.kind]);

  // After a chip fills the field: caret at the end, ready to type or submit.
  useEffect(() => {
    const el = textarea.current;
    if (!focusField.current || !el) return;
    focusField.current = false;
    el.focus();
    el.setSelectionRange(el.value.length, el.value.length);
  }, [feature]);

  const length = feature.trim().length;
  const tooShort = length < FEATURE_MIN;
  const submitting = status.kind === "submitting";
  const canSubmit =
    !tooShort &&
    length <= FEATURE_MAX &&
    !!token &&
    !submitting &&
    cooldown === 0;
  const canRetry = !!token && !submitting;

  async function run() {
    abortRef.current?.abort();
    const controller = new AbortController();
    abortRef.current = controller;
    acted.current = true;
    setStatus({ kind: "submitting" });
    // Focus the results before the fieldset disables, so focus isn't lost; the scroll waits for the render below.
    resultsEl.current?.focus({ preventScroll: true });
    const fail = (code: number, message: string) =>
      setStatus({ kind: "error", message, status: code });
    try {
      const res = await fetch("/api/estimate", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ feature, teamSize, seniority, mode, token }),
        signal: controller.signal,
      });
      let data: unknown = null;
      try {
        data = await res.json();
      } catch {
        // Non-JSON body (e.g. an HTML 504 page): fall back to status-based copy below.
      }
      const serverError =
        isObj(data) && typeof data.error === "string" && data.error
          ? data.error
          : null;
      if (!res.ok) {
        const fallback =
          estimatorCopy.fallback[res.status] ?? estimatorCopy.fallback.other;
        if (res.status === 429)
          setCooldown(parseRetryAfter(res.headers.get("Retry-After")));
        fail(res.status, serverError ?? fallback);
      } else if (!isObj(data) || !isPlan(data.plan)) {
        fail(502, estimatorCopy.badPlan);
      } else {
        const teamLabel = `${estimatorCopy.people(teamSize)}, ${seniority}${mode === "ai-assisted" ? estimatorCopy.mode.teamSuffix : ""}`;
        const ok: Success = { kind: "success", plan: data.plan, teamLabel, team: { size: teamSize, seniority, mode } };
        setLastOk(ok);
        setStatus(ok);
        setTab("phases");
      }
    } catch (err) {
      if (err instanceof DOMException && err.name === "AbortError") return;
      fail(0, estimatorCopy.networkError);
    } finally {
      // Turnstile tokens are single-use.
      turnstile.current?.reset();
    }
  }

  function submit(e: React.FormEvent) {
    e.preventDefault();
    if (canSubmit) void run();
  }

  const fieldError =
    status.kind === "error" && status.status === 400 ? status.message : null;
  const banner =
    status.kind === "error" && status.status !== 400 ? status : null;
  const shown = status.kind === "success" ? status : status.kind === "error" ? lastOk : null;
  const retryable =
    banner &&
    (banner.status === 0 || banner.status === 502 || banner.status === 504);

  return (
    <div className="estimator">
      <form
        onSubmit={submit}
        className="estimator__form"
        aria-busy={submitting}
      >
        {/* Phones only (hidden in CSS once results sit beside the form): the example is below the whole form. */}
        {shown?.example && (
          <a className="estimator__preview" href="#estimator-results">
            {estimatorCopy.example.preview(
              samplePlan.title,
              estimatorCopy.summary.hoursValue(samplePlan.totalHours),
              estimatorCopy.summary.weeksValue(samplePlan.calendarWeeks),
            )}
          </a>
        )}
        <fieldset className="estimator__lock" disabled={submitting}>
          <div
            className="estimator__examples"
            role="group"
            aria-label="Example features"
            data-ready={examples ? "" : undefined}
          >
            {(examples ?? pickChips(estimatorExamples.slice(0, 2), estimatorBriefs[0])).map((ex) => (
              <button
                key={ex.text}
                type="button"
                className="estimator__chip"
                onClick={() => {
                  focusField.current = true;
                  setFeature(ex.text);
                }}
              >
                {ex.label}
              </button>
            ))}
          </div>

          <div className="estimator__field">
            <label htmlFor="feature" className="estimator__label">
              Feature description
            </label>
            <textarea
              ref={textarea}
              id="feature"
              className="estimator__textarea"
              value={feature}
              onChange={(e) => {
                setFeature(e.target.value);
                if (fieldError) {
                  acted.current = false; // restoring the plan must not steal focus from the field
                  setStatus(lastOk);
                }
              }}
              maxLength={FEATURE_MAX}
              rows={4}
              aria-describedby={
                fieldError ? "feature-count feature-error" : "feature-count"
              }
              aria-invalid={fieldError ? true : undefined}
            />
            {fieldError && (
              <p
                id="feature-error"
                role="alert"
                data-status={400}
                className="estimator__error"
              >
                {fieldError}
              </p>
            )}
            <p
              id="feature-count"
              className="estimator__count"
              data-warn={length > 0 && tooShort}
            >
              {length} / {FEATURE_MAX}
              <span aria-live="polite">
                {/* Shown from the start, so the disabled submit button has a stated reason. */}
                {tooShort ? estimatorCopy.atLeast(FEATURE_MIN) : ""}
              </span>
            </p>
          </div>

          <div className="estimator__field">
            <div className="estimator__row">
              <label htmlFor="team-size" className="estimator__label">
                Team size
              </label>
              <output htmlFor="team-size" className="estimator__readout">
                {teamSize}
              </output>
            </div>
            <input
              id="team-size"
              className="estimator__slider"
              type="range"
              min={1}
              max={12}
              value={teamSize}
              onChange={(e) => setTeamSize(Number(e.target.value))}
              aria-valuetext={estimatorCopy.people(teamSize)}
            />
          </div>

          <fieldset className="estimator__seniority" disabled={submitting}>
            <legend className="estimator__label">Seniority</legend>
            <div className="estimator__segments">
              {SENIORITY.map((s) => (
                <label key={s} className="estimator__segment">
                  <input
                    type="radio"
                    name="seniority"
                    value={s}
                    checked={seniority === s}
                    onChange={() => setSeniority(s)}
                  />
                  <span>{s}</span>
                </label>
              ))}
            </div>
          </fieldset>

          <fieldset className="estimator__seniority" disabled={submitting}>
            <legend className="estimator__label">{estimatorCopy.mode.legend}</legend>
            <div className="estimator__segments estimator__segments--two">
              {MODES.map((m) => (
                <label key={m} className="estimator__segment">
                  <input
                    type="radio"
                    name="mode"
                    value={m}
                    checked={mode === m}
                    onChange={() => setMode(m)}
                  />
                  <span>{estimatorCopy.mode.options[m]}</span>
                </label>
              ))}
            </div>
          </fieldset>

          <Turnstile ref={turnstile} onToken={onToken} />

          <button type="submit" disabled={!canSubmit}>
            {cooldown > 0
              ? estimatorCopy.waitLabel(formatWait(cooldown))
              : estimatorCopy.submit}
          </button>
          {/* The human check runs hidden, so say why submit is still disabled once the text is ready. */}
          {!tooShort && !token && !submitting && (
            <p className="estimator__model-note">{estimatorCopy.retryWaiting}</p>
          )}
          <p className="estimator__model-note">{estimatorCopy.modelNote}</p>
        </fieldset>
      </form>

      <section
        ref={resultsEl}
        tabIndex={-1}
        id="estimator-results"
        className="estimator__results"
        aria-label="Estimate results"
        aria-busy={submitting}
      >
        <p role="status" className="estimator__status">
          {submitting ? estimatorCopy.planning : ""}
        </p>

        {submitting && (
          <div className="estimator__skeleton" aria-hidden="true">
            <PlanningStep />
            <p className="estimator__status">{estimatorCopy.usuallyWait}</p>
            <span className="estimator__bone estimator__bone--title" />
            <div className="estimator__skeleton-cards">
              {[0, 1, 2, 3].map((n) => (
                <span key={n} className="estimator__bone estimator__bone--card" />
              ))}
            </div>
            {[70, 45, 80, 60, 35].map((w, n) => (
              <span key={n} className="estimator__bone estimator__bone--bar" style={{ width: `${w}%` }} />
            ))}
          </div>
        )}

        {banner && (
          <div
            ref={bannerEl}
            tabIndex={-1}
            role="alert"
            data-status={banner.status}
            data-tone={banner.status === 429 ? "warn" : "error"}
            className="estimator__banner"
          >
            <p>{banner.message}</p>
            {retryable && (
              <button
                type="button"
                onClick={() => void run()}
                disabled={!canRetry}
              >
                {canRetry ? estimatorCopy.retry : estimatorCopy.retryWaiting}
              </button>
            )}
          </div>
        )}

        {shown && (
          <ResultsBoundary resetKey={shown.plan}>
            {/* shown.* below: an error banner keeps the last good plan on screen */}
            {shown.example && (
              <p id="estimator-example-note" className="estimator__example-note">
                {estimatorCopy.example.note(sampleFeature)}
              </p>
            )}
            {/* Focus lands on the heading, so the example line above it is announced as its description. */}
            <h3
              ref={heading}
              tabIndex={-1}
              aria-describedby={shown.example ? "estimator-example-note" : undefined}
            >
              {shown.plan.title}
            </h3>
            <p>{shown.plan.summary}</p>
            <ResultTabs
              label={estimatorCopy.tabsLabel}
              value={tab}
              onChange={setTab}
              tabs={[
                {
                  key: "phases",
                  label: estimatorCopy.tabPhases,
                  content: (
                    <PhaseTimeline
                      plan={shown.plan}
                      teamLabel={shown.teamLabel}
                    />
                  ),
                },
                {
                  key: "tasks",
                  label: estimatorCopy.tabTasks,
                  content: <TaskTable plan={shown.plan} />,
                },
                {
                  key: "budget",
                  label: estimatorCopy.tabBudget,
                  content: <BudgetView plan={shown.plan} team={shown.team} />,
                },
              ]}
            />
            <p className="estimator__cta">
              {estimatorCopy.cta.text}
              <a href={`mailto:${profile.email}`}>{estimatorCopy.cta.email}</a>
              <ExternalLink href={profile.linkedin}>{estimatorCopy.cta.linkedin}</ExternalLink>
            </p>
            <p className="estimator__note">
              {shown.example
                ? estimatorCopy.example.footer
                : estimatorCopy.footerNote}
            </p>
          </ResultsBoundary>
        )}
      </section>
    </div>
  );
}
