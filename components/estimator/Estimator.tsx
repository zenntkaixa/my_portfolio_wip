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
import { estimatorBriefs, estimatorCopy, estimatorExamples } from "@/lib/content";
import { sampleFeature, samplePlan, sampleTeam } from "@/lib/samplePlan";
import { pickRandom } from "@/lib/pick";
import { Turnstile, type TurnstileHandle } from "./Turnstile";
import { PhaseTimeline } from "./PhaseTimeline";
import { TaskTable } from "./TaskTable";
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
  const [tab, setTab] = useState<Tab>("phases");
  const [cooldown, setCooldown] = useState(0);
  const turnstile = useRef<TurnstileHandle>(null);
  const heading = useRef<HTMLHeadingElement>(null);
  const bannerEl = useRef<HTMLDivElement>(null);
  const textarea = useRef<HTMLTextAreaElement>(null);
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
        setStatus({ kind: "success", plan: data.plan, teamLabel, team: { size: teamSize, seniority, mode } });
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
                onClick={() => setFeature(ex.text)}
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
                if (fieldError) setStatus(exampleStatus);
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
        className="estimator__results"
        aria-label="Estimate results"
        aria-busy={submitting}
      >
        <p role="status" className="estimator__status">
          {submitting ? estimatorCopy.planning : ""}
        </p>

        {submitting && (
          <div className="estimator__skeleton" aria-hidden="true">
            <span className="estimator__bone estimator__bone--title" />
            <span className="estimator__bone" />
            <span className="estimator__bone estimator__bone--short" />
            <span className="estimator__bone estimator__bone--block" />
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

        {status.kind === "success" && (
          <>
            {status.example && (
              <p id="estimator-example-note" className="estimator__example-note">
                {estimatorCopy.example.note(sampleFeature)}
              </p>
            )}
            {/* Focus lands on the heading, so the example line above it is announced as its description. */}
            <h3
              ref={heading}
              tabIndex={-1}
              aria-describedby={status.example ? "estimator-example-note" : undefined}
            >
              {status.plan.title}
            </h3>
            <p>{status.plan.summary}</p>
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
                      plan={status.plan}
                      teamLabel={status.teamLabel}
                    />
                  ),
                },
                {
                  key: "tasks",
                  label: estimatorCopy.tabTasks,
                  content: <TaskTable plan={status.plan} />,
                },
                {
                  key: "budget",
                  label: estimatorCopy.tabBudget,
                  content: <BudgetView plan={status.plan} team={status.team} />,
                },
              ]}
            />
            <p className="estimator__note">
              {status.example
                ? estimatorCopy.example.footer
                : estimatorCopy.footerNote}
            </p>
          </>
        )}
      </section>
    </div>
  );
}
