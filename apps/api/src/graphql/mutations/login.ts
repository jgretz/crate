import {authService} from '@stashl/domain';

export const loginTypeDef = `
  input LoginInput {
    email: String!
    password: String!
  }

  type AuthResponse {
    token: String!
    user: User!
  }

  type User {
    _id: ID!
    email: String!
    name: String!
    createdAt: String!
    updatedAt: String!
  }

  extend type Mutation {
    login(input: LoginInput!): AuthResponse
  }
`;

export function loginResolver() {
  return {
    Mutation: {
      async login(_: any, {input}: {input: {email: string; password: string}}) {
        console.log('Login attempt with input:', input);
        const result = await authService.login(input);
        if (!result) {
          throw new Error('Invalid email or password');
        }
        return result;
      },
    },
  };
}
