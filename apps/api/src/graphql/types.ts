/**
 * GraphQL type definitions for the Link entity
 */
export const linkTypeDefs = `
  type Link {
    _id: ID!
    url: String!
    title: String!
    description: String
    dateAdded: String!
  }

  input CreateLinkInput {
    url: String!
    title: String!
    description: String
  }

  input UpdateLinkInput {
    url: String
    title: String
    description: String
  }
`;
