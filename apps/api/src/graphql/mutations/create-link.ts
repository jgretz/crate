import type {Link, CreateLinkInput} from '@crate/domain';
import {createLinkService} from '@crate/domain';

export const createLinkTypeDef = `
  extend type Mutation {
    createLink(input: CreateLinkInput!): Link!
  }
`;

export function createLinkResolver() {
  return {
    Mutation: {
      createLink: async function (_: unknown, {input}: {input: CreateLinkInput}): Promise<Link> {
        return await createLinkService(input);
      },
    },
  };
}
