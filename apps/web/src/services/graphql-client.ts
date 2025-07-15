import {GraphQLClient} from 'graphql-request';
import {config} from '../config';

export const graphqlClient = new GraphQLClient(config.apiUrl);
