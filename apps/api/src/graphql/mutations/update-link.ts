import {InjectIn} from '@crate/iocdi';
import type {Link, UpdateLinkInput} from '@crate/domain';
import {updateLinkService} from '@crate/domain';

/**
 * GraphQL type definition for updating a link
 */
export const updateLinkTypeDef = `
  extend type Mutation {
    updateLink(id: ID!, input: UpdateLinkInput!): Link!
  }
`;

/**
 * GraphQL resolver for updating a link
 */
export const updateLinkResolver = InjectIn(
  function () {
    return {
      Mutation: {
        updateLink: async function (
          _: unknown,
          {id, input}: {id: string; input: UpdateLinkInput},
        ): Promise<Link> {
          const updatedLink = await updateLinkService(id, input);
          if (!updatedLink) {
            throw new Error('Link not found');
          }
          return updatedLink;
        },
      },
    };
  },
  {callbackName: 'updateLinkResolver'},
);
