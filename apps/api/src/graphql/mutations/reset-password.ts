import {InjectIn} from '@crate/iocdi';
import {createPasswordResetService} from '@crate/domain';

export const resetPasswordTypeDef = `
  type ResetPasswordResponse {
    success: Boolean!
    message: String!
  }

  extend type Mutation {
    resetPassword(token: String!, email: String!, newPassword: String!): ResetPasswordResponse!
  }
`;

export const resetPasswordResolver = InjectIn(
  function () {
    return function () {
      const passwordResetService = createPasswordResetService();

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

            const result = await passwordResetService.resetPassword({
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
    };
  },
  {callbackName: 'resetPasswordResolver'},
);