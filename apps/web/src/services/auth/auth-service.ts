import {graphqlClient} from '../graphql-client';
import {createServerFn} from '@tanstack/react-start';

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

export const login = createServerFn({
  method: 'POST',
})
  .validator((data: {email: string; password: string}) => data)
  .handler(async function ({data}) {
    const response = await graphqlClient.request<{login: AuthResponse}>(LOGIN_MUTATION, {
      input: data,
    });

    return response.login;
  });

export function setAuthToken(token: string) {
  document.cookie = `auth-token=${token}; path=/; max-age=${30 * 24 * 60 * 60}; secure; samesite=strict`;
  graphqlClient.setHeader('Authorization', `Bearer ${token}`);
}

export function getAuthToken(): string | null {
  if (typeof document === 'undefined') {
    return null;
  }

  const cookies = document.cookie.split(';');
  const authCookie = cookies.find((cookie) => cookie.trim().startsWith('auth-token='));
  return authCookie ? authCookie.split('=')[1] : null;
}

export function clearAuthToken() {
  if (typeof document === 'undefined') {
    return;
  }

  document.cookie = 'auth-token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT';
  graphqlClient.setHeader('Authorization', '');
}

export function isAuthenticated(): boolean {
  if (typeof document === 'undefined') {
    return false;
  }

  const token = getAuthToken();
  const authenticated = token !== null && token !== '' && token !== 'undefined';

  // Ensure GraphQL client has the token set for subsequent requests
  if (authenticated && token) {
    graphqlClient.setHeader('Authorization', `Bearer ${token}`);
  }

  return authenticated;
}

function onLoad() {
  // Initialize auth on module load
  if (typeof document !== 'undefined') {
    const token = getAuthToken();
    if (token && token !== '' && token !== 'undefined') {
      graphqlClient.setHeader('Authorization', `Bearer ${token}`);
    }
  }
}

onLoad();
