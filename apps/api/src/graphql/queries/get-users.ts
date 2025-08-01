import {getAllUsersService} from '@stashl/domain';
import type {User} from '@stashl/domain';

export const getUsersTypeDef = `
  extend type Query {
    users: [User!]!
  }
`;

export function getUsersResolver() {
  return {
    Query: {
      users: async function (): Promise<User[]> {
        return await getAllUsersService();
      },
    },
  };
}
