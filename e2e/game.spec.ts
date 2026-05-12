import { expect, test } from "@playwright/test";

test("plays the browser smoke flow through P1 roll and P2 AI turn", async ({ page }) => {
  await page.goto("/");

  await expect(page.getByText("Blue Warden").first()).toBeVisible();
  await expect(page.getByText("Crimson Overlord [AI]")).toBeVisible();
  await expect(page.getByRole("grid", { name: /13 by 9 dungeon board/i })).toBeVisible();
  await expect(page.getByRole("gridcell")).toHaveCount(117);
  await expect(page.getByRole("button", { name: /roll dice/i })).toBeEnabled();

  await page.getByRole("button", { name: /roll dice/i }).click();

  await expect(page.locator(".die-card--empty")).toHaveCount(0);
  await expect(page.getByLabel("Latest dice results")).not.toContainText("◇");
  await expect(page.getByText(/Final faces match the latest roll/i)).toBeVisible();

  await page.getByRole("button", { name: /^end turn$/i }).click();

  await expect(page.getByText(/P2 AI THINKING/i)).toBeVisible();
  await expect(page.getByRole("button", { name: /roll dice/i })).toBeDisabled();
  await expect(page.getByText(/Current: Crimson Overlord/i)).toBeVisible();

  await expect(page.getByText(/Current: Blue Warden/i)).toBeVisible({ timeout: 15_000 });
  await expect(page.getByRole("button", { name: /roll dice/i })).toBeEnabled();
});
