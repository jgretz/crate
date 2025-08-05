import {GraphQLClient} from 'graphql-request';
import {match} from 'ts-pattern';

function getApiUrl(): string {
  const envApiUrl = import.meta.env.VITE_API_URL as string | undefined;
  const nodeEnv = import.meta.env.NODE_ENV as string;

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

export const graphqlClient = new GraphQLClient(getApiUrl());
