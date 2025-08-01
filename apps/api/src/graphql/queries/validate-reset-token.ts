import {InjectIn} from '@stashl/iocdi';
import {createPasswordResetService} from '@stashl/domain';

export const validateResetTokenTypeDef = `
  type ValidateResetTokenResponse {
    valid: Boolean!
    email: String
  }

  extend type Query {
    validateResetToken(token: String!, email: String!): ValidateResetTokenResponse!
  }
`;

export const validateResetTokenResolver = InjectIn(
  function () {
    return function () {
      const passwordResetService = createPasswordResetService();

      return {
        Query: {
          async validateResetToken(_: any, {token, email}: {token: string; email: string}) {
            const result = await passwordResetService.validateResetToken(token, email);

            return {
              valid: result.valid,
              email: result.user?.email,
            };
          },
        },
      };
    };
  },
  {callbackName: 'validateResetTokenResolver'},
);