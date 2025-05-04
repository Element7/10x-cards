import { expect } from "@playwright/test";
import type { Page, Locator } from "@playwright/test";

/**
 * Page Object Model for the home page
 */
export class HomePage {
  readonly page: Page;
  readonly heading: Locator;

  constructor(page: Page) {
    this.page = page;
    this.heading = page.getByRole("heading", { level: 1 });
  }

  /**
   * Navigate to the home page
   */
  async goto() {
    await this.page.goto("/");
  }

  /**
   * Check if the page is loaded correctly
   */
  async isLoaded() {
    await expect(this.page).toHaveTitle("Fiszki AI");
    await expect(this.heading).toBeVisible();
  }
}
