import { expect, test, type Page } from "@playwright/test";
import plan from "../fixtures/plan.json";
import { estimatorCopy } from "../../lib/content";

// Keyboard-only walkthrough. The real API is never called: /api/estimate is intercepted.
// Turnstile uses the always-pass test key, so submit enables after a token arrives.

const FEATURE = "Add one-time code login with email delivery and rate limiting";
const MAX_STOPS = 120;

type Stop = {
  tag: string;
  role: string;
  name: string;
  section: string; // id of the enclosing tile ("" if none)
  indicator: boolean; // visible focus indicator
};

/** Describes document.activeElement. Radios hide the native input, so the indicator may sit on the label. */
function describeActive(): Stop | null {
  const el = document.activeElement as HTMLElement | null;
  if (!el || el === document.body || el === document.documentElement) return null;
  // Defined inline: this function is serialised into the page by page.evaluate.
  const inTurnstile = (e: Element) => {
    if (e.closest(".turnstile")) return true;
    const root = e.getRootNode();
    return root instanceof ShadowRoot && !!root.host.closest(".turnstile");
  };
  const visible = (e: Element) => {
    const s = getComputedStyle(e);
    const outline = s.outlineStyle !== "none" && parseFloat(s.outlineWidth) > 0;
    const halo = s.boxShadow !== "none";
    return outline || halo;
  };
  const label = el instanceof HTMLInputElement ? el.closest("label") : null;
  const own = visible(el);
  const wrapped = label ? visible(label) : false;
  // The seniority control draws its ring on the label (:has(input:focus-visible)).
  const indicator = own || wrapped;
  const labelledBy = el.getAttribute("aria-labelledby");
  const name =
    el.getAttribute("aria-label") ||
    (labelledBy ? document.getElementById(labelledBy)?.textContent : "") ||
    (el instanceof HTMLInputElement || el instanceof HTMLTextAreaElement
      ? (el.labels?.[0]?.textContent ?? el.name)
      : el.textContent) ||
    el.getAttribute("title") ||
    "";
  return {
    tag: el.tagName.toLowerCase(),
    role: el.getAttribute("role") ?? (el instanceof HTMLInputElement ? el.type : ""),
    name: name.trim().replace(/\s+/g, " ").slice(0, 60),
    // Cloudflare's widget adds its own focusable <div>s inside its shadow root; third-party. Only
    // stops inside the .turnstile container (or a shadow root hosted there) are excluded.
    section: inTurnstile(el) ? "turnstile" : (el.closest("section[id]")?.id ?? ""),
    indicator,
  };
}

const submitButton = (page: Page) => page.getByRole("button", { name: estimatorCopy.submit });

/**
 * Walks the page with Tab (or Shift+Tab) until focus leaves the document, returning every stop.
 * Typing the feature into the textarea is part of the walk, as a keyboard user would do it; submit
 * only becomes focusable once the text is valid and Turnstile has issued a token.
 */
async function walk(page: Page, key: "Tab" | "Shift+Tab"): Promise<Stop[]> {
  const stops: Stop[] = [];
  for (let i = 0; i < MAX_STOPS; i++) {
    await page.keyboard.press(key);
    const stop = await page.evaluate(describeActive);
    if (!stop) return stops;
    // The Next.js dev overlay lives outside the page; it is not a product stop.
    if (stop.tag === "nextjs-portal") continue;
    stops.push(stop);
    if (key === "Tab" && stop.tag === "textarea") await page.keyboard.type(FEATURE);
    if (key === "Tab" && stop.role === "radio") await expect(submitButton(page)).toBeEnabled({ timeout: 15_000 });
  }
  throw new Error(`keyboard trap suspected: still focusable after ${MAX_STOPS} Tab presses`);
}

const describeStops = (stops: Stop[]) =>
  stops.map((s, i) => `${i + 1}. ${s.tag}${s.role ? `[${s.role}]` : ""} "${s.name}" (${s.section || "-"})`).join("\n");

test("Tab order, visible focus indicators, no trap, Shift+Tab goes back", async ({ page }) => {
  await page.goto("/");
  await expect(submitButton(page)).toBeVisible();

  const all = await walk(page, "Tab");
  // Turnstile's own stops are third-party: kept out of order and indicator checks, but they must not trap.
  const stops = all.filter((s) => s.section !== "turnstile");
  const listing = describeStops(all);

  // First stop is the skip link; it targets the estimator.
  expect(stops[0], listing).toMatchObject({ tag: "a", name: "Skip to the estimator" });

  // Estimator controls come in the documented order: chips, textarea, slider, seniority, submit.
  const est = stops.filter((s) => s.section === "estimator");
  const chips = est.filter((s) => s.tag === "button" && s.role === "").slice(0, -1);
  const kinds = est.map((s) => (s.tag === "textarea" ? "textarea" : s.role === "range" ? "range" : s.role === "radio" ? "radio" : "button"));
  expect(kinds, listing).toEqual([...chips.map(() => "button"), "textarea", "range", "radio", "button"]);
  expect(chips.length, listing).toBeGreaterThanOrEqual(1);
  expect(est.at(-1)?.name, listing).toBe(estimatorCopy.submit);

  // Contact links come last; nothing focusable follows them.
  const lastEstimator = stops.findLastIndex((s) => s.section === "estimator");
  const firstContact = stops.findIndex((s) => s.section === "contact");
  expect(firstContact, listing).toBeGreaterThan(lastEstimator);
  expect(stops.slice(firstContact).every((s) => s.section === "contact"), listing).toBe(true);
  expect(stops.at(-1)?.section, listing).toBe("contact");

  // Every stop shows a focus indicator (outline or the halo box-shadow).
  const missing = stops.filter((s) => !s.indicator);
  expect(missing, `no visible focus indicator on:\n${describeStops(missing)}`).toEqual([]);

  // No trap: the walk ended with focus leaving the page (checked by walk()). Shift+Tab retraces it.
  const back = (await walk(page, "Shift+Tab")).filter((s) => s.section !== "turnstile");
  expect(back.map((s) => s.name), describeStops(back)).toEqual(stops.map((s) => s.name).reverse());
});

test("keyboard-only submit moves focus to the results heading; arrows, Home and End switch tabs", async ({ page }) => {
  await page.route("**/api/estimate", (route) => route.fulfill({ json: plan }));
  await page.goto("/");
  await expect(submitButton(page)).toBeVisible();

  // Tab to the textarea, type, then Tab to submit once it is enabled.
  const textarea = page.getByLabel("Feature description");
  while (!(await textarea.evaluate((el) => el === document.activeElement))) await page.keyboard.press("Tab");
  await page.keyboard.type(FEATURE);
  await expect(submitButton(page)).toBeEnabled({ timeout: 15_000 });
  for (let i = 0; i < 10 && !(await submitButton(page).evaluate((el) => el === document.activeElement)); i++) {
    await page.keyboard.press("Tab");
  }
  await expect(submitButton(page)).toBeFocused();
  await page.keyboard.press("Enter");

  await expect(page.getByRole("heading", { name: plan.plan.title })).toBeFocused();

  // Tab from the heading lands on the selected tab (roving tabindex), then arrows/Home/End move.
  await page.keyboard.press("Tab");
  const phases = page.getByRole("tab", { name: estimatorCopy.tabPhases });
  const tasks = page.getByRole("tab", { name: estimatorCopy.tabTasks });
  await expect(phases).toBeFocused();
  await page.keyboard.press("ArrowRight");
  await expect(tasks).toBeFocused();
  await expect(tasks).toHaveAttribute("aria-selected", "true");
  await expect(page.getByRole("tabpanel", { name: estimatorCopy.tabTasks })).toBeVisible();
  await page.keyboard.press("Home");
  await expect(phases).toBeFocused();
  await expect(phases).toHaveAttribute("aria-selected", "true");
  await page.keyboard.press("End");
  await expect(tasks).toBeFocused();
  await expect(tasks).toHaveAttribute("aria-selected", "true");
  await page.keyboard.press("ArrowLeft");
  await expect(phases).toBeFocused();

  // The results stay keyboard-reachable: Tab from the tab goes to the panel, which shows a ring too.
  await page.keyboard.press("Tab");
  const panel = page.getByRole("tabpanel", { name: estimatorCopy.tabPhases });
  await expect(panel).toBeFocused();
  const ring = await panel.evaluate((el) => {
    const s = getComputedStyle(el);
    return s.outlineStyle !== "none" || s.boxShadow !== "none";
  });
  expect(ring).toBe(true);
});
