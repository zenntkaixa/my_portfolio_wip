import { readFile } from "node:fs/promises";
import { join } from "node:path";

/**
 * Bricolage Grotesque Bold (OFL, app/fonts) for next/og images.
 * Reads from process.cwd() at build: the image and icon routes are prerendered. If one ever uses a
 * dynamic API (headers, cookies, searchParams) it renders at runtime, and the font and globals.css
 * would then need `outputFileTracingIncludes` in next.config.ts.
 */
export async function displayFont() {
  const data = await readFile(join(process.cwd(), "app/fonts/BricolageGrotesque-Bold.ttf"));
  return [{ name: "Bricolage Grotesque", data, weight: 700 as const, style: "normal" as const }];
}
