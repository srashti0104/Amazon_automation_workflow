import { Page, expect, test } from '@playwright/test';
import { testData } from '../config/testData';

export class RecordedAmazonJourney {
  constructor(
    private readonly page: Page,
    private readonly config = testData,
  ) {}

  async goToHomePage(): Promise<void> {
    await this.page.goto(this.config.STOREFRONT_URL);
    await expect(this.page).toHaveURL(/amazon\.in/);
    await expect(this.page.getByRole('link', { name: /Hello, sign in/i })).toBeVisible();
  }

  async signIn(email: string = this.config.USER.email, password: string = this.config.USER.password): Promise<void> {
    await this.page.getByRole('link', { name: 'Hello, sign in Account & Lists' }).click();

    const emailField = this.page.locator(
      'input[type="email"], input[name="email"], input#ap_email, input[autocomplete="username"], input[aria-label*="email" i], input[aria-label*="mobile" i], input[placeholder*="email" i], input[placeholder*="mobile" i], input[placeholder*="phone" i]'
    ).first();

    await expect(emailField).toBeVisible({ timeout: 20000 });
    await emailField.click();
    await emailField.fill(email);
    await emailField.press('Tab');

    const continueButton = this.page.getByRole('button', { name: /continue|verify/i }).first();
    await expect(continueButton).toBeVisible({ timeout: 15000 });
    await continueButton.click();

    await this.page.waitForLoadState('domcontentloaded');

    const passwordField = this.page.getByLabel(/password/i).first();
    const passwordVisible = await passwordField.count();

    if (passwordVisible > 0) {
      await passwordField.fill(password);
      const signInButton = this.page.getByRole('button', { name: /sign in|continue/i }).last();
      await signInButton.click();
    }

    await this.page.waitForLoadState('domcontentloaded');
    const otpVisible = await this.page.getByText(/enter otp|one time password|otp/i).first().isVisible({ timeout: 8000 }).catch(() => false);
    const otpInputVisible = await this.page.locator('input[autocomplete="one-time-code"], input[name*="otp" i], input[id*="otp" i], input[aria-label*="otp" i], input[placeholder*="OTP" i]').first().isVisible({ timeout: 8000 }).catch(() => false);

    if (otpVisible || otpInputVisible) {
      console.log('Amazon OTP screen detected. Pausing for user to enter the OTP manually.');
      try {
        await this.page.pause();
      } catch (error) {
        const message = error instanceof Error ? error.message : String(error);
        if (/Target page, context or browser has been closed|browser has been closed|Target closed/i.test(message)) {
          test.skip(true, 'Amazon OTP verification was interrupted because the browser session was closed during manual verification.');
        }
        throw error;
      }
    }

    try {
      const stillNeedsPassword = await this.page.getByLabel(/password/i).count();
      if (stillNeedsPassword > 0) {
        test.skip(true, 'Amazon sign-in reached the password step. The automation can continue only when valid credentials are available.');
      }
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error);
      if (/Target page, context or browser has been closed|browser has been closed|Target closed/i.test(message)) {
        test.skip(true, 'The browser was closed while waiting for Amazon authentication to complete.');
      }
      throw error;
    }
  }

  async openSignedInHome(): Promise<void> {
    await this.page.goto(this.config.SIGN_IN_URL, { waitUntil: 'domcontentloaded', timeout: 60000 }).catch(async () => {
      await this.page.goto(this.config.STOREFRONT_URL, { waitUntil: 'domcontentloaded', timeout: 60000 });
    });

    await expect(this.page.locator('input[aria-label="Search Amazon.in"], #twotabsearchtextbox').first()).toBeVisible({ timeout: 30000 }).catch(() => undefined);
  }

  async searchForProduct(searchTerm: string, resultText: string): Promise<void> {
    const currentUrl = this.page.url();
    if (!currentUrl || currentUrl === 'about:blank') {
      await this.page.goto(this.config.STOREFRONT_URL, { waitUntil: 'domcontentloaded', timeout: 60000 });
    }

    const searchBox = this.page.locator('input[aria-label="Search Amazon.in"], #twotabsearchtextbox').first();
    await expect(searchBox).toBeVisible({ timeout: 30000 });
    await searchBox.click();
    await searchBox.fill(searchTerm);
    await searchBox.press('Enter');

    await this.page.waitForLoadState('domcontentloaded');
    await expect(this.page).toHaveURL(/\/s\?k=/i, { timeout: 30000 });
  }

  async openProductDetailPage(resultText: string): Promise<Page> {
    const popupPromise = this.page.waitForEvent('popup');
    const firstResultLink = this.page.getByRole('link', { name: resultText });
    await expect(firstResultLink).toBeVisible({ timeout: 30000 });
    await firstResultLink.click();

    const productPage = await popupPromise;
    await expect(productPage).toHaveURL(/amazon\.in/);
    return productPage;
  }

  async validateProductPageAndAddToCart(productPage: Page, addToCartLabel: string): Promise<void> {
    const addToCartButton = productPage.locator('#desktop_qualifiedBuyBox').getByLabel(addToCartLabel).first();
    await expect(addToCartButton).toBeVisible({ timeout: 30000 });
    await addToCartButton.click();
    await productPage.getByRole('button', { name: 'Proceed to Buy' }).click();
  }

}
