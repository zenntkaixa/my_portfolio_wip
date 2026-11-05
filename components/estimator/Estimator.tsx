"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import {
  FEATURE_MAX,
  FEATURE_MIN,
  SENIORITY,
  type Plan,
  type Seniority,
} from "@/lib/estimate";
import {
  formatWait,
  isObj,
  isPlan,
  parseRetryAfter,
} from "@/lib/estimatorClient";
import { estimatorCopy, estimatorExamples } from "@/lib/content";
import { Turnstile, type TurnstileHandle } from "./Turnstile";
import { PhaseTimeline } from "./PhaseTimeline";
import { TaskTable } from "./TaskTable";
import { ResultTabs } from "./ResultTabs";

type Status =
  | { kind: "idle" }
  | { kind: "submitting" }
  | { kind: "success"; plan: Plan; teamLabel: string }
  | { kind: "error"; message: string; status: number };

type Tab = "phases" | "tasks";

/**
 * The live AI demo. Spec: docs/03-estimator-spec.md.
 */
export function Estimator() {
  const [feature, setFeature] = useState("");
  const [teamSize, setTeamSize] = useState(4);
  const [seniority, setSeniority] = useState<Seniority>("mixed");
  const [token, setToken] = useState<string | null>(null);
  const [status, setStatus] = useState<Status>({ kind: "idle" });
  const [tab, setTab] = useState<Tab>("phases");
  const [cooldown, setCooldown] = useState(0);
  const turnstile = useRef<TurnstileHandle>(null);
  const heading = useRef<HTMLHeadingElement>(null);
  const bannerEl = useRef<HTMLDivElement>(null);
  const textarea = useRef<HTMLTextAreaElement>(null);
  const abortRef = useRef<AbortController | null>(null);

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
    if (status.kind === "success") heading.current?.focus();
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
    setStatus({ kind: "submitting" });
    const fail = (code: number, message: string) =>
      setStatus({ kind: "error", message, status: code });
    try {
      const res = await fetch("/api/estimate", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ feature, teamSize, seniority, token }),
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
        const teamLabel = `${estimatorCopy.people(teamSize)}, ${seniority}`;
        setStatus({ kind: "success", plan: data.plan, teamLabel });
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
          >
            {estimatorExamples.map((ex) => (
              <button
                key={ex}
                type="button"
                className="estimator__chip"
                onClick={() => setFeature(ex)}
              >
                {ex}
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
                if (fieldError) setStatus({ kind: "idle" });
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
                {tooShort && length > 0
                  ? estimatorCopy.atLeast(FEATURE_MIN)
                  : ""}
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

          <Turnstile ref={turnstile} onToken={onToken} />

          <button type="submit" disabled={!canSubmit}>
            {cooldown > 0
              ? estimatorCopy.waitLabel(formatWait(cooldown))
              : estimatorCopy.submit}
          </button>
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
            <h3 ref={heading} tabIndex={-1}>
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
              ]}
            />
            <p className="estimator__note">{estimatorCopy.footerNote}</p>
          </>
        )}
      </section>
    </div>
  );
}
