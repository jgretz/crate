# Crate Mobile App

React Native mobile application for managing links, built with Expo.

## Features

- ✅ View all links
- ✅ Add new links with URL, title, and optional description
- ✅ Delete links with confirmation
- ✅ Open links in external browser
- ✅ Validation with Zod schemas
- ✅ State management with TanStack Query
- ✅ Native mobile UI patterns

## Tech Stack

- **React Native** with **Expo**
- **TypeScript** for type safety
- **TanStack Query** for server state management
- **Zod** for validation
- **@crate/domain** workspace package for shared types

## Development

### Prerequisites

- Node.js and Bun
- Expo CLI
- iOS Simulator (for iOS development)
- Android Studio/emulator (for Android development)

### Getting Started

1. **Install dependencies** (from project root):

   ```bash
   bun install
   ```

2. **Start the development server**:

   ```bash
   bun run dev:mobile
   # or from mobile directory:
   cd apps/mobile && bun start
   ```

3. **Run on specific platforms**:

   ```bash
   # iOS
   bun run mobile:ios

   # Android
   bun run mobile:android

   # Web (for testing)
   cd apps/mobile && bun run web
   ```

### API Configuration

The app is configured to connect to the API at `http://localhost:3001/graphql`. Make sure the API server is running:

```bash
bun run dev:api
```

### Project Structure

```
src/
├── components/          # React Native components
│   ├── AddLinkForm.tsx # Modal form for adding links
│   ├── LinkCard.tsx    # Individual link display
│   ├── LinkList.tsx    # List of all links
│   └── index.ts        # Component exports
├── schemas/            # Zod validation schemas
│   ├── link.ts         # Link validation schema
│   └── index.ts        # Schema exports
└── services/           # API service layer
    ├── api.ts          # GraphQL API calls
    └── index.ts        # Service exports
```

## Features Overview

### Link Management

- **Add Links**: Modal form with URL, title, and optional description
- **View Links**: Scrollable list with native touch interactions
- **Delete Links**: Native alert confirmation dialog
- **Open Links**: Tap to open in external browser

### Validation

- URL format validation
- Required field validation
- Character limits
- Real-time error display

### Mobile UX

- Native iOS/Android design patterns
- Touch gestures and interactions
- Keyboard handling
- Modal presentations
- Loading states and error handling

## Building for Production

```bash
# Build for iOS
cd apps/mobile && bun run build:ios

# Build for Android
cd apps/mobile && bun run build:android
```

See [Expo documentation](https://docs.expo.dev/) for detailed build and deployment instructions.
