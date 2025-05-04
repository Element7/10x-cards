import { test, expect } from "@playwright/test";
import { LoginPage } from "../page-objects/LoginPage";
import { FlashcardGenerationPage } from "../page-objects/FlashcardGenerationPage";

// Sprawdź czy zmienne środowiskowe są ustawione
const TEST_USERNAME = process.env.E2E_USERNAME;
const TEST_PASSWORD = process.env.E2E_PASSWORD;

if (!TEST_USERNAME || !TEST_PASSWORD) {
  throw new Error(
    "Missing required environment variables. Please check your .env.test file includes E2E_USERNAME and E2E_PASSWORD"
  );
}

test.describe("Manual Flashcard Creation", () => {
  test("should create flashcard manually", async ({ page }) => {
    // 1. Spróbuj przejść bezpośrednio do strony generowania
    await page.goto("/flashcards/generate");

    // 2. Sprawdź czy jesteśmy na stronie logowania i zaloguj się jeśli trzeba
    if (page.url().includes("/login")) {
      const loginPage = new LoginPage(page);
      await loginPage.login(TEST_USERNAME, TEST_PASSWORD);
    }

    // 3. Poczekaj na załadowanie strony generowania
    await page.waitForSelector('[data-testid="flashcard-generation-view"]', { state: "visible" });

    // 4. Kontynuuj test
    const flashcardPage = new FlashcardGenerationPage(page);
    await flashcardPage.switchToManualMode();
    await flashcardPage.createFlashcard("Testowy przód fiszki", "Testowy tył fiszki");
    await flashcardPage.expectSuccessMessage();
    await flashcardPage.expectFormToBeClear();
  });
});
