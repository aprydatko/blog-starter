---
trigger: always_on
---

# Project Structure

This document provides an overview of the project's file and folder structure.

## Root Directory

- **`apps/`**: Contains the application workspaces.
- **`packages/`**: Contains shared packages and configurations.
- **`docker-compose.yml`**: Docker configuration for local development services (e.g., PostgreSQL).
- **`turbo.json`**: Configuration for Turborepo pipeline.
- **`package.json`**: Root package file defining workspaces and scripts.
- **`pnpm-workspace.yaml`**: Defines the pnpm workspace structure.

## Applications (`apps/`)

### `apps/web`
The main Next.js application using the App Router.

- **`src/`**
  - **`app/`**: Contains the application routes, layouts, and pages (Next.js App Router).
    - `api/`: API routes.
    - `layout.tsx`: Root layout.
    - `page.tsx`: Home page.
    - `globals.css`: Global styles.
  - **`components/`**: Application-specific UI components.
    - `auth-components.tsx`: Authentication related components.
  - **`lib/`**: Utility functions and shared logic.
    - `auth.ts`: Authentication configuration.
    - `prisma.ts`: Prisma client instance.
    - `middleware.ts`: Middleware configuration.
- **`public/`**: Static assets served by Next.js.
- **`next.config.ts`**: Next.js configuration.

## Packages (`packages/`)

### `packages/database`
Prisma ORM setup and database client.

- **`prisma/`**: Contains the Prisma schema (`schema.prisma`) and migrations.
- **`src/`**: Source code for the database client.
  - `client.ts`: Exports the Prisma client.

### `packages/ui`
Shared React UI component library.

- **`src/`**: Source code for components.
  - `card.tsx`: Example card component.
  - `styles.css`: Base styles for the UI package.

### `packages/eslint-config`
Shared ESLint configurations to ensure code consistency across the monorepo.

### `packages/tailwind-config`
Shared Tailwind CSS configurations to maintain consistent styling.

### `packages/typescript-config`
Shared TypeScript configurations (`tsconfig.json`) to standardize compiler options.
