import {graphqlClient} from '../graphql-client';

const REQUEST_PASSWORD_RESET_MUTATION = `
  mutation RequestPasswordReset($email: String!) {
    requestPasswordReset(email: $email) {
      message
    }
  }
`;

const VALIDATE_RESET_TOKEN_QUERY = `
  query ValidateResetToken($token: String!, $email: String!) {
    validateResetToken(token: $token, email: $email) {
      valid
      email
    }
  }
`;

const RESET_PASSWORD_MUTATION = `
  mutation ResetPassword($token: String!, $email: String!, $newPassword: String!) {
    resetPassword(token: $token, email: $email, newPassword: $newPassword) {
      success
      message
    }
  }
`;

export interface RequestPasswordResetResponse {
  message: string;
}

export interface ValidateResetTokenResponse {
  valid: boolean;
  email?: string;
}

export interface ResetPasswordResponse {
  success: boolean;
  message: string;
}
export async function requestPasswordReset(email: string): Promise<RequestPasswordResetResponse> {
  return await graphqlClient.request<RequestPasswordResetResponse>(
    REQUEST_PASSWORD_RESET_MUTATION,
    {email},
  );
}

export async function validateResetToken(
  token: string,
  email: string,
): Promise<ValidateResetTokenResponse> {
  return await graphqlClient.request<ValidateResetTokenResponse>(VALIDATE_RESET_TOKEN_QUERY, {
    token,
    email,
  });
}

export async function resetPassword(
  token: string,
  email: string,
  newPassword: string,
): Promise<ResetPasswordResponse> {
  return await graphqlClient.request<ResetPasswordResponse>(RESET_PASSWORD_MUTATION, {
    token,
    email,
    newPassword,
  });
}
