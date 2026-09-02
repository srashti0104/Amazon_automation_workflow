# Quick Start

## Install

```bash
npm install
npx playwright install chromium
```

Set credentials in PowerShell for the current session:

```powershell
$env:AMAZON_EMAIL = 'your-email-or-phone'
$env:AMAZON_PASSWORD = 'your-password'
```

## Run the Coffee Scenario

```bash
npx playwright test tests/amazon-shopping-journey.spec.ts --headed --workers=1 --reporter=line
```

The browser opens visibly. When Amazon asks for an OTP:

1. Enter the OTP manually in the Amazon browser window.
2. Click **Resume** in the Playwright Inspector.

Automation then continues with the coffee search, first-result selection, Add to Cart, and checkout navigation without placing an order.

To run the iPhone test case when its scenario is configured:

```bash
npx playwright test tests/amazon-shopping-journey.spec.ts --grep "iphone" --headed --workers=1 --reporter=line
```

## View the Report

```bash
npm run test:report
```

The HTML report is in `playwright-report/`; failure artifacts are in `test-results/`.

## Change the Scenario

Edit `tests/data/amazonScenarios.ts` and update `name`, `searchTerm`, `resultText`, and `addToCartLabel`. The runner uses `scenario.searchTerm`; changing unrelated legacy configuration will not change the active test.

See [README.md](README.md) for full setup and limitations.
