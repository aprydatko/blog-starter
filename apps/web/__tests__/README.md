# Test Structure

This document describes the testing structure for the `apps/web` application.

## Directory Structure

```
apps/web/
├── __tests__/
│   ├── e2e/                          # End-to-End tests
│   │   ├── app.e2e.test.ts          # E2E test for the app
│   │   ├── auth.e2e.test.ts         # E2E test for authentication
│   │   └── blog.e2e.test.ts         # E2E test for blog functionality
│   ├── integration/                  # Integration tests
│   │   ├── api.integration.test.ts  # API integration tests
│   │   ├── auth.integration.test.ts # Auth integration tests
│   │   └── database.integration.test.ts # Database integration tests
│   └── unit/                         # Unit tests
│       ├── components/
│       │   ├── AuthComponents.test.tsx # Unit test for Auth components
│       │   └── Layout.test.tsx      # Unit test for Layout component
│       ├── services/
│       │   ├── authService.test.ts  # Unit test for Auth service
│       │   └── prismaService.test.ts # Unit test for Prisma service
│       └── utils/
│           ├── formatUtils.test.ts  # Unit test for format utils
│           └── validationUtils.test.ts # Unit test for validation utils
├── jest.setup.js                     # Global Jest setup
├── jest.unit.config.ts              # Jest config for unit tests
├── jest.integration.config.ts       # Jest config for integration tests
├── jest.e2e.config.ts               # Jest config for E2E tests (Playwright)
└── playwright.config.ts             # Playwright configuration
```

## Test Types

### Unit Tests
Unit tests focus on testing individual components, functions, and modules in isolation.

**Location**: `__tests__/unit/`

**Run with**:
```bash
pnpm run test:unit
pnpm run test:unit:watch    # Watch mode
pnpm run test:unit:coverage # With coverage
```

### Integration Tests
Integration tests verify that different parts of the application work together correctly.

**Location**: `__tests__/integration/`

**Run with**:
```bash
pnpm run test:integration
pnpm run test:integration:coverage # With coverage
```

### E2E Tests
End-to-end tests simulate real user scenarios using Playwright.

**Location**: `__tests__/e2e/`

**Run with**:
```bash
pnpm run test:e2e
```

## Running Tests

### Run all tests
```bash
pnpm run test
# or
pnpm run test:all
```

### Run specific test type
```bash
pnpm run test:unit
pnpm run test:integration
pnpm run test:e2e
```

### Run tests in CI
```bash
pnpm run test:ci
```

This command runs all tests with coverage reports suitable for CI/CD pipelines.

## Configuration Files

### jest.setup.js
Global setup file for Jest that:
- Imports `@testing-library/jest-dom` for additional matchers
- Sets up environment variables for tests
- Mocks Next.js router and navigation
- Configures global test hooks

### jest.unit.config.ts
Configuration for unit tests:
- Uses `jest-environment-jsdom` for DOM testing
- Includes coverage thresholds
- Configured for React component testing

### jest.integration.config.ts
Configuration for integration tests:
- Uses `node` environment
- Runs tests serially to avoid database conflicts
- Extended timeout for longer-running tests

### jest.e2e.config.ts
Configuration for E2E tests:
- Uses Playwright preset
- Extended timeout for browser tests
- Runs tests serially

### playwright.config.ts
Playwright configuration:
- Tests multiple browsers (Chromium, Firefox, WebKit)
- Mobile viewport testing
- Automatic dev server startup
- Screenshot and trace on failure

## Writing Tests

### Unit Test Example
```typescript
import { render, screen } from '@testing-library/react'
import { describe, it, expect } from '@jest/globals'
import MyComponent from '@/components/MyComponent'

describe('MyComponent', () => {
  it('should render correctly', () => {
    render(<MyComponent />)
    expect(screen.getByText('Hello')).toBeInTheDocument()
  })
})
```

### Integration Test Example
```typescript
import { describe, it, expect } from '@jest/globals'
import { prisma } from '@/lib/prisma'

describe('Database Integration', () => {
  it('should create a record', async () => {
    const result = await prisma.post.create({
      data: { title: 'Test', content: 'Content', slug: 'test' }
    })
    expect(result).toBeDefined()
  })
})
```

### E2E Test Example
```typescript
import { test, expect } from '@playwright/test'

test('should navigate to page', async ({ page }) => {
  await page.goto('/')
  await expect(page).toHaveTitle(/My App/)
})
```

## Best Practices

1. **Organize tests by type**: Keep unit, integration, and E2E tests separate
2. **Use descriptive test names**: Test names should clearly describe what is being tested
3. **Follow AAA pattern**: Arrange, Act, Assert
4. **Mock external dependencies**: Use mocks for external services in unit tests
5. **Clean up after tests**: Use `afterEach` or `afterAll` to clean up test data
6. **Use data-testid**: Add `data-testid` attributes to elements for reliable selection
7. **Test user behavior**: Focus on testing how users interact with the app
8. **Keep tests independent**: Each test should be able to run independently
9. **Use coverage reports**: Aim for high coverage but focus on meaningful tests
10. **Run tests before committing**: Ensure all tests pass before pushing code

## Coverage Thresholds

Unit tests have the following coverage thresholds:
- Branches: 70%
- Functions: 70%
- Lines: 70%
- Statements: 70%

## Debugging Tests

### Debug unit tests
```bash
node --inspect-brk node_modules/.bin/jest --runInBand
```

### Debug E2E tests
```bash
pnpm run test:e2e --debug
```

### View Playwright test results
```bash
npx playwright show-report
```

## CI/CD Integration

The `test:ci` script is optimized for CI/CD pipelines:
- Runs all test types
- Generates coverage reports
- Fails if coverage thresholds are not met
- Produces artifacts for test results

## Dependencies

### Testing Libraries
- **Jest**: Test runner and assertion library
- **@testing-library/react**: React component testing utilities
- **@testing-library/jest-dom**: Custom Jest matchers for DOM
- **@playwright/test**: E2E testing framework
- **jest-environment-jsdom**: DOM environment for Jest

### Type Definitions
- **@types/jest**: TypeScript definitions for Jest
- **@types/testing-library__jest-dom**: TypeScript definitions for jest-dom

## Next Steps

1. Install dependencies: `pnpm install`
2. Run tests: `pnpm run test`
3. Add more test cases as you develop new features
4. Maintain high test coverage
5. Update this documentation as the test structure evolves
