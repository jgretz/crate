import {request} from 'graphql-request';
import {config} from '../config';

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

export async function requestPasswordReset(email: string): Promise<{message: string}> {
  const data = await request(config.apiUrl, REQUEST_PASSWORD_RESET_MUTATION, {email});
  return data.requestPasswordReset;
}

export async function validateResetToken(token: string, email: string): Promise<{
  valid: boolean;
  email?: string;
}> {
  const data = await request(config.apiUrl, VALIDATE_RESET_TOKEN_QUERY, {token, email});
  return data.validateResetToken;
}

export async function resetPassword(token: string, email: string, newPassword: string): Promise<{
  success: boolean;
  message: string;
}> {
  const data = await request(config.apiUrl, RESET_PASSWORD_MUTATION, {
    token,
    email,
    newPassword,
  });
  return data.resetPassword;
}