import {deleteLinkService} from '@crate/domain';

export const deleteLinkTypeDef = `
  extend type Mutation {
    deleteLink(id: ID!): Boolean!
  }
`;

export function deleteLinkResolver() {
  return {
    Mutation: {
      deleteLink: async function (_: unknown, {id}: {id: string}): Promise<boolean> {
        return await deleteLinkService(id);
      },
    },
  };
}
