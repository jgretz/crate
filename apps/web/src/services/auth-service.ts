import {graphqlClient} from './graphql-client';
import type {LoginFormData} from '../schemas';

const LOGIN_MUTATION = `
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

export interface AuthResponse {
  token: string;
  user: {
    _id: string;
    email: string;
    name: string;
    createdAt: string;
    updatedAt: string;
  };
}

export async function login(input: LoginFormData): Promise<AuthResponse> {
  const response = await graphqlClient.request<{login: AuthResponse}>(LOGIN_MUTATION, {input});
  return response.login;
}

export function setAuthToken(token: string) {
  document.cookie = `auth-token=${token}; path=/; max-age=${7 * 24 * 60 * 60}; secure; samesite=strict`;
  graphqlClient.setHeader('Authorization', `Bearer ${token}`);
}

export function getAuthToken(): string | null {
  const cookies = document.cookie.split(';');
  const authCookie = cookies.find(cookie => cookie.trim().startsWith('auth-token='));
  return authCookie ? authCookie.split('=')[1] : null;
}

export function clearAuthToken() {
  document.cookie = 'auth-token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT';
  graphqlClient.setHeader('Authorization', '');
}