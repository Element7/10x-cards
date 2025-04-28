import { test, expect } from "@playwright/test";
import { LoginPage } from "../page-objects/LoginPage";

// Sprawdź czy zmienne środowiskowe są ustawione
const TEST_USERNAME = process.env.E2E_USERNAME;
const TEST_PASSWORD = process.env.E2E_PASSWORD;

if (!TEST_USERNAME || !TEST_PASSWORD) {
  throw new Error(
    "Missing required environment variables. Please check your .env.test file includes TEST_USERNAME and TEST_PASSWORD"
  );
}

test.describe("Authentication", () => {
  test("should login and redirect to generate page", async ({ page }) => {
    const loginPage = new LoginPage(page);

    // Przejdź na stronę logowania
    await loginPage.goto();
    await loginPage.expectToBeOnLoginPage();

    // Zaloguj się używając danych z .env.test
    await loginPage.login(TEST_USERNAME, TEST_PASSWORD);

    // Sprawdź czy zostaliśmy przekierowani na stronę generowania fiszek
    await expect(page).toHaveURL(/.*\/flashcards\/generate/);

    // Sprawdź czy strona generowania fiszek się załadowała
    await expect(page.getByTestId("flashcard-generation-view")).toBeVisible();
    await expect(page.getByTestId("page-title")).toHaveText("Generowanie fiszek");
  });
});
