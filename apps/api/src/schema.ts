import {makeExecutableSchema} from '@graphql-tools/schema';
import {InjectIn} from '@crate/iocdi';
import {
  linkTypeDefs,
  getAllLinksTypeDef,
  getAllLinksResolver,
  getLinkByIdTypeDef,
  getLinkByIdResolver,
  createLinkTypeDef,
  createLinkResolver,
  updateLinkTypeDef,
  updateLinkResolver,
  deleteLinkTypeDef,
  deleteLinkResolver,
  linkFieldResolver,
} from './graphql';

/**
 * Base GraphQL schema with Query and Mutation types
 */
const baseTypeDefs = `
  type Query {
    _empty: String
  }

  type Mutation {
    _empty: String
  }
`;

/**
 * Combined GraphQL type definitions
 */
export const typeDefs = [
  baseTypeDefs,
  linkTypeDefs,
  getAllLinksTypeDef,
  getLinkByIdTypeDef,
  createLinkTypeDef,
  updateLinkTypeDef,
  deleteLinkTypeDef,
].join('\n');

/**
 * Combined GraphQL resolvers
 */
export const createResolvers = InjectIn(
  function () {
    const getAllLinksResolvers = getAllLinksResolver();
    const getLinkByIdResolvers = getLinkByIdResolver();
    const createLinkResolvers = createLinkResolver();
    const updateLinkResolvers = updateLinkResolver();
    const deleteLinkResolvers = deleteLinkResolver();
    const linkFieldResolvers = linkFieldResolver();

    return {
      Query: {
        ...getAllLinksResolvers.Query,
        ...getLinkByIdResolvers.Query,
      },
      Mutation: {
        ...createLinkResolvers.Mutation,
        ...updateLinkResolvers.Mutation,
        ...deleteLinkResolvers.Mutation,
      },
      Link: {
        ...linkFieldResolvers.Link,
      },
    };
  },
  {callbackName: 'createResolvers'},
);

/**
 * Create the complete GraphQL schema
 */
export const createSchema = InjectIn(
  function () {
    return function () {
      const resolvers = createResolvers();

      return makeExecutableSchema({
        typeDefs,
        resolvers,
      });
    };
  },
  {callbackName: 'createSchema'},
);
