"use client";

import { useEffect, useRef, useState } from "react";

type Theme = "light" | "dark";

const STORAGE_KEY = "theme";
const DARK_QUERY = "(prefers-color-scheme: dark)";

function readStoredTheme(): Theme | null {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored === "light" || stored === "dark" ? stored : null;
  } catch {
    return null;
  }
}

/** The DOM is the source of truth. If the bootstrap couldn't set data-theme (e.g. storage access
 * threw), the CSS fallback follows the system scheme, so mirror that here. */
function currentTheme(): Theme {
  const t = document.documentElement.dataset.theme;
  if (t === "light" || t === "dark") return t;
  return window.matchMedia(DARK_QUERY).matches ? "dark" : "light";
}

/**
 * Icon toggle for data-theme on <html>. The no-flash bootstrap lives in app/layout.tsx.
 * Both icons are always rendered; CSS picks the visible one from data-theme, so the icon is right
 * before hydration. aria-pressed is only added after mount, when the theme is known, so the server
 * and first client render match.
 */
export function ThemeToggle() {
  const [theme, setTheme] = useState<Theme | null>(null);
  // Set once the visitor picks a theme this visit, even if storage is blocked.
  const userChose = useRef(false);

  useEffect(() => {
    setTheme(currentTheme());

    const media = window.matchMedia(DARK_QUERY);
    function onSystemChange(event: MediaQueryListEvent) {
      if (userChose.current || readStoredTheme() !== null) return;
      const next: Theme = event.matches ? "dark" : "light";
      document.documentElement.dataset.theme = next;
      setTheme(next);
    }

    media.addEventListener("change", onSystemChange);
    return () => media.removeEventListener("change", onSystemChange);
  }, []);

  function toggle() {
    const next: Theme = currentTheme() === "dark" ? "light" : "dark";
    document.documentElement.dataset.theme = next;
    userChose.current = true;
    try {
      localStorage.setItem(STORAGE_KEY, next);
    } catch {
      // Storage can be blocked; the toggle still works for this visit.
    }
    setTheme(next);
  }

  return (
    <button
      type="button"
      className="theme-toggle"
      onClick={toggle}
      aria-label="Dark theme"
      title="Dark theme"
      aria-pressed={theme === null ? undefined : theme === "dark"}
    >
      <svg
        className="theme-toggle__icon theme-toggle__icon--sun"
        viewBox="0 0 24 24"
        width="20"
        height="20"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.75"
        strokeLinecap="round"
        aria-hidden="true"
        focusable="false"
      >
        <circle cx="12" cy="12" r="4" />
        <path d="M12 2.5v2M12 19.5v2M2.5 12h2M19.5 12h2M5.3 5.3l1.4 1.4M17.3 17.3l1.4 1.4M5.3 18.7l1.4-1.4M17.3 6.7l1.4-1.4" />
      </svg>
      <svg
        className="theme-toggle__icon theme-toggle__icon--moon"
        viewBox="0 0 24 24"
        width="20"
        height="20"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.75"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
        focusable="false"
      >
        <path d="M20 14.5A8 8 0 0 1 9.5 4a8 8 0 1 0 10.5 10.5Z" />
      </svg>
    </button>
  );
}
