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
    this.frontInput = page.getByLabel("Przód fiszki");
    this.backInput = page.getByLabel("Tył fiszki");
    this.saveButton = page.getByRole("button", { name: "Zapisz fiszkę" });
    this.successMessage = page.getByTestId("success-message");
  }

  async switchToManualMode() {
    await this.manualModeButton.click();
    // Poczekaj na pojawienie się formularza
    await expect(this.frontInput).toBeVisible();
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
