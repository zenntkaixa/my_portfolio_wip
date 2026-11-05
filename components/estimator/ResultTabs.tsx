"use client";

import { useId, useRef, type KeyboardEvent, type ReactNode } from "react";

export type ResultTab<K extends string> = {
  key: K;
  label: string;
  content: ReactNode;
};

type Props<K extends string> = {
  label: string;
  tabs: readonly ResultTab<K>[];
  value: K;
  onChange: (key: K) => void;
};

/** WAI-ARIA tabs with automatic activation and a roving tabindex. The parent owns the selected value. */
export function ResultTabs<K extends string>({
  label,
  tabs,
  value,
  onChange,
}: Props<K>) {
  const base = useId();
  const refs = useRef<(HTMLButtonElement | null)[]>([]);
  const tabId = (k: K) => `${base}-tab-${k}`;
  const panelId = (k: K) => `${base}-panel-${k}`;

  function select(i: number) {
    onChange(tabs[i].key);
    refs.current[i]?.focus();
  }

  function onKeyDown(e: KeyboardEvent<HTMLButtonElement>, i: number) {
    const last = tabs.length - 1;
    let next: number;
    if (e.key === "ArrowRight") next = i === last ? 0 : i + 1;
    else if (e.key === "ArrowLeft") next = i === 0 ? last : i - 1;
    else if (e.key === "Home") next = 0;
    else if (e.key === "End") next = last;
    else return;
    e.preventDefault();
    select(next);
  }

  return (
    <div className="rtabs">
      <div role="tablist" aria-label={label} className="rtabs__list">
        {tabs.map((t, i) => {
          const selected = t.key === value;
          return (
            <button
              key={t.key}
              ref={(el) => {
                refs.current[i] = el;
              }}
              type="button"
              role="tab"
              id={tabId(t.key)}
              aria-controls={panelId(t.key)}
              aria-selected={selected}
              tabIndex={selected ? 0 : -1}
              className="rtabs__tab"
              onClick={() => onChange(t.key)}
              onKeyDown={(e) => onKeyDown(e, i)}
            >
              {t.label}
            </button>
          );
        })}
      </div>
      {tabs.map((t) => (
        <div
          key={t.key}
          role="tabpanel"
          id={panelId(t.key)}
          aria-labelledby={tabId(t.key)}
          tabIndex={0}
          hidden={t.key !== value}
          className="rtabs__panel"
        >
          {t.content}
        </div>
      ))}
    </div>
  );
}
