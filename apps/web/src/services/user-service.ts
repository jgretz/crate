import {graphqlClient} from './graphql-client';

const GET_USERS_QUERY = `
  query GetUsers {
    users {
      _id
      email
      name
      createdAt
      updatedAt
    }
  }
`;

const CREATE_USER_MUTATION = `
  mutation CreateUser($input: CreateUserInput!) {
    createUser(input: $input) {
      _id
      email
      name
      createdAt
      updatedAt
    }
  }
`;

const UPDATE_USER_MUTATION = `
  mutation UpdateUser($id: ID!, $input: UpdateUserInput!) {
    updateUser(id: $id, input: $input) {
      _id
      email
      name
      createdAt
      updatedAt
    }
  }
`;

const DELETE_USER_MUTATION = `
  mutation DeleteUser($id: ID!) {
    deleteUser(id: $id)
  }
`;

export interface User {
  _id: string;
  email: string;
  name: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateUserInput {
  email: string;
  name: string;
  password: string;
}

export interface UpdateUserInput {
  email?: string;
  name?: string;
  password?: string;
}

export async function getUsers(): Promise<User[]> {
  const response = await graphqlClient.request<{users: User[]}>(GET_USERS_QUERY);
  return response.users;
}

export async function createUser(input: CreateUserInput): Promise<User> {
  const response = await graphqlClient.request<{createUser: User}>(CREATE_USER_MUTATION, {input});
  return response.createUser;
}

export async function updateUser(id: string, input: UpdateUserInput): Promise<User> {
  const response = await graphqlClient.request<{updateUser: User}>(UPDATE_USER_MUTATION, {id, input});
  return response.updateUser;
}

export async function deleteUser(id: string): Promise<boolean> {
  const response = await graphqlClient.request<{deleteUser: boolean}>(DELETE_USER_MUTATION, {id});
  return response.deleteUser;
}