import {graphqlClient} from './graphql-client';
import type {Link} from '@stashl/domain-types';

const GET_LINKS = `
  query GetLinks {
    links {
      _id
      url
      title
      description
      dateAdded
    }
  }
`;

export interface LinksResponse {
  links: Link[];
}

export const getLinks = async (): Promise<LinksResponse> => {
  return graphqlClient.request(GET_LINKS);
};
