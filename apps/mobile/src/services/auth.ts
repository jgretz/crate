import * as SecureStore from 'expo-secure-store';
import {config} from '../config';

const AUTH_TOKEN_KEY = '@stashl_auth_token';
const USER_KEY = '@stashl_user';

export interface User {
  _id: string;
  email: string;
  name: string;
  createdAt: string;
  updatedAt: string;
}

export interface LoginInput {
  email: string;
  password: string;
}

export interface AuthResponse {
  token: string;
  user: User;
}

async function graphqlRequest(query: string, variables?: any, token?: string) {
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
  };

  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  const response = await fetch(config.apiUrl, {
    method: 'POST',
    headers,
    body: JSON.stringify({
      query,
      variables,
    }),
  });

  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }

  const result = await response.json();

  if (result.errors) {
    throw new Error(result.errors[0]?.message || 'GraphQL error');
  }

  return result.data;
}

export async function login(input: LoginInput): Promise<AuthResponse> {
  const mutation = `
    mutation Login($input: LoginInput!) {
      login(input: $input) {
        token
        user {
          _id
          email
          name
          createdAt
          updatedAt
        }
      }
    }
  `;

  const data = await graphqlRequest(mutation, {input});
  const authResponse = data.login;

  // Store token and user in SecureStore
  await SecureStore.setItemAsync(AUTH_TOKEN_KEY, authResponse.token);
  await SecureStore.setItemAsync(USER_KEY, JSON.stringify(authResponse.user));

  return authResponse;
}

export async function logout(): Promise<void> {
  await SecureStore.deleteItemAsync(AUTH_TOKEN_KEY);
  await SecureStore.deleteItemAsync(USER_KEY);
}

export async function getToken(): Promise<string | null> {
  return await SecureStore.getItemAsync(AUTH_TOKEN_KEY);
}

export async function getUser(): Promise<User | null> {
  const userJson = await SecureStore.getItemAsync(USER_KEY);
  return userJson ? JSON.parse(userJson) : null;
}

export async function isAuthenticated(): Promise<boolean> {
  const token = await getToken();
  return token !== null;
}

export async function getAuthHeaders(): Promise<Record<string, string>> {
  const token = await getToken();
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
  };

  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  return headers;
}