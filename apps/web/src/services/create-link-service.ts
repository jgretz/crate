import {graphqlClient} from './graphql-client';
import type {Link, CreateLinkInput} from '@stashl/domain-types';

const CREATE_LINK = `
  mutation CreateLink($input: CreateLinkInput!) {
    createLink(input: $input) {
      _id
      url
      title
      description
      dateAdded
    }
  }
`;

export interface CreateLinkResponse {
  createLink: Link;
}

export const createLink = async (input: CreateLinkInput): Promise<CreateLinkResponse> => {
  return graphqlClient.request(CREATE_LINK, {input});
};
