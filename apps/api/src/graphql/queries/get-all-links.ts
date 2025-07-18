import type {Link} from '@crate/domain';
import {getAllLinksByUserService} from '@crate/domain';
import {requireAuth, type AuthContext} from '../../auth/context';

export const getAllLinksTypeDef = `
  extend type Query {
    links: [Link!]!
  }
`;

export function getAllLinksResolver() {
  return {
    Query: {
      links: async function (_: unknown, __: unknown, context: AuthContext): Promise<Link[]> {
        const userId = requireAuth(context);
        return await getAllLinksByUserService(userId);
      },
    },
  };
}
