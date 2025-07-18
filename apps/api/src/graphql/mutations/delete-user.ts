import {deleteUserService} from '@crate/domain';

export const deleteUserTypeDef = `
  extend type Mutation {
    deleteUser(id: ID!): Boolean!
  }
`;

export function deleteUserResolver() {
  return {
    Mutation: {
      async deleteUser(_: any, {id}: {id: string}): Promise<boolean> {
        return await deleteUserService(id);
      },
    },
  };
}