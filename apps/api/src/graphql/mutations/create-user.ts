import {createUserService} from '@stashl/domain';

export const createUserTypeDef = `
  input CreateUserInput {
    email: String!
    name: String!
    password: String!
  }

  extend type Mutation {
    createUser(input: CreateUserInput!): User
  }
`;

export function createUserResolver() {
  return {
    Mutation: {
      async createUser(_: any, {input}: {input: {email: string; name: string; password: string}}) {
        return await createUserService(input);
      },
    },
  };
}
