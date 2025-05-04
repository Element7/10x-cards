import type { Page, Locator } from "@playwright/test";
import { expect } from "@playwright/test";

export class FlashcardGenerationPage {
  readonly page: Page;
  readonly modeToggle: Locator;
  readonly manualModeButton: Locator;
  readonly frontInput: Locator;
  readonly backInput: Locator;
  readonly saveButton: Locator;
  readonly successMessage: Locator;

  constructor(page: Page) {
    this.page = page;
    // Przyciski trybu
    this.modeToggle = page.getByTestId("mode-toggle");
    this.manualModeButton = page.getByTestId("manual-mode-toggle");

    // Formularz manualny
    this.frontInput = page.locator("#front");
    this.backInput = page.locator("#back");
    this.saveButton = page.getByTestId("save-button");
    this.successMessage = page.getByTestId("success-message");
  }

  async switchToManualMode() {
    // First ensure the manual mode button is visible and clickable
    await this.manualModeButton.waitFor({ state: "visible" });
    await this.manualModeButton.click();

    // Wait for the manual creation container to appear
    await this.page.waitForSelector('[data-testid="manual-creation-container"]', { state: "visible", timeout: 10000 });
    await this.frontInput.waitFor({ state: "visible", timeout: 10000 });
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
