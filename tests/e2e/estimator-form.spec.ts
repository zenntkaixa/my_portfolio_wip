import { expect, test } from "@playwright/test";
import { estimatorBriefs, estimatorCopy, estimatorExamples } from "../../lib/content";

// The real API is never called: the form is only filled, never submitted.

test("two short examples and one detailed brief; the brief chip fills its full text", async ({ page }) => {
  await page.goto("/");
  const group = page.getByRole("group", { name: "Example features" });
  await expect(group).toHaveAttribute("data-ready", "");
  const chips = await group.getByRole("button").allTextContents();
  expect(chips).toHaveLength(3);
  expect(chips[0]).not.toBe(chips[1]);
  for (const c of chips.slice(0, 2)) expect(estimatorExamples).toContain(c);
  const brief = estimatorBriefs.find((b) => estimatorCopy.briefChip(b.title) === chips[2]);
  expect(brief, chips[2]).toBeDefined();
  await group.getByRole("button").nth(2).click();
  await expect(page.getByLabel("Feature description")).toHaveValue(brief!.text);

  const box = page.getByLabel("Feature description");
  await group.getByRole("button").first().click();
  await expect(box).toHaveValue(chips[0]);
  await expect(page.locator("#feature-count")).toContainText(`${chips[0].length} /`);
  await box.fill("short");
  await expect(page.locator("#feature-count")).toContainText("5 /");
  await expect(page.locator("#feature-count")).toContainText("at least");
});

test("team slider changes the readout", async ({ page }) => {
  await page.goto("/");
  const slider = page.getByRole("slider", { name: "Team size" });
  await expect(slider).toHaveAttribute("aria-valuetext", "4 people");
  await slider.focus();
  await page.keyboard.press("End");
  await expect(page.locator("output[for='team-size']")).toHaveText("12");
  await page.keyboard.press("Home");
  await expect(page.locator("output[for='team-size']")).toHaveText("1");
  await expect(slider).toHaveAttribute("aria-valuetext", "1 person");
});

test("arrow keys move the seniority selection", async ({ page }) => {
  await page.goto("/");
  const group = page.getByRole("group", { name: "Seniority" });
  const mixed = group.getByRole("radio", { name: "mixed" });
  await expect(mixed).toBeChecked();
  await mixed.focus();
  await page.keyboard.press("ArrowLeft");
  await expect(group.getByRole("radio", { name: "senior" })).toBeChecked();
});

test("no horizontal scroll at 320px", async ({ page }) => {
  await page.setViewportSize({ width: 320, height: 700 });
  await page.goto("/");
  const overflow = await page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth);
  expect(overflow).toBeLessThanOrEqual(0);
});

test("the model note under submit sets expectations", async ({ page }) => {
  await page.goto("/");
  await expect(page.getByText(estimatorCopy.modelNote)).toBeVisible();
});
