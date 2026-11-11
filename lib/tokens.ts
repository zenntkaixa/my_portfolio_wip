import { readFileSync } from "node:fs";
import { join } from "node:path";

// Reads the design tokens out of app/globals.css so the OG image, icons and
// contrast tests share one source of truth (docs/01-design-system.md).

export type Tokens = Record<string, string>;

/** Returns the custom properties declared in the first rule whose selector matches `selector`. */
export function tokensOf(css: string, selector: RegExp): Tokens {
  const m = selector.exec(css);
  if (!m) throw new Error(`selector not found: ${selector}`);
  const start = m.index + m[0].length;
  const body = css.slice(start, css.indexOf("}", start));
  const out: Tokens = {};
  for (const d of body.matchAll(/(--[\w-]+)\s*:\s*([^;]+);/g)) out[d[1]] = d[2].trim();
  return out;
}

export const LIGHT_SELECTOR = /:root,\s*:root\[data-theme="light"\]\s*\{/;
export const DARK_SELECTOR = /:root\[data-theme="dark"\]\s*\{/;

export function readCss(): string {
  return readFileSync(join(process.cwd(), "app/globals.css"), "utf8");
}

export function readThemes(css: string = readCss()): { light: Tokens; dark: Tokens } {
  return { light: tokensOf(css, LIGHT_SELECTOR), dark: tokensOf(css, DARK_SELECTOR) };
}

/** A light-theme token by name; throws if it is missing. */
export function lightToken(name: string): string {
  const v = readThemes().light[name];
  if (!v) throw new Error(`token ${name} missing from the light theme in app/globals.css`);
  return v;
}

export function lightTokens<K extends string>(names: readonly K[]): Record<K, string> {
  const light = readThemes().light;
  const out = {} as Record<K, string>;
  for (const n of names) {
    if (!light[n]) throw new Error(`token ${n} missing from the light theme in app/globals.css`);
    out[n] = light[n];
  }
  return out;
}
