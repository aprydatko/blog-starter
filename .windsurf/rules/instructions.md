---
trigger: manual
---

# AI Coding Assistant Instructions for blog-starter

## Architecture Overview

This is a **monorepo using Turbo** with a Next.js blog application and shared packages. Key components:

- **apps/web**: Next.js 16 blog application (React 19) with authentication
- **packages/database**: Prisma schema and database client (exports `@blog-starter/db`)
- **packages/logger**: Pino-based structured logger (exports `@blog-starter/logger`)
- **packages/ui, eslint-config, tailwind-config, etc**: Shared utilities

**Data Flow**: Web app → Prisma Client → PostgreSQL. Authentication via NextAuth v5 + GitHub OAuth.

## Essential Setup & Build Commands

**Workspace Setup** (root directory):
```bash
pnpm install          # Install all dependencies
pnpm dev             # Start all dev servers (web, db client watch)
pnpm build           # Build all packages
pnpm lint            # Lint all packages
pnpm test            # Run all test types (unit → integration → e2e)
```

**Database Operations** (use at root, applies to `@blog-starter/db` package):
```bash
pnpm generate        # Regenerate Prisma Client after schema changes
pnpm migrate         # Create + apply migrations in dev
pnpm seed            # Populate database with seed data
pnpm studio          # Open Prisma Studio UI (http://localhost:5555)
pnpm reset           # Drop & recreate dev database (careful!)

# Environment-specific (prefixed with :test or :prod)
pnpm migrate:test    # Apply migrations to test database
pnpm seed:test       # Seed test database
pnpm reset:test      # Reset test database
```

**Testing** (in apps/web):
```bash
pnpm test:unit              # Jest (jsdom) - component/function tests
pnpm test:integration       # Jest (node) - API/database tests  
pnpm test:e2e               # Playwright - full user flows
pnpm test:unit:watch        # Development mode with watch
pnpm test:unit:coverage     # Generate coverage report
```

## Project-Specific Patterns

### Monorepo Structure

**Workspace Dependencies**: Reference local packages with `workspace:*` in package.json:
```json
{
  "@blog-starter/logger": "workspace:*",
  "@blog-starter/db": "workspace:*"
}
```

**Filtered Commands**: Run tasks for specific packages only:
```bash
turbo run build --filter web           # Build only web app
turbo run test --filter @blog-starter/db  # Test only db package
```

### Database & Prisma

**Schema Location**: [packages/database/prisma/schema.prisma](packages/database/prisma/schema.prisma)

**Key Characteristics**:
- PostgreSQL with `@prisma/adapter-pg` (connection pooling)
- Generated client location: `packages/database/src/generated/prisma/client`
- All model names map to snake_case table names (`@@map("table_name")`)
- Enums: `UserRole` (USER, ADMIN)
- Core models: User, Post, Comment, Tag, Category, Media, Account, Session

**Client Usage**:
```typescript
// Import from the exported package
import { prisma } from '@blog-starter/db'

// Always use prisma singleton for connection pooling
const post = await prisma.post.create({ data: { /* ... */ } })
```

**Singleton Pattern** (see [packages/database/src/client.ts](packages/database/src/client.ts)):
- Single Prisma instance reused across requests
- In dev: stored on `globalForPrisma.prisma` to prevent hot-reload issues
- Do NOT create new `PrismaClient()` instances

### Authentication

**Framework**: NextAuth.js v5 beta (GitHub OAuth provider)

**Session Type** (from tests):
```typescript
session: {
  user: {
    id: string
    name: string | null
    email: string | null
    image: string | null
  }
}
```

**Usage**:
```typescript
// Server Components/Actions
import { auth } from '@/lib/auth'
const session = await auth()

// Client Components
'use client'
import { useSession } from 'next-auth/react'
const { data: session, status } = useSession()
```

### Logging

**Import**: `import { logger } from '@blog-starter/logger'`

**Patterns** (see [packages/logger/README.md](packages/logger/README.md)):
```typescript
// Structured logging (preferred)
logger.info({ userId, action }, 'User action')

// With errors
logger.error({ err: error }, 'Operation failed')

// Log levels (controlled via LOG_LEVEL env var)
logger.debug, logger.info, logger.warn, logger.error, logger.fatal
```

**Output**: Pretty-printed in dev, JSON in production.

### Testing Structure

**Location**: [apps/web/__tests__](apps/web/__tests__)

**Three Test Types** (each has separate Jest config):
1. **Unit** ([jest.unit.config.ts](apps/web/jest.unit.config.ts)): Component/function isolation with `jest-environment-jsdom`
2. **Integration** ([jest.integration.config.ts](apps/web/jest.integration.config.ts)): API/database with `node` environment, serial execution
3. **E2E** ([playwright.config.ts](apps/web/playwright.config.ts)): Real browser flows (Chromium, Firefox, WebKit)

**Setup & Mocks** ([jest.setup.js](apps/web/jest.setup.js)):
- CSS imports mocked
- `next/font/google` mocked
- Logger mocked globally
- `useSession` mocked to return authenticated user by default

**AAA Pattern**:
```typescript
// Arrange: Set up test data
const user = { id: '123', name: 'Test' }

// Act: Execute function/render component
render(<Component user={user} />)

// Assert: Verify outcome
expect(screen.getByText('Test')).toBeInTheDocument()
```

**Data Cleanup**: Use `afterEach` in integration tests to clean up Prisma records.

## Shared Configuration Packages

- **eslint-config**: Exports `nextJsConfig` for Next.js projects
- **tailwind-config**: Provides Tailwind CSS base configuration
- **typescript-config**: Base TypeScript configs for different project types
- **jest-presets**: Browser, E2E, and Node presets for testing

## Development Environment

**Local Services** (docker-compose.yml):
- PostgreSQL 16 (port 5432)
- PgAdmin (port 5050)
- Redis 7 (port 6379)

**Start services**:
```bash
docker-compose up -d
```

**Environment Files**:
- `.env`: Development database
- `.env.test`: Test database (used by `migrate:test`, `seed:test`, etc.)
- `.env.production`: Production database

## Common Tasks

**Add a new database model**: 
1. Edit [schema.prisma](packages/database/prisma/schema.prisma)
2. Run `pnpm generate` (regenerates client)
3. Run `pnpm migrate` (creates migration)

**Create a new API route**:
- Files in `apps/web/src/app/` (Next.js App Router)
- Use `auth()` for session in route handlers
- Return `NextResponse.json()`

**Add a shared component**:
- Create in [packages/ui/src/](packages/ui/src/)
- Export from package.json in packages/ui
- Import with `@blog-starter/ui`

**Fix type errors**:
- Run `pnpm check-types` (runs TypeScript across all packages)
- Check [tsconfig.json](apps/web/tsconfig.json) for path aliases

## Critical Dependencies & Versions

- Next.js 16.0.6 (latest stable)
- React 19.2.0 (latest with server components)
- Prisma 7.0.1 with PostgreSQL adapter
- NextAuth.js 5.0.0-beta.30
- Tailwind CSS 4 with `@tailwindcss/postcss`
- TypeScript 5.9.3
- pnpm 10.20.0 (required package manager)

## When Making Changes

- **Always regenerate types**: After Prisma schema changes, run `pnpm generate`
- **Run test suite**: Changes should pass `pnpm test` before commit
- **Check linting**: `pnpm lint` must pass with zero warnings
- **Preserve patterns**: Match existing code style for tests, logging, and database queries
