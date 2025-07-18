import {InjectIn} from '@crate/iocdi';
import {authService} from '@crate/domain';

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

export const loginResolver = InjectIn(
  function () {
    const auth = authService();

    return {
      Mutation: {
        async login(_: any, {input}: {input: {email: string; password: string}}) {
          const result = await auth.login(input);
          if (!result) {
            throw new Error('Invalid email or password');
          }
          return result;
        },
      },
    };
  },
  {callbackName: 'loginResolver'},
);