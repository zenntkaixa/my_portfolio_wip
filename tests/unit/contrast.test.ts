import { describe, expect, it } from "vitest";
import { readCss, readThemes, tokensOf } from "@/lib/tokens";

// WCAG contrast of the design tokens in app/globals.css (docs/01-design-system.md).
// Tokens are parsed from the CSS (lib/tokens.ts), so a palette change that breaks contrast fails here.

const css = readCss();
const themes = readThemes(css);

function rgb(hex: string): [number, number, number] {
  const m = /^#([0-9a-f]{6})$/i.exec(hex);
  if (!m) throw new Error(`not a 6-digit hex colour: ${hex}`);
  const n = parseInt(m[1], 16);
  return [(n >> 16) & 255, (n >> 8) & 255, n & 255];
}

function luminance(hex: string): number {
  const [r, g, b] = rgb(hex).map((v) => {
    const c = v / 255;
    return c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4;
  });
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}

export function contrast(a: string, b: string): number {
  const [hi, lo] = [luminance(a), luminance(b)].sort((x, y) => y - x);
  return (hi + 0.05) / (lo + 0.05);
}

// [foreground, background, minimum ratio, what it covers]
const pairs: [string, string, number, string][] = [
  // Body text (AA 4.5:1)
  ["--ink", "--bg", 4.5, "body text on page"],
  ["--ink", "--surface", 4.5, "body text on tiles"],
  ["--ink", "--surface-2", 4.5, "body text on inset areas"],
  ["--muted", "--bg", 4.5, "secondary text on page"],
  ["--muted", "--surface", 4.5, "secondary text on tiles"],
  ["--muted", "--surface-2", 4.5, "secondary text on inset areas, disabled controls"],
  // Accent used as text (links) and text on accent (primary button)
  ["--accent", "--bg", 4.5, "links on page"],
  ["--accent", "--surface", 4.5, "links on tiles"],
  ["--accent", "--surface-2", 4.5, "links on inset areas"],
  ["--accent-ink", "--accent", 4.5, "primary button label"],
  ["--ink", "--accent-soft", 4.5, "text on accent-soft backgrounds"],
  // Semantic text colours (risks, rate-limit messages; only ever drawn on tile surfaces)
  ["--warn", "--surface", 4.5, "warning text on tiles"],
  // Non-text (AA 3:1)
  ["--muted", "--surface", 3, "form field border"],
  ["--accent", "--bg", 3, "focus outline on page"],
  ["--accent", "--surface", 3, "focus outline on tiles"],
  ["--accent", "--surface-2", 3, "focus outline / timeline bars on inset areas"],
  ["--ok", "--surface", 3, "open-to-roles dot"],
];

describe("design token contrast", () => {
  it("parses every token used below in both themes", () => {
    for (const theme of ["light", "dark"] as const) {
      for (const [fg, bg] of pairs) {
        expect(themes[theme][fg], `${theme} ${fg}`).toMatch(/^#[0-9a-f]{6}$/i);
        expect(themes[theme][bg], `${theme} ${bg}`).toMatch(/^#[0-9a-f]{6}$/i);
      }
    }
  });

  it("the prefers-color-scheme fallback repeats the dark tokens", () => {
    const fallback = tokensOf(css, /:root:not\(\[data-theme\]\)\s*\{/);
    expect(fallback).toEqual(themes.dark);
  });

  it("computes known ratios correctly", () => {
    expect(contrast("#000000", "#ffffff")).toBeCloseTo(21, 5);
    expect(contrast("#777777", "#ffffff")).toBeCloseTo(4.48, 2);
  });

  for (const theme of ["light", "dark"] as const) {
    describe(theme, () => {
      it.each(pairs)("%s on %s >= %s (%s)", (fg, bg, min) => {
        const ratio = contrast(themes[theme][fg], themes[theme][bg]);
        expect(ratio, `${fg} ${themes[theme][fg]} on ${bg} ${themes[theme][bg]} = ${ratio.toFixed(2)}`).toBeGreaterThanOrEqual(min);
      });
    });
  }
});
