import type {Link} from '@crate/domain';
import {getLinkByIdService} from '@crate/domain';

export const getLinkByIdTypeDef = `
  extend type Query {
    link(id: ID!): Link
  }
`;

export function getLinkByIdResolver() {
  return {
    Query: {
      link: async function (_: unknown, {id}: {id: string}): Promise<Link | null> {
        return await getLinkByIdService(id);
      },
    },
  };
}
