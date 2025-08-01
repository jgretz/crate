# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Structure

This is a monorepo using Bun workspaces with the following structure:

- `apps/api/` - Hono-based GraphQL API server using MongoDB
- `apps/web/` - TanStack Start React application with Tailwind CSS
- `apps/mobile/` - React Native app with Expo for cross-platform mobile
- `packages/domain/` - Domain business logic and MongoDB repositories
- `packages/iocdi/` - Custom IoC/DI container for functional architecture

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

# Mobile platform specific
bun run mobile:ios     # Run iOS simulator
bun run mobile:android # Run Android emulator

# Type checking across all packages
bun run type-check

# Linting across all packages
bun run lint

# Code formatting
bun run format

# Clean build artifacts
bun run clean

# Testing (only iocdi package has tests currently)
bun test packages/iocdi/tests/
```

## Architecture

### API (`apps/api/`)

- **Framework**: Hono with GraphQL Yoga
- **Database**: MongoDB for data persistence
- **Schema**: GraphQL schema assembled from modular type definitions and resolvers
- **Authentication**: JWT-based auth with context injection
- **Dependency Injection**: Uses custom `@crate/iocdi` for functional DI
- **Port**: 3001

### Web App (`apps/web/`)

- **Framework**: TanStack Start (React-based)
- **Routing**: TanStack Router with file-based routing in `src/routes/`
- **State Management**: TanStack Query for server state
- **Styling**: Tailwind CSS v4 with Radix UI components
- **GraphQL Client**: graphql-request
- **UI Components**: Custom components in `src/components/ui/` built on Radix primitives

### Mobile App (`apps/mobile/`)

- **Framework**: React Native with Expo SDK 53
- **Navigation**: Expo Router with file-based routing
- **State Management**: TanStack Query for server state
- **Authentication**: SecureStore for token persistence
- **Validation**: Zod for form validation
- **Share Extension**: Custom iOS/Android share extension for bookmarking URLs

### Domain Package (`packages/domain/`)

- **Architecture**: Functional domain layer with service-repository pattern
- **Database**: MongoDB with custom repository implementations
- **Services**: Business logic for links and users (CRUD operations)
- **Dependency Injection**: Integrated with `@crate/iocdi` container

### IoC/DI Package (`packages/iocdi/`)

- **Purpose**: Custom functional dependency injection container
- **Pattern**: Function-based injection using `InjectIn` decorator
- **State Management**: Global state container for dependency resolution
- **Testing**: Comprehensive test suite in `tests/` directory

## Key Technologies

- **Runtime**: Bun (package manager and runtime)
- **Language**: TypeScript with strict configuration
- **API**: Hono + GraphQL Yoga + MongoDB
- **Frontend**: React 19 + TanStack Start + TanStack Query + Tailwind CSS v4
- **Mobile**: React Native 0.79.5 + Expo 53 + TanStack Query
- **Database**: MongoDB with custom repository pattern
- **Authentication**: JWT tokens with secure storage

## Code Style

- Uses Prettier with single quotes, semicolons, and trailing commas
- ESLint with TypeScript rules
- Strict TypeScript configuration with unused variable checks
- Prefer composition of smaller functions to large multi-purpose functions
- Use ES modules (import/export) syntax, not CommonJS (require)
- Destructure imports when possible (eg. import { foo } from 'bar')
- Favor functional style over object oriented over procedural
- Prefer function() syntax to () =>
- Only use comments to explain the why something happens and be terse - no "marking comments"

## Workflow

- Always run `bun run type-check` after any changeset and ensure there are no type errors
- Always run `bun test packages/iocdi/tests/` after changes to the iocdi package
- Be terse in the explanation of changes
- Do not create md files explaining what you did unless explicitly directed

## Important Reminders

- Do what has been asked; nothing more, nothing less
- NEVER create files unless they're absolutely necessary for achieving your goal
- ALWAYS prefer editing an existing file to creating a new one
- NEVER proactively create documentation files (*.md) or README files unless explicitly requested