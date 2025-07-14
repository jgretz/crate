import {InjectIn} from '@crate/iocdi';
import type {Link} from '@crate/domain';
import {getLinkByIdService} from '@crate/domain';

/**
 * GraphQL type definition for getting a link by ID
 */
export const getLinkByIdTypeDef = `
  extend type Query {
    link(id: ID!): Link
  }
`;

/**
 * GraphQL resolver for getting a link by ID
 */
export const getLinkByIdResolver = InjectIn(
  function () {
    return {
      Query: {
        link: async function (_: unknown, {id}: {id: string}): Promise<Link | null> {
          return await getLinkByIdService(id);
        },
      },
    };
  },
  {callbackName: 'getLinkByIdResolver'},
);
