import type {Link, CreateLinkInput} from '@stashl/domain';
import {createLinkService} from '@stashl/domain';
import {requireAuth, type AuthContext} from '../../auth/context';

export const createLinkTypeDef = `
  extend type Mutation {
    createLink(input: CreateLinkInput!): Link!
  }
`;

export function createLinkResolver() {
  return {
    Mutation: {
      createLink: async function (_: unknown, {input}: {input: CreateLinkInput}, context: AuthContext): Promise<Link> {
        const userId = requireAuth(context);
        return await createLinkService(input, userId);
      },
    },
  };
}
