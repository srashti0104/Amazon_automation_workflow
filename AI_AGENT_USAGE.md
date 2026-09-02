# AI Agent Usage

## Project

Amazon.in shopping automation using Playwright and TypeScript.

## How AI Was Used

GitHub Copilot was used to help inspect the recorded Playwright flow, refactor selectors into `RecordedAmazonJourney`, parameterize the active scenario, and update project documentation. All generated changes were reviewed against the live Amazon UI and verified with focused Playwright runs.

## Final Architecture

The final implementation intentionally has a small active surface:

- `tests/amazon-shopping-journey.spec.ts` runs the scenario loop.
- `tests/data/amazonScenarios.ts` stores the coffee search scenario.
- `tests/config/testData.ts` stores storefront URLs and environment-based credentials.
- `tests/pages/RecordedAmazonJourney.ts` owns navigation, email-first authentication, OTP pause handling, search, first-result selection, Add to Cart, and checkout navigation.

Unused generated page objects, sample tests, diagnostics helpers, and legacy configuration were removed after reference checks.

## Engineering Decisions

### Data-driven search

The runner passes `scenario.searchTerm` and `scenario.resultText` into the flow. Product selection does not depend on a hard-coded full product title; it opens the first matching Amazon result.

### Manual authentication boundary

The flow does not bypass Amazon OTP or CAPTCHA. When OTP is detected, a headed run pauses so the user can complete verification manually.

### Live-site synchronization

Selectors use Playwright locators and condition-based assertions. Amazon is a live site, so redirects, markup, inventory, cart state, and checkout behavior may vary by account and session.

### Purchase safety

The active flow stops before order placement. It does not submit payment or create an order.

## Verification

The active TypeScript files were compiled with the installed TypeScript compiler. The headed coffee scenario was run against Amazon.in and reached authentication, search, first-result selection, Add to Cart, and checkout navigation. Runtime results can vary because authentication and checkout are controlled by Amazon's live session state.

## Lessons Learned

- Recorded selectors are useful starting points but must be checked against current markup.
- Full product-title matching is fragile on search results; first-result selection better matches the requested scenario behavior.
- Amazon may redirect during normal navigation, so URL assertions must not assume one exact query string.
- OTP and live checkout state require an explicit manual or environment-specific boundary.
- Documentation must be updated when generated scaffolding is removed or the active flow is narrowed.
