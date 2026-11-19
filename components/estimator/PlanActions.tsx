"use client";

import { useEffect, useRef, useState } from "react";
import type { Plan } from "@/lib/estimate";
import { budget, type Team } from "@/lib/budget";
import { estimatorCopy } from "@/lib/content";
import { planToText } from "@/lib/planText";

/** Copy the plan as text or open the print dialog. Print styles live in app/globals.css. */
export function PlanActions({ plan, team }: { plan: Plan; team: Team }) {
  const a = estimatorCopy.actions;
  const [msg, setMsg] = useState("");
  const [copied, setCopied] = useState(false);
  const timer = useRef<ReturnType<typeof setTimeout>>(undefined);
  useEffect(() => () => clearTimeout(timer.current), []);

  async function copy() {
    clearTimeout(timer.current);
    try {
      await navigator.clipboard.writeText(planToText(plan, team, budget(plan, team)));
      setCopied(true);
      setMsg(a.copied);
    } catch {
      setCopied(false);
      setMsg(a.copyFailed);
    }
    timer.current = setTimeout(() => {
      setCopied(false);
      setMsg("");
    }, 2000);
  }

  return (
    <div role="group" aria-label={a.label} className="plan-actions">
      <button type="button" onClick={() => void copy()}>
        {copied ? a.copied : a.copy}
      </button>
      <button type="button" onClick={() => window.print()}>
        {a.print}
      </button>
      <p role="status" className={copied ? "sr-only" : "plan-actions__msg"}>
        {msg}
      </p>
    </div>
  );
}
