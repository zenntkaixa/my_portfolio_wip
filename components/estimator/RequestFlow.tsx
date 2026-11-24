"use client";

import { useEffect, useState } from "react";
import { howItsBuilt as h } from "@/lib/content";

type Step = (typeof h.path)[number] & { model?: boolean };
const steps: readonly Step[] = h.path;
const MODEL_AT = steps.findIndex((s) => s.model);

/** Flow key: names both colours in words, so identity is never colour alone. */
function FlowKey() {
  return (
    <p className="flow__key">
      <span data-kind="code">{h.flowKey.code}</span>
      <span data-kind="model">{h.flowKey.model}</span>
    </p>
  );
}

/**
 * G1: the path of one request, tinted by who decides each step (code or the model). Static in "How it's
 * built"; with `live`, it lights up while a plan generates: the fast steps tick through, then it holds on
 * the model step until the response arrives (the component unmounts then).
 */
export function RequestFlow({ live = false }: { live?: boolean }) {
  const [at, setAt] = useState(live ? 0 : -1);
  useEffect(() => {
    if (!live || at >= MODEL_AT) return;
    const id = setTimeout(() => setAt((n) => n + 1), 250);
    return () => clearTimeout(id);
  }, [live, at]);
  const state = (i: number) => (!live ? undefined : i < at ? "done" : i === at ? "active" : "todo");
  return (
    <div className={live ? "flow flow--live" : "flow"} data-testid={live ? "flow-live" : "flow"}>
      <FlowKey />
      <ol className="flow__steps" role="list">
        {steps.map((s, i) => (
          <li key={s.step} data-kind={s.model ? "model" : "code"} data-state={state(i)}>
            <strong>{s.step}</strong>
            {!live && <span>{s.note}</span>}
          </li>
        ))}
      </ol>
    </div>
  );
}
