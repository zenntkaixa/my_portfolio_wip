"use client";

import { useState } from "react";
import { estimatorCopy } from "@/lib/content";
import { refineRoom, type Answer } from "@/lib/refine";

const c = estimatorCopy.refine;

/**
 * B4: answer the plan's open questions and send brief plus answers as a new estimate. `blocked` is the reason
 * a live request can't go yet (no human check token, 429 cooldown, a request in flight), or null.
 */
export function RefineForm({
  brief,
  questions,
  blocked,
  onRefine,
}: {
  brief: string;
  questions: string[];
  blocked: string | null;
  onRefine: (answers: Answer[]) => void;
}) {
  const [values, setValues] = useState<string[]>(() => questions.map(() => ""));
  const answers = questions.map((question, i) => ({ question, answer: values[i] ?? "" }));
  const room = refineRoom(brief, answers);
  const none = answers.every((a) => !a.answer.trim());
  const reason = none ? c.needAnswer : room < 0 ? c.tooLong : blocked;
  return (
    <section className="refine" aria-labelledby="refine-heading">
      <h4 id="refine-heading">{c.heading}</h4>
      <p className="refine__intro">{c.intro}</p>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          if (!reason) onRefine(answers);
        }}
      >
        {questions.map((q, i) => (
          <div key={`${i}-${q}`} className="refine__field">
            <label htmlFor={`refine-${i}`}>{q}</label>
            <input
              id={`refine-${i}`}
              type="text"
              maxLength={300}
              autoComplete="off"
              value={values[i] ?? ""}
              onChange={(e) => setValues((v) => v.map((x, j) => (j === i ? e.target.value : x)))}
            />
          </div>
        ))}
        <p id="refine-room" className="refine__room" data-warn={room < 0 || undefined}>
          {c.left(room)}
        </p>
        <button type="submit" className="refine__submit" aria-disabled={!!reason} aria-describedby="refine-why">
          {c.button}
        </button>
        <p id="refine-why" className="refine__why" aria-live="polite">
          {reason ?? ""}
        </p>
      </form>
    </section>
  );
}
