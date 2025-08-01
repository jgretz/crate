import type {Link, UpdateLinkInput} from '@stashl/domain';
import {updateLinkService} from '@stashl/domain';
import {requireAuth, type AuthContext} from '../../auth/context';

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
        context: AuthContext,
      ): Promise<Link> {
        const userId = requireAuth(context);
        const updatedLink = await updateLinkService(id, input, userId);
        if (!updatedLink) {
          throw new Error('Link not found or not authorized');
        }
        return updatedLink;
      },
    },
  };
}
