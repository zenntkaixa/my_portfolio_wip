import { expect, test } from "@playwright/test";
import { estimatorExamples } from "../../lib/content";

// The real API is never called: the form is only filled, never submitted.

test("example chip fills the textarea and the counter updates", async ({ page }) => {
  await page.goto("/");
  const box = page.getByLabel("Feature description");
  await page.getByRole("button", { name: estimatorExamples[0] }).click();
  await expect(box).toHaveValue(estimatorExamples[0]);
  await expect(page.locator("#feature-count")).toContainText(`${estimatorExamples[0].length} /`);
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
