import {match} from 'ts-pattern';

export interface AppConfig {
  apiUrl: string;
  isDevelopment: boolean;
  isProduction: boolean;
}

/**
 * Determines the appropriate API URL based on environment
 *
 * Priority order:
 * 1. VITE_API_URL environment variable
 * 2. Fallback to environment-specific defaults
 *
 * For development:
 * - localhost:3001/graphql
 *
 * For production:
 * - Production API URL or default production endpoint
 */
function getApiUrl(): string {
  const envApiUrl = import.meta.env.VITE_API_URL as string | undefined;
  const nodeEnv = import.meta.env.MODE as string;

  // First check if environment variable is set (highest priority)
  if (envApiUrl) {
    return envApiUrl;
  }

  // Use pattern matching for environment scenarios
  return match(nodeEnv)
    .with('development', () => 'http://localhost:3001/graphql')
    .otherwise(() => {
      throw new Error(
        `API_URL must be configured via VITE_API_URL environment variable for environment: ${nodeEnv}`,
      );
    });
}

export const config: AppConfig = {
  apiUrl: getApiUrl(),
  isDevelopment: import.meta.env.MODE === 'development',
  isProduction: import.meta.env.MODE === 'production',
};
