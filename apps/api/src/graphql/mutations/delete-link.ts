import {InjectIn} from '@crate/iocdi';
import {deleteLinkService} from '@crate/domain';

/**
 * GraphQL type definition for deleting a link
 */
export const deleteLinkTypeDef = `
  extend type Mutation {
    deleteLink(id: ID!): Boolean!
  }
`;

/**
 * GraphQL resolver for deleting a link
 */
export const deleteLinkResolver = InjectIn(
  function () {
    return {
      Mutation: {
        deleteLink: async function (_: unknown, {id}: {id: string}): Promise<boolean> {
          return await deleteLinkService(id);
        },
      },
    };
  },
  {callbackName: 'deleteLinkResolver'},
);
