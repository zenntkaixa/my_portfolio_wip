"use client";

import { useEffect, useState } from "react";

type Theme = "light" | "dark";

/** Toggles data-theme on <html> and remembers the choice. The no-flash bootstrap lives in app/layout.tsx. */
export function ThemeToggle() {
  const [theme, setTheme] = useState<Theme | null>(null);

  useEffect(() => {
    const current = document.documentElement.dataset.theme;
    setTheme(current === "dark" ? "dark" : "light");
  }, []);

  function toggle() {
    const next: Theme = theme === "dark" ? "light" : "dark";
    document.documentElement.dataset.theme = next;
    try {
      localStorage.setItem("theme", next);
    } catch {
      // Storage can be blocked; the toggle still works for this visit.
    }
    setTheme(next);
  }

  // TODO(M1, ui-builder): icon button (sun/moon as inline SVG), styled with tokens.
  return (
    <button type="button" className="theme-toggle" onClick={toggle} aria-label="Toggle colour theme" disabled={!theme}>
      {theme === "dark" ? "Light mode" : "Dark mode"}
    </button>
  );
}
