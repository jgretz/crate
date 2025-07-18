import type {Link, UpdateLinkInput} from '@crate/domain';
import {updateLinkService} from '@crate/domain';

export const updateLinkTypeDef = `
  extend type Mutation {
    updateLink(id: ID!, input: UpdateLinkInput!): Link!
  }
`;

export function updateLinkResolver() {
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
}
