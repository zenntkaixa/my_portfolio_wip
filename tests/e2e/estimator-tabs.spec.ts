import { expect, test, type Page } from "./fakeTurnstile";
import plan from "../fixtures/plan.json";
import { estimatorCopy } from "../../lib/content";

// The real API is never called: /api/estimate is intercepted.

async function submitOnce(page: Page) {
  const submit = page.getByRole("button", { name: estimatorCopy.submit });
  await expect(submit).toBeEnabled({ timeout: 15_000 });
  await submit.click();
  await expect(page.getByRole("heading", { name: plan.plan.title })).toBeVisible();
}

async function showResults(page: Page) {
  await page.route("**/api/estimate", (route) => route.fulfill({ json: plan }));
  await page.goto("/");
  await page.getByLabel("Feature description").fill("Add one-time code login with email delivery and rate limiting");
  await submitOnce(page);
}

const phases = (page: Page) => page.getByRole("tab", { name: estimatorCopy.tabPhases });
const tasks = (page: Page) => page.getByRole("tab", { name: estimatorCopy.tabTasks });

test("arrow keys move focus, selection and panel, wrapping both ways", async ({ page }) => {
  await showResults(page);
  await phases(page).focus();
  await page.keyboard.press("ArrowRight");
  await expect(tasks(page)).toBeFocused();
  await expect(tasks(page)).toHaveAttribute("aria-selected", "true");
  await expect(phases(page)).toHaveAttribute("aria-selected", "false");
  await expect(page.getByRole("tabpanel", { name: estimatorCopy.tabTasks })).toBeVisible();
  await expect(page.getByRole("tabpanel", { name: estimatorCopy.tabPhases })).toBeHidden();
  await page.keyboard.press("ArrowRight");
  await expect(phases(page)).toBeFocused();
  await expect(phases(page)).toHaveAttribute("aria-selected", "true");
  await page.keyboard.press("ArrowLeft");
  await expect(tasks(page)).toBeFocused();
  await expect(tasks(page)).toHaveAttribute("aria-selected", "true");
  await page.keyboard.press("ArrowLeft");
  await expect(phases(page)).toBeFocused();
  await expect(page.getByRole("tabpanel", { name: estimatorCopy.tabPhases })).toBeVisible();
});

test("Home and End jump to the first and last tab", async ({ page }) => {
  await showResults(page);
  await phases(page).focus();
  await page.keyboard.press("End");
  await expect(tasks(page)).toBeFocused();
  await expect(tasks(page)).toHaveAttribute("aria-selected", "true");
  await page.keyboard.press("Home");
  await expect(phases(page)).toBeFocused();
  await expect(phases(page)).toHaveAttribute("aria-selected", "true");
});

test("only the selected tab is in the tab order, and Tab reaches the active panel", async ({ page }) => {
  await showResults(page);
  await expect(phases(page)).toHaveAttribute("tabindex", "0");
  await expect(tasks(page)).toHaveAttribute("tabindex", "-1");
  await phases(page).focus();
  await page.keyboard.press("Tab");
  await expect(page.getByRole("tabpanel", { name: estimatorCopy.tabPhases })).toBeFocused();

  await tasks(page).click();
  await expect(phases(page)).toHaveAttribute("tabindex", "-1");
  await expect(tasks(page)).toHaveAttribute("tabindex", "0");
  await page.keyboard.press("Tab");
  await expect(page.getByRole("tabpanel", { name: estimatorCopy.tabTasks })).toBeFocused();
});

test("clicking a tab selects it", async ({ page }) => {
  await showResults(page);
  await tasks(page).click();
  await expect(tasks(page)).toHaveAttribute("aria-selected", "true");
  await expect(page.getByRole("tabpanel", { name: estimatorCopy.tabTasks })).toBeVisible();
  await phases(page).click();
  await expect(page.getByRole("tabpanel", { name: estimatorCopy.tabPhases })).toBeVisible();
});

test("ARIA wiring links tabs and panels both ways", async ({ page }) => {
  await showResults(page);
  await expect(page.getByRole("tablist", { name: estimatorCopy.tabsLabel })).toBeVisible();
  for (const tab of [phases(page), tasks(page)]) {
    const panelId = await tab.getAttribute("aria-controls");
    const tabId = await tab.getAttribute("id");
    expect(panelId).toBeTruthy();
    const panel = page.locator(`[id="${panelId}"]`);
    await expect(panel).toHaveCount(1);
    await expect(panel).toHaveAttribute("role", "tabpanel");
    await expect(panel).toHaveAttribute("aria-labelledby", tabId!);
  }
});

test("a new plan resets to the first tab", async ({ page }) => {
  await showResults(page);
  await tasks(page).click();
  await expect(tasks(page)).toHaveAttribute("aria-selected", "true");
  await submitOnce(page);
  await expect(phases(page)).toHaveAttribute("aria-selected", "true");
  await expect(page.getByRole("tabpanel", { name: estimatorCopy.tabPhases })).toBeVisible();
});
