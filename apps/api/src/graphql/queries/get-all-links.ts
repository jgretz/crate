import {InjectIn} from '@crate/iocdi';
import type {Link} from '@crate/domain';
import {getAllLinksService} from '@crate/domain';

/**
 * GraphQL type definition for getting all links
 */
export const getAllLinksTypeDef = `
  extend type Query {
    links: [Link!]!
  }
`;

/**
 * GraphQL resolver for getting all links
 */
export const getAllLinksResolver = InjectIn(
  function () {
    return {
      Query: {
        links: async function (): Promise<Link[]> {
          return await getAllLinksService();
        },
      },
    };
  },
  {callbackName: 'getAllLinksResolver'},
);
