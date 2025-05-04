# Testing Documentation

This project uses Vitest for unit testing and Playwright for end-to-end (E2E) testing.

## Directory Structure

```
tests/
├── e2e/               # Playwright E2E tests
│   ├── pages/         # Page tests
│   │   └── models/    # Page Object Models
│   └── components/    # Component E2E tests
├── unit/              # Vitest unit tests
└── setup/             # Test setup files
```

## Unit Testing with Vitest

Unit tests focus on testing individual components or functions in isolation.

### Running Unit Tests

```bash
# Run all unit tests
npm run test

# Run tests in watch mode during development
npm run test:watch

# Run tests with UI
npm run test:ui

# Generate coverage report
npm run test:coverage
```

### Writing Unit Tests

Unit tests should be placed in the `tests/unit` directory or co-located with the component/function being tested with a `.test.ts` or `.spec.ts` extension.

Example component test:

```typescript
import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import MyComponent from "./MyComponent";

describe("MyComponent", () => {
  it("renders correctly", () => {
    render(<MyComponent />);
    expect(screen.getByText("Hello World")).toBeInTheDocument();
  });
});
```

## E2E Testing with Playwright

E2E tests verify the application works correctly from a user's perspective by simulating real user interactions.

### Running E2E Tests

```bash
# Run all E2E tests
npm run test:e2e

# Run E2E tests with UI
npm run test:e2e:ui

# Run specific test file
npx playwright test tests/e2e/pages/home.spec.ts
```

### Writing E2E Tests

E2E tests should be placed in the `tests/e2e` directory with a `.spec.ts` extension.

We follow the Page Object Model pattern for better maintainability:

1. Create page models in `tests/e2e/pages/models/`
2. Use page models in test files

Example:

```typescript
import { test } from "@playwright/test";
import { HomePage } from "./models/HomePage";

test("user can navigate to about page", async ({ page }) => {
  const homePage = new HomePage(page);
  await homePage.goto();
  await homePage.navigateTo("About");
  // ...additional assertions
});
```

## Best Practices

### Unit Tests

- Tests should be fast and isolated
- Use mocks for external dependencies
- Focus on testing component behavior, not implementation details
- Test edge cases and error conditions

### E2E Tests

- Focus on critical user flows
- Use Page Object Models for maintainability
- Be selective about when to use visual testing
- Make tests deterministic and avoid flaky tests

## CI Integration

Tests are automatically run in the CI pipeline on pull requests and merges to main.
