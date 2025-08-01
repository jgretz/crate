import {InjectIn} from '@crate/iocdi';
import {createPasswordResetService} from '@crate/domain';

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