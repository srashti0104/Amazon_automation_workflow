# Amazon Shopping Journey

Playwright and TypeScript automation for a configurable Amazon.in shopping flow.

The active scenario opens Amazon, signs in with optional environment credentials, pauses for manual OTP entry when required, searches for a configured term, opens the first matching result, adds it to the cart, and proceeds toward checkout. It does not place an order.

## Prerequisites

- Node.js 16 or later
- npm
- Internet access to Amazon.in
- Chromium installed by Playwright

## Setup

```bash
npm install
npx playwright install chromium
```

Set credentials in PowerShell. Do not commit them:

```powershell
$env:AMAZON_EMAIL = 'your-email-or-phone'
$env:AMAZON_PASSWORD = 'your-password'
```

The fallback values in `tests/config/testData.ts` are placeholders.

## Run

```bash
npm test
```

Run visibly in Chromium:

```bash
npx playwright test tests/amazon-shopping-journey.spec.ts --headed --workers=1 --reporter=line
```

Run only the coffee scenario:

```bash
npx playwright test tests/amazon-shopping-journey.spec.ts --grep "coffee" --headed --workers=1 --reporter=line
```

Run the iPhone test case when an `iphone` scenario is present in `tests/data/amazonScenarios.ts`:

```bash
npx playwright test tests/amazon-shopping-journey.spec.ts --headed --workers=1 --reporter=line
```

### Manual OTP step

Login is intentionally paused when Amazon displays the OTP screen:

1. Enter the OTP manually in the visible Amazon browser window.
2. Click **Resume** in the Playwright Inspector to continue automation.

The test will not continue to search or purchase steps until the manual OTP verification is completed and resumed.

View the HTML report:

```bash
npm run test:report
```

## Active Structure

```text
tests/
├── amazon-shopping-journey.spec.ts
├── config/testData.ts
├── data/amazonScenarios.ts
└── pages/RecordedAmazonJourney.ts
```

`RecordedAmazonJourney` owns the active selectors and flow. `amazonScenarios.ts` contains scenario data. The runner creates one test per scenario.

## Configuration

Edit `tests/data/amazonScenarios.ts` to add or change scenarios:

- `name`: test name and grep target
- `searchTerm`: Amazon search text
- `resultText`: text used to identify the first result to open
- `addToCartLabel`: Add to Cart accessible label

Edit `tests/config/testData.ts` for storefront URLs and environment-based credentials. Product prices, payment options, and fixed checkout URLs are not part of the active flow.

## Safety and Limitations

- The flow stops before order placement. No payment or order is submitted.
- Amazon may require OTP, CAPTCHA, address confirmation, or other manual verification.
- Amazon's live DOM, redirects, inventory, cart, and checkout behavior can change between runs.
- A headed run is recommended when investigating authentication or live-site behavior.

## Reports and Artifacts

The HTML report is written to `playwright-report/`. Traces, screenshots, and error context are written to `test-results/` according to `playwright.config.js`.

See [AI_AGENT_USAGE.md](AI_AGENT_USAGE.md) for development history and [SUBMISSION_CHECKLIST.md](SUBMISSION_CHECKLIST.md) for the current verification checklist.
