# Web App Configuration

## Environment Setup

The web app uses environment variables to configure the API URL. This allows for different configurations for development, staging, and production environments.

### Development Setup

1. Copy the example environment file:

   ```bash
   cp .env.example .env
   ```

2. Edit `.env` and set the appropriate API URL:
   ```env
   VITE_API_URL=http://localhost:3001/graphql
   ```

### Production Setup

For production builds, set the environment variable to your production API URL:

```env
VITE_API_URL=https://crate-api.fly.dev/graphql
```

### Staging Setup

For staging environments:

```env
VITE_API_URL=https://staging-api.example.com/graphql
```

### How It Works

The app uses a configuration system that:

1. **Checks for environment variables first** - `VITE_API_URL` takes highest priority
2. **Falls back to environment-specific defaults**:
   - Development: `http://localhost:3001/graphql`
   - Production: `https://crate-api.fly.dev/graphql`
3. **Throws an error for unknown environments** if no environment variable is set

### Environment Variables

- `VITE_API_URL` - The GraphQL API endpoint URL

### Build-time Configuration

Vite environment variables are embedded at build time, so:

- Environment variables prefixed with `VITE_` are available in the browser
- Changes to `.env` files require a restart of the dev server
- Production builds need environment variables set during the build process

### Troubleshooting

- **API calls fail:** Ensure the API URL is correct and the server is running
- **Environment variable not found:** Make sure it's prefixed with `VITE_` and restart the dev server
- **Production build issues:** Verify `VITE_API_URL` is set in your deployment environment
