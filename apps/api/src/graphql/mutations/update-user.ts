import type {User, UpdateUserInput} from '@stashl/domain';
import {updateUserService} from '@stashl/domain';

export const updateUserTypeDef = `
  input UpdateUserInput {
    email: String
    name: String
    password: String
  }

  extend type Mutation {
    updateUser(id: ID!, input: UpdateUserInput!): User
  }
`;

export function updateUserResolver() {
  return {
    Mutation: {
      async updateUser(
        _: any,
        {id, input}: {id: string; input: UpdateUserInput},
      ): Promise<User> {
        const updatedUser = await updateUserService(id, input);
        if (!updatedUser) {
          throw new Error('User not found');
        }
        return updatedUser;
      },
    },
  };
}