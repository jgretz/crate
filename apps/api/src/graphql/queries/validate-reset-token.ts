import {validateResetToken} from '@stashl/domain';

export const validateResetTokenTypeDef = `
  type ValidateResetTokenResponse {
    valid: Boolean!
    email: String
  }

  extend type Query {
    validateResetToken(token: String!, email: String!): ValidateResetTokenResponse!
  }
`;

export function validateResetTokenResolver() {
  return {
    Query: {
      async validateResetToken(_: any, {token, email}: {token: string; email: string}) {
        const result = await validateResetToken(token, email);

        return {
          valid: result.valid,
          email: result.user?.email,
        };
      },
    },
  };
}
