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
    
    // 2. Sprawdź czy jesteśmy na stronie logowania
    if (page.url().includes("/login")) {
      const loginPage = new LoginPage(page);
      await loginPage.login(TEST_USERNAME, TEST_PASSWORD);
      // Poczekaj na przekierowanie po zalogowaniu
      await expect(page).toHaveURL(/.*\/flashcards\/generate/);
    }

    // 3. Teraz powinniśmy być na stronie generowania
    const flashcardPage = new FlashcardGenerationPage(page);
    await flashcardPage.switchToManualMode();

    // 4. Stwórz fiszkę
    await flashcardPage.createFlashcard("Testowy przód fiszki", "Testowy tył fiszki");

    // 5. Sprawdź czy operacja się powiodła
    await flashcardPage.expectSuccessMessage();

    // 6. Sprawdź czy formularz został wyczyszczony
    await flashcardPage.expectFormToBeClear();
  });
});
