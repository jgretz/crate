import type {Link} from '@stashl/domain';
import {getLinkByIdAndUserService} from '@stashl/domain';
import {requireAuth, type AuthContext} from '../../auth/context';

export const getLinkByIdTypeDef = `
  extend type Query {
    link(id: ID!): Link
  }
`;

export function getLinkByIdResolver() {
  return {
    Query: {
      link: async function (_: unknown, {id}: {id: string}, context: AuthContext): Promise<Link | null> {
        const userId = requireAuth(context);
        return await getLinkByIdAndUserService(id, userId);
      },
    },
  };
}
