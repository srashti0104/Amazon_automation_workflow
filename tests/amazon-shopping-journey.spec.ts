import { test } from '@playwright/test';
import { RecordedAmazonJourney } from './pages/RecordedAmazonJourney';
import { testData } from './config/testData';
import { amazonScenarios } from './data/amazonScenarios';

test.describe('Amazon recorded shopping journey', () => {
  for (const scenario of amazonScenarios) {
    test(`Use the recorded Amazon locators and URLs with validations for ${scenario.name}`, async ({ page }) => {
      const amazonFlow = new RecordedAmazonJourney(page, testData);

      await amazonFlow.goToHomePage();
      await amazonFlow.signIn(testData.USER.email);
      await amazonFlow.openSignedInHome();
      await amazonFlow.searchForProduct(scenario.searchTerm, scenario.resultText);

      const productPage = await amazonFlow.openProductDetailPage(scenario.resultText);
      await amazonFlow.validateProductPageAndAddToCart(productPage, scenario.addToCartLabel, scenario.proceedToBuyLabel);
    });
  }
});
