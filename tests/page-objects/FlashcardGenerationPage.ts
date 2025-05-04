import type { Page, Locator } from "@playwright/test";
import { expect } from "@playwright/test";

export class FlashcardGenerationPage {
  readonly page: Page;
  readonly manualModeButton: Locator;
  readonly frontInput: Locator;
  readonly backInput: Locator;
  readonly saveButton: Locator;
  readonly successMessage: Locator;

  constructor(page: Page) {
    this.page = page;
    this.manualModeButton = page.getByTestId("manual-mode-button");
    this.frontInput = page.locator("#front");
    this.backInput = page.locator("#back");
    this.saveButton = page.getByTestId("save-button");
    this.successMessage = page.getByTestId("success-message");
  }

  async switchToManualMode() {
    await this.manualModeButton.click();
    await this.page.waitForSelector('[data-testid="manual-creation-form"]');
  }

  async createFlashcard(front: string, back: string) {
    await this.frontInput.fill(front);
    await this.backInput.fill(back);
    await this.saveButton.click();
  }

  async expectSuccessMessage() {
    await expect(this.successMessage).toBeVisible();
    await expect(this.successMessage).toContainText("Fiszka została zapisana");
  }

  async expectFormToBeClear() {
    await expect(this.frontInput).toHaveValue("");
    await expect(this.backInput).toHaveValue("");
  }
}
