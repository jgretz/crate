import type {Link} from '@crate/domain';
import {getAllLinksService} from '@crate/domain';

export const getAllLinksTypeDef = `
  extend type Query {
    links: [Link!]!
  }
`;

export function getAllLinksResolver() {
  return {
    Query: {
      links: async function (): Promise<Link[]> {
        return await getAllLinksService();
      },
    },
  };
}
