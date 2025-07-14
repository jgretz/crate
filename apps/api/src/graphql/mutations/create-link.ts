import {InjectIn} from '@crate/iocdi';
import type {Link, CreateLinkInput} from '@crate/domain';
import {createLinkService} from '@crate/domain';

/**
 * GraphQL type definition for creating a link
 */
export const createLinkTypeDef = `
  extend type Mutation {
    createLink(input: CreateLinkInput!): Link!
  }
`;

/**
 * GraphQL resolver for creating a link
 */
export const createLinkResolver = InjectIn(
  function () {
    return {
      Mutation: {
        createLink: async function (_: unknown, {input}: {input: CreateLinkInput}): Promise<Link> {
          return await createLinkService(input);
        },
      },
    };
  },
  {callbackName: 'createLinkResolver'},
);
