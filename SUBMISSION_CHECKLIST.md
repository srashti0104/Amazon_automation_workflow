# Submission Checklist

## Project

- [x] Playwright test suite is configured.
- [x] TypeScript source is used for the active test flow.
- [x] The active scenario is data-driven.
- [x] Credentials are read from environment variables.
- [x] OTP is handled through a visible headed-browser pause.
- [x] User manually enters the OTP and resumes the Playwright Inspector.
- [x] The first matching search result is selected without a hard-coded full product title.
- [x] The flow reaches Add to Cart and proceeds toward checkout.
- [x] The flow stops before placing an order.
- [x] Generated unused page objects, sample tests, and legacy helpers were removed.

## Verification Commands

```bash
npm install
npx tsc --noEmit --allowJs false --module Node16 --target es2022 --moduleResolution Node16 --esModuleInterop --skipLibCheck --types node tests/pages/RecordedAmazonJourney.ts tests/amazon-shopping-journey.spec.ts tests/data/amazonScenarios.ts tests/config/testData.ts
npx playwright test tests/amazon-shopping-journey.spec.ts --grep "coffee" --headed --workers=1 --reporter=line
npx playwright test tests/amazon-shopping-journey.spec.ts --headed --workers=1 --reporter=line
```

The iPhone command runs only when an `iphone` scenario exists in `tests/data/amazonScenarios.ts`.

## Security

- [x] Credentials are supplied through `AMAZON_EMAIL` and `AMAZON_PASSWORD`.
- [x] No real credentials should be committed.
- [x] No payment or order submission is automated.
- [x] OTP and CAPTCHA are not bypassed.

## Live-Site Limitations

Amazon may change selectors, redirects, product availability, cart behavior, or checkout requirements. Inspect the headed browser and Playwright report before changing selectors after a live-site failure.
