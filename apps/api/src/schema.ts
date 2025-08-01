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
  loginTypeDef,
  loginResolver,
  getUsersTypeDef,
  getUsersResolver,
  createUserTypeDef,
  createUserResolver,
  updateUserTypeDef,
  updateUserResolver,
  deleteUserTypeDef,
  deleteUserResolver,
  requestPasswordResetTypeDef,
  requestPasswordResetResolver,
  resetPasswordTypeDef,
  resetPasswordResolver,
  validateResetTokenTypeDef,
  validateResetTokenResolver,
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
  loginTypeDef,
  getUsersTypeDef,
  createUserTypeDef,
  updateUserTypeDef,
  deleteUserTypeDef,
  requestPasswordResetTypeDef,
  resetPasswordTypeDef,
  validateResetTokenTypeDef,
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
    const loginResolvers = loginResolver();
    const getUsersResolvers = getUsersResolver();
    const createUserResolvers = createUserResolver();
    const updateUserResolvers = updateUserResolver();
    const deleteUserResolvers = deleteUserResolver();
    const requestPasswordResetResolvers = requestPasswordResetResolver();
    const resetPasswordResolvers = resetPasswordResolver();
    const validateResetTokenResolvers = validateResetTokenResolver();

    return {
      Query: {
        ...getAllLinksResolvers.Query,
        ...getLinkByIdResolvers.Query,
        ...getUsersResolvers.Query,
        ...validateResetTokenResolvers.Query,
      },
      Mutation: {
        ...createLinkResolvers.Mutation,
        ...updateLinkResolvers.Mutation,
        ...deleteLinkResolvers.Mutation,
        ...loginResolvers.Mutation,
        ...createUserResolvers.Mutation,
        ...updateUserResolvers.Mutation,
        ...deleteUserResolvers.Mutation,
        ...requestPasswordResetResolvers.Mutation,
        ...resetPasswordResolvers.Mutation,
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
