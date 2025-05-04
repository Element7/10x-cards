import type { Page, Locator } from "@playwright/test";
import { expect } from "@playwright/test";

export class LoginPage {
  readonly page: Page;
  readonly emailInput: Locator;
  readonly passwordInput: Locator;
  readonly signInButton: Locator;

  constructor(page: Page) {
    this.page = page;
    this.emailInput = page.getByLabel("Email");
    this.passwordInput = page.getByLabel("Hasło");
    this.signInButton = page.getByRole("button", { name: "Zaloguj się" });
  }

  async goto() {
    await this.page.goto("/login");
  }

  async login(email: string, password: string) {
    await this.emailInput.fill(email);
    await this.passwordInput.fill(password);

    // Wait for both click and navigation
    await Promise.all([this.page.waitForNavigation(), this.signInButton.click()]);

    // Additional wait to ensure we're fully logged in
    await this.page.waitForLoadState("networkidle");
  }

  async expectToBeOnLoginPage() {
    await expect(this.page).toHaveURL(/.*login/);
    await expect(this.emailInput).toBeVisible();
    await expect(this.passwordInput).toBeVisible();
    await expect(this.signInButton).toBeVisible();
  }
}
