import {resetPassword} from '@stashl/domain';

export const resetPasswordTypeDef = `
  type ResetPasswordResponse {
    success: Boolean!
    message: String!
  }

  extend type Mutation {
    resetPassword(token: String!, email: String!, newPassword: String!): ResetPasswordResponse!
  }
`;

export function resetPasswordResolver() {
  return {
    Mutation: {
      async resetPassword(
        _: any,
        {token, email, newPassword}: {token: string; email: string; newPassword: string},
      ) {
        if (!newPassword || newPassword.length < 6) {
          return {
            success: false,
            message: 'Password must be at least 6 characters long',
          };
        }

        const result = await resetPassword({
          token,
          email,
          newPassword,
        });

        if (result.success) {
          return {
            success: true,
            message: 'Password has been reset successfully',
          };
        }

        return {
          success: false,
          message: result.error || 'Failed to reset password',
        };
      },
    },
  };
}
