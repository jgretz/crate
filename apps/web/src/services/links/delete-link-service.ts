import {graphqlClient} from '../graphql-client';

const DELETE_LINK = `
  mutation DeleteLink($id: ID!) {
    deleteLink(id: $id)
  }
`;

export interface DeleteLinkResponse {
  deleteLink: boolean;
}

export const deleteLink = async (id: string): Promise<DeleteLinkResponse> => {
  return graphqlClient.request(DELETE_LINK, {id});
};
