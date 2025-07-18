import {deleteLinkService} from '@crate/domain';
import {requireAuth, type AuthContext} from '../../auth/context';

export const deleteLinkTypeDef = `
  extend type Mutation {
    deleteLink(id: ID!): Boolean!
  }
`;

export function deleteLinkResolver() {
  return {
    Mutation: {
      deleteLink: async function (_: unknown, {id}: {id: string}, context: AuthContext): Promise<boolean> {
        const userId = requireAuth(context);
        return await deleteLinkService(id, userId);
      },
    },
  };
}
