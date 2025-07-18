import {ObjectId} from 'mongodb';

export interface Link {
  _id?: ObjectId;
  url: string;
  title: string;
  description?: string;
  dateAdded: Date;
  userId: ObjectId;
}

export interface CreateLinkInput {
  url: string;
  title: string;
  description?: string;
}

export interface UpdateLinkInput {
  url?: string;
  title?: string;
  description?: string;
}

export interface LinkRepository {
  create(input: CreateLinkInput, userId: string): Promise<Link>;
  findById(id: string): Promise<Link | null>;
  findAllByUser(userId: string): Promise<Link[]>;
  findAll(): Promise<Link[]>;
  update(id: string, input: UpdateLinkInput): Promise<Link | null>;
  delete(id: string): Promise<boolean>;
}

export interface User {
  _id?: ObjectId;
  email: string;
  name: string;
  password: string;
  createdAt: Date;
  updatedAt: Date;
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

export interface LoginInput {
  email: string;
  password: string;
}

export interface AuthResponse {
  token: string;
  user: Omit<User, 'password'>;
}

export interface UserRepository {
  create(input: CreateUserInput): Promise<User>;
  findById(id: string): Promise<User | null>;
  findByEmail(email: string): Promise<User | null>;
  findAll(): Promise<User[]>;
  update(id: string, input: UpdateUserInput): Promise<User | null>;
  delete(id: string): Promise<boolean>;
}
