# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Structure

This is a monorepo using Bun workspaces with the following structure:

- `apps/api/` - Hono-based GraphQL API server using Tigris DB
- `apps/web/` - TanStack Start React application with Tailwind CSS
- `apps/mobile/` - React Native app with Expo for cross-platform mobile
- `packages/domain/` - Domain object logic and TypeScript types

## Development Commands

```bash
# Install dependencies
bun install

# Development (runs both API and web concurrently)
bun run dev

# Individual app development
bun run dev:api    # API server on port 3001
bun run dev:web    # Web app development server
bun run dev:mobile # Mobile app development server

# Build all apps
bun run build

# Type checking across all packages
bun run type-check

# Linting across all packages
bun run lint

# Code formatting
bun run format

# Clean build artifacts
bun run clean
```

## Architecture

### API (`apps/api/`)

- **Framework**: Hono with GraphQL Yoga
- **Database**: Tigris DB for data persistence
- **Schema**: GraphQL schema defined in `src/schema.ts`
- **Types**: Shared types from `@crate/shared`
- **Port**: 3001

### Web App (`apps/web/`)

- **Framework**: TanStack Start (React-based)
- **Routing**: TanStack Router with file-based routing
- **State Management**: TanStack Query for server state
- **Styling**: Tailwind CSS
- **GraphQL Client**: graphql-request

### Domain Package (`packages/domain/`)

- Contains TypeScript interfaces and types used to access the domain

### Mobile App (`apps/mobile/`)

- **Framework**: React Native with Expo
- **State Management**: TanStack Query for server state
- **Validation**: Zod for form validation
- **GraphQL Client**: Fetch API with custom GraphQL client

## Key Technologies

- **Runtime**: Bun (package manager and runtime)
- **Language**: TypeScript with strict configuration
- **API**: Hono + GraphQL Yoga + Tigris DB
- **Frontend**: React + TanStack Start + TanStack Query + Tailwind CSS
- **Mobile**: React Native + Expo + TanStack Query
- **Development**: Hot reloading enabled for both API and web

## Code Style

- Uses Prettier with single quotes, semicolons, and trailing commas
- ESLint with TypeScript rules
- Strict TypeScript configuration with unused variable checks
- Prefer composition of smaller functions to large multi-purpose functions
- Use ES modules (import/export) syntax, not CommonJS (require)
- Destructure imports when possible (eg. import { foo } from 'bar')
- Favor functional style over object oriented over procedural
- Prefer function() syntax to () =>

## Workflow

- always run type-check after any changeset and ensure there are no type errors
- always run bun test after any changeset and ensure all tests pass
- be terse in the explanation of changes
