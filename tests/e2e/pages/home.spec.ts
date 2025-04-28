import { test, expect } from "@playwright/test";
import { HomePage } from "./models/HomePage";

test.describe("Home Page", () => {
  test("should load the home page successfully", async ({ page }) => {
    const homePage = new HomePage(page);
    await homePage.goto();
    await homePage.isLoaded();

    await expect(homePage.heading).toBeVisible();
  });
});
