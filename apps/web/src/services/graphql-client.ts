import {GraphQLClient} from 'graphql-request';

const API_URL =
  process.env.NODE_ENV === 'production'
    ? 'https://crate-api.fly.dev/graphql'
    : 'http://localhost:3001/graphql';

export const graphqlClient = new GraphQLClient(API_URL);
