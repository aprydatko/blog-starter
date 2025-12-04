# 🎯 Quick Reference: Centralized Test Configuration

## ✅ What Changed

### **Before** ❌
```typescript
// jest.unit.config.ts - Lots of configuration
import { Config } from 'jest'
import nextJest from 'next/jest'

const createJestConfig = nextJest({ dir: './' })

const customJestConfig: Config = {
  displayName: 'unit',
  testMatch: ['**/__tests__/unit/**/*.test.ts'],
  setupFilesAfterEnv: ['<rootDir>/jest.setup.js'],
  testEnvironment: 'jest-environment-jsdom',
  moduleNameMapper: { '^@/(.*)$': '<rootDir>/src/$1' },
  collectCoverageFrom: [...],
  coverageThreshold: {...},
  // ... many more lines
}

export default createJestConfig(customJestConfig)
```

```typescript
// Test file - No logging
import { describe, it, expect } from '@jest/globals'

describe('MyTest', () => {
  it('should work', () => {
    expect(true).toBe(true)
  })
})
```

### **After** ✅
```typescript
// jest.unit.config.ts - Clean and simple!
import type { Config } from 'jest'

const config: Config = {
  displayName: 'unit',
  preset: '@blog-starter/jest-presets/browser',
  testMatch: ['**/__tests__/unit/**/*.test.ts', '**/__tests__/unit/**/*.test.tsx']
}

export default config
```

```typescript
// Test file - With structured logging
import { describe, it, expect, beforeEach } from '@jest/globals'
import { logger } from '@blog-starter/logger'

describe('MyTest', () => {
  beforeEach(() => {
    logger.info('Running MyTest')
  })

  it('should work', () => {
    logger.debug('Testing functionality')
    expect(true).toBe(true)
    logger.info('Test passed')
  })
})
```

---

## 📦 Centralized Packages

### **@blog-starter/jest-presets**

Three presets available:

| Preset | Use Case | Environment | Features |
|--------|----------|-------------|----------|
| `@blog-starter/jest-presets/browser` | Unit tests (React) | jsdom | Coverage, React JSX, Module mapping |
| `@blog-starter/jest-presets/node` | Integration tests | node | Serial execution, 30s timeout |
| `@blog-starter/jest-presets/e2e` | E2E tests | node | Serial execution, 60s timeout |

### **@blog-starter/logger**

Pino-based logger with:
- ✅ Structured logging
- ✅ Pretty print in development
- ✅ JSON output in production
- ✅ Automatic timestamps
- ✅ Error serialization

---

## 🎨 Usage Patterns

### **Unit Test Pattern**
```typescript
import { describe, it, expect, beforeEach } from '@jest/globals'
import { logger } from '@blog-starter/logger'
import { MyComponent } from '@/components/MyComponent'

describe('MyComponent', () => {
  beforeEach(() => {
    logger.info('Testing MyComponent')
  })

  it('should render', () => {
    logger.debug('Testing component render')
    // Test code
    logger.info('Component rendered successfully')
  })
})
```

### **Integration Test Pattern**
```typescript
import { describe, it, expect, beforeAll, afterAll } from '@jest/globals'
import { logger } from '@blog-starter/logger'
import { prisma } from '@/lib/prisma'

describe('Database Integration', () => {
  beforeAll(() => {
    logger.info('Setting up database tests')
  })

  afterAll(async () => {
    logger.info('Cleaning up database tests')
    await prisma.$disconnect()
  })

  it('should create record', async () => {
    logger.debug('Creating test record')
    const result = await prisma.post.create({ data: {...} })
    logger.info({ id: result.id }, 'Record created')
    expect(result).toBeDefined()
  })
})
```

### **E2E Test Pattern**
```typescript
import { test, expect } from '@playwright/test'
import { logger } from '@blog-starter/logger'

test.describe('Feature E2E', () => {
  test.beforeAll(() => {
    logger.info('Starting E2E tests')
  })

  test('should work', async ({ page }) => {
    logger.debug('Testing feature')
    await page.goto('/')
    logger.info('Page loaded successfully')
    await expect(page).toHaveTitle(/Title/)
  })
})
```

---

## 📊 Configuration Files

### **apps/web/jest.unit.config.ts**
```typescript
import type { Config } from 'jest'

const config: Config = {
  displayName: 'unit',
  preset: '@blog-starter/jest-presets/browser',
  testMatch: ['**/__tests__/unit/**/*.test.ts', '**/__tests__/unit/**/*.test.tsx']
}

export default config
```

### **apps/web/jest.integration.config.ts**
```typescript
import type { Config } from 'jest'

const config: Config = {
  displayName: 'integration',
  preset: '@blog-starter/jest-presets/node',
  testMatch: ['**/__tests__/integration/**/*.test.ts']
}

export default config
```

### **apps/web/jest.setup.js**
```javascript
import '@testing-library/jest-dom'
import { logger } from '@blog-starter/logger'

// Environment setup
process.env.NODE_ENV = 'test'

// Global hooks with logging
beforeAll(() => {
  logger.info('Starting test suite')
})

afterAll(() => {
  logger.info('Test suite completed')
})

// Mocks
jest.mock('next/navigation', () => ({...}))
```

---

## 🚀 Commands

```bash
# Run all tests
pnpm run test

# Run by type
pnpm run test:unit              # Unit tests
pnpm run test:integration       # Integration tests
pnpm run test:e2e              # E2E tests

# Development
pnpm run test:unit:watch       # Watch mode

# Coverage
pnpm run test:unit:coverage
pnpm run test:integration:coverage

# CI/CD
pnpm run test:ci               # All tests with coverage
```

---

## 📝 Logger Levels

```typescript
logger.trace('Very detailed')    // Lowest level
logger.debug('Debug info')       // Development
logger.info('Information')       // Default
logger.warn('Warning')           // Warnings
logger.error('Error')            // Errors
logger.fatal('Fatal error')      // Highest level
```

### **With Context**
```typescript
logger.info({ userId: 123, action: 'login' }, 'User logged in')
// Output: {"level":"info","userId":123,"action":"login","msg":"User logged in"}
```

---

## 🎯 Benefits Summary

| Aspect | Before | After |
|--------|--------|-------|
| **Config Lines** | ~50 lines per file | ~9 lines per file |
| **Duplication** | High | None |
| **Logging** | console.log | Structured logger |
| **Maintenance** | Update each file | Update preset once |
| **Consistency** | Manual | Automatic |
| **Type Safety** | Partial | Full |

---

## 📚 File Structure

```
packages/
├── jest-presets/
│   ├── browser/jest-preset.js   ← Unit tests config
│   ├── node/jest-preset.js      ← Integration tests config
│   └── e2e/jest-preset.js       ← E2E tests config
└── logger/
    └── src/index.ts             ← Pino logger

apps/web/
├── __tests__/
│   ├── unit/                    ← Uses browser preset
│   ├── integration/             ← Uses node preset
│   └── e2e/                     ← Uses Playwright
├── jest.unit.config.ts          ← 9 lines!
├── jest.integration.config.ts   ← 9 lines!
├── jest.setup.js                ← With logger
└── package.json                 ← Added jest-presets
```

---

## ✨ Key Takeaways

1. **Centralized Configuration**: One place to update all test configs
2. **Structured Logging**: Better debugging and monitoring
3. **Consistent Patterns**: All tests follow the same structure
4. **Less Code**: Reduced configuration boilerplate
5. **Better Maintenance**: Update presets, not individual configs
6. **Type Safety**: Full TypeScript support throughout

---

**Quick Start**: Just import `@jest/globals` and `@blog-starter/logger` in your tests! 🚀
