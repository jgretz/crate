import {requestPasswordReset} from '@stashl/domain';
import {sendPasswordResetEmail} from '@stashl/email';

export const requestPasswordResetTypeDef = `
  type RequestPasswordResetResponse {
    message: String!
  }

  extend type Mutation {
    requestPasswordReset(email: String!): RequestPasswordResetResponse!
  }
`;

export function requestPasswordResetResolver() {
  return {
    Mutation: {
      async requestPasswordReset(_: any, {email}: {email: string}) {
        const result = await requestPasswordReset({email});

        if (result.userExists && result.resetToken) {
          const baseUrl = process.env.FRONTEND_URL || 'http://localhost:3000';

          try {
            await sendPasswordResetEmail(email, result.resetToken, baseUrl);
          } catch (error) {
            console.error('Failed to send password reset email:', error);
          }
        }

        return {
          message: 'If an account with that email exists, a password reset link has been sent.',
        };
      },
    },
  };
}
