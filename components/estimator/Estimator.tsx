"use client";

import { useCallback, useRef, useState } from "react";
import { FEATURE_MAX, FEATURE_MIN, SENIORITY, type Plan, type Seniority } from "@/lib/estimate";
import { Turnstile, type TurnstileHandle } from "./Turnstile";
import { PhaseTimeline } from "./PhaseTimeline";
import { TaskTable } from "./TaskTable";

const EXAMPLES = [
  "Let policyholders log in with a one-time code sent by SMS",
  "Customers upload claim photos and OCR fills in the claim form",
  "Email each customer a monthly PDF billing statement",
];

type Status =
  | { kind: "idle" }
  | { kind: "submitting" }
  | { kind: "success"; plan: Plan; teamLabel: string }
  | { kind: "error"; message: string; status: number };

type Tab = "phases" | "tasks";

/**
 * The live AI demo. Spec: docs/03-estimator-spec.md.
 * Logic is wired end to end; visual design is TODO(M2, ui-builder).
 */
export function Estimator() {
  const [feature, setFeature] = useState("");
  const [teamSize, setTeamSize] = useState(4);
  const [seniority, setSeniority] = useState<Seniority>("mixed");
  const [token, setToken] = useState<string | null>(null);
  const [status, setStatus] = useState<Status>({ kind: "idle" });
  const [tab, setTab] = useState<Tab>("phases");
  const turnstile = useRef<TurnstileHandle>(null);

  const onToken = useCallback((t: string | null) => setToken(t), []);

  const length = feature.trim().length;
  const tooShort = length < FEATURE_MIN;
  const submitting = status.kind === "submitting";
  const canSubmit = !tooShort && length <= FEATURE_MAX && !!token && !submitting;

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!canSubmit) return;
    setStatus({ kind: "submitting" });
    try {
      const res = await fetch("/api/estimate", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ feature, teamSize, seniority, token }),
      });
      const data = (await res.json()) as { plan?: Plan; error?: string };
      if (!res.ok || !data.plan) {
        setStatus({ kind: "error", message: data.error ?? "Something went wrong. Try again.", status: res.status });
      } else {
        const teamLabel = `${teamSize} ${teamSize === 1 ? "person" : "people"}, ${seniority}`;
        setStatus({ kind: "success", plan: data.plan, teamLabel });
        setTab("phases");
      }
    } catch {
      setStatus({ kind: "error", message: "Couldn't reach the server. Check your connection.", status: 0 });
    } finally {
      // Turnstile tokens are single-use.
      turnstile.current?.reset();
    }
  }

  // TODO(M2, ui-builder): design every element below per docs/01 and docs/03 (chips, slider readout,
  // segmented control, skeleton loading state, warn-coloured 429 banner, retry button, accessible tabs
  // with arrow-key support).
  return (
    <div className="estimator">
      <form onSubmit={submit} className="estimator__form">
        <div className="estimator__examples" role="group" aria-label="Example features">
          {EXAMPLES.map((ex) => (
            <button key={ex} type="button" onClick={() => setFeature(ex)} disabled={submitting}>
              {ex}
            </button>
          ))}
        </div>

        <label htmlFor="feature">Feature description</label>
        <textarea
          id="feature"
          value={feature}
          onChange={(e) => setFeature(e.target.value)}
          maxLength={FEATURE_MAX}
          rows={4}
          disabled={submitting}
          aria-describedby="feature-count"
        />
        <p id="feature-count">
          {length} / {FEATURE_MAX}
          {tooShort && length > 0 ? ` (at least ${FEATURE_MIN})` : ""}
        </p>

        <label htmlFor="team-size">Team size: {teamSize}</label>
        <input
          id="team-size"
          type="range"
          min={1}
          max={12}
          value={teamSize}
          onChange={(e) => setTeamSize(Number(e.target.value))}
          disabled={submitting}
        />

        <fieldset disabled={submitting}>
          <legend>Seniority</legend>
          {SENIORITY.map((s) => (
            <label key={s}>
              <input type="radio" name="seniority" value={s} checked={seniority === s} onChange={() => setSeniority(s)} />
              {s}
            </label>
          ))}
        </fieldset>

        <Turnstile ref={turnstile} onToken={onToken} />

        <button type="submit" disabled={!canSubmit}>
          {submitting ? "Planning phases…" : "Estimate this feature"}
        </button>
      </form>

      <div aria-live="polite" className="estimator__results">
        {status.kind === "error" && (
          <p role="alert" data-status={status.status}>
            {status.message}
          </p>
        )}

        {status.kind === "success" && (
          <>
            <h3>{status.plan.title}</h3>
            <p>{status.plan.summary}</p>
            <div role="tablist" aria-label="Plan views">
              <button type="button" role="tab" id="tab-phases" aria-controls="panel-phases" aria-selected={tab === "phases"} onClick={() => setTab("phases")}>
                Phases and timeline
              </button>
              <button type="button" role="tab" id="tab-tasks" aria-controls="panel-tasks" aria-selected={tab === "tasks"} onClick={() => setTab("tasks")}>
                Task table
              </button>
            </div>
            <div role="tabpanel" id="panel-phases" aria-labelledby="tab-phases" hidden={tab !== "phases"}>
              <PhaseTimeline plan={status.plan} teamLabel={status.teamLabel} />
            </div>
            <div role="tabpanel" id="panel-tasks" aria-labelledby="tab-tasks" hidden={tab !== "tasks"}>
              <TaskTable plan={status.plan} />
            </div>
            <p className="estimator__note">
              Estimates are generated by Claude for illustration. Real plans need a real team&apos;s input.
            </p>
          </>
        )}
      </div>
    </div>
  );
}
