# Test info

- Name: Manual Flashcard Creation >> should create flashcard manually
- Location: /Users/kacper/Desktop/10xdevs/10x-cards/tests/e2e/manual-flashcard.spec.ts:16:3

# Error details

```
Error: page.waitForSelector: Test ended.
Call log:
  - waiting for locator('[data-testid="manual-creation-form"]') to be visible

    at FlashcardGenerationPage.switchToManualMode (/Users/kacper/Desktop/10xdevs/10x-cards/tests/page-objects/FlashcardGenerationPage.ts:23:21)
    at /Users/kacper/Desktop/10xdevs/10x-cards/tests/e2e/manual-flashcard.spec.ts:31:5
```

# Test source

```ts
   1 | import type { Page, Locator } from "@playwright/test";
   2 | import { expect } from "@playwright/test";
   3 |
   4 | export class FlashcardGenerationPage {
   5 |   readonly page: Page;
   6 |   readonly manualModeButton: Locator;
   7 |   readonly frontInput: Locator;
   8 |   readonly backInput: Locator;
   9 |   readonly saveButton: Locator;
  10 |   readonly successMessage: Locator;
  11 |
  12 |   constructor(page: Page) {
  13 |     this.page = page;
  14 |     this.manualModeButton = page.getByTestId("manual-mode-button");
  15 |     this.frontInput = page.locator("#front");
  16 |     this.backInput = page.locator("#back");
  17 |     this.saveButton = page.getByTestId("save-button");
  18 |     this.successMessage = page.getByTestId("success-message");
  19 |   }
  20 |
  21 |   async switchToManualMode() {
  22 |     await this.manualModeButton.click();
> 23 |     await this.page.waitForSelector('[data-testid="manual-creation-form"]');
     |                     ^ Error: page.waitForSelector: Test ended.
  24 |   }
  25 |
  26 |   async createFlashcard(front: string, back: string) {
  27 |     await this.frontInput.fill(front);
  28 |     await this.backInput.fill(back);
  29 |     await this.saveButton.click();
  30 |   }
  31 |
  32 |   async expectSuccessMessage() {
  33 |     await expect(this.successMessage).toBeVisible();
  34 |     await expect(this.successMessage).toContainText("Fiszka została zapisana");
  35 |   }
  36 |
  37 |   async expectFormToBeClear() {
  38 |     await expect(this.frontInput).toHaveValue("");
  39 |     await expect(this.backInput).toHaveValue("");
  40 |   }
  41 | }
  42 |
```