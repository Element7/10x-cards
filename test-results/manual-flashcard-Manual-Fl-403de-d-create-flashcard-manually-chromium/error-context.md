# Test info

- Name: Manual Flashcard Creation >> should create flashcard manually
- Location: /Users/kacper/Desktop/10xdevs/10x-cards/tests/e2e/manual-flashcard.spec.ts:16:3

# Error details

```
TimeoutError: page.waitForSelector: Timeout 10000ms exceeded.
Call log:
  - waiting for locator('[data-testid="manual-creation-container"]') to be visible

    at FlashcardGenerationPage.switchToManualMode (/Users/kacper/Desktop/10xdevs/10x-cards/tests/page-objects/FlashcardGenerationPage.ts:32:21)
    at /Users/kacper/Desktop/10xdevs/10x-cards/tests/e2e/manual-flashcard.spec.ts:29:5
```

# Page snapshot

```yaml
- banner:
  - link "10xCards":
    - /url: /
  - navigation:
    - link "Generuj fiszki":
      - /url: /flashcards/generate
    - link "Moje fiszki":
      - /url: /flashcards
  - button "K"
- main:
  - main:
    - heading "Generowanie fiszek" [level=1]
    - link "Historia generacji":
      - /url: /generations
      - img
      - text: Historia generacji
    - paragraph: Wybierz tryb generowania fiszek - automatycznie z pomocą AI lub ręcznie.
    - button "Tryb AI" [pressed]:
      - img
      - text: Generuj z AI
    - button "Tryb manualny":
      - img
      - text: Twórz ręcznie
    - heading "Generowanie z AI" [level=2]
    - paragraph: Wprowadź tekst źródłowy, a AI wygeneruje propozycje fiszek. Następnie możesz je zaakceptować, edytować lub odrzucić.
    - text: Tekst źródłowy
    - paragraph: 0 / 10000
    - textbox "Tekst źródłowy"
    - paragraph: Min. 1000 znaków, max. 10000 znaków
    - button "Generuj fiszki"
```

# Test source

```ts
   1 | import type { Page, Locator } from "@playwright/test";
   2 | import { expect } from "@playwright/test";
   3 |
   4 | export class FlashcardGenerationPage {
   5 |   readonly page: Page;
   6 |   readonly modeToggle: Locator;
   7 |   readonly manualModeButton: Locator;
   8 |   readonly frontInput: Locator;
   9 |   readonly backInput: Locator;
  10 |   readonly saveButton: Locator;
  11 |   readonly successMessage: Locator;
  12 |
  13 |   constructor(page: Page) {
  14 |     this.page = page;
  15 |     // Przyciski trybu
  16 |     this.modeToggle = page.getByTestId("mode-toggle");
  17 |     this.manualModeButton = page.getByTestId("manual-mode-toggle");
  18 |
  19 |     // Formularz manualny
  20 |     this.frontInput = page.locator("#front");
  21 |     this.backInput = page.locator("#back");
  22 |     this.saveButton = page.getByTestId("save-button");
  23 |     this.successMessage = page.getByTestId("success-message");
  24 |   }
  25 |
  26 |   async switchToManualMode() {
  27 |     // First ensure the manual mode button is visible and clickable
  28 |     await this.manualModeButton.waitFor({ state: "visible" });
  29 |     await this.manualModeButton.click();
  30 |
  31 |     // Wait for the manual creation container to appear
> 32 |     await this.page.waitForSelector('[data-testid="manual-creation-container"]', { state: "visible", timeout: 10000 });
     |                     ^ TimeoutError: page.waitForSelector: Timeout 10000ms exceeded.
  33 |     await this.frontInput.waitFor({ state: "visible", timeout: 10000 });
  34 |   }
  35 |
  36 |   async createFlashcard(front: string, back: string) {
  37 |     await this.frontInput.fill(front);
  38 |     await this.backInput.fill(back);
  39 |     await this.saveButton.click();
  40 |   }
  41 |
  42 |   async expectSuccessMessage() {
  43 |     await expect(this.successMessage).toBeVisible();
  44 |     await expect(this.successMessage).toContainText("Fiszka została zapisana");
  45 |   }
  46 |
  47 |   async expectFormToBeClear() {
  48 |     await expect(this.frontInput).toHaveValue("");
  49 |     await expect(this.backInput).toHaveValue("");
  50 |   }
  51 | }
  52 |
```