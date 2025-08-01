import {getUsersCollection} from './repository';
import {ObjectId} from 'mongodb';
import type {User, CreateUserInput} from '../types';
import {authService} from '@stashl/domain';

export async function createUserService(input: CreateUserInput): Promise<User> {
  if (!input.email.trim()) {
    throw new Error('Email cannot be empty');
  }

  if (!input.name.trim()) {
    throw new Error('Name cannot be empty');
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(input.email)) {
    throw new Error('Invalid email format');
  }

  const existingUser = await findUserByEmail(input.email);
  if (existingUser) {
    throw new Error('User with this email already exists');
  }

  return await createUser(input);
}

export async function getUserByIdService(id: string): Promise<User | null> {
  return await findUserById(id);
}

export async function getUserByEmailService(email: string): Promise<User | null> {
  return await findUserByEmail(email);
}

async function createUser(input: CreateUserInput): Promise<User> {
  const collection = getUsersCollection();

  const now = new Date();
  const user: Omit<User, '_id'> = {
    email: input.email,
    name: input.name,
    password: await authService.hashPassword(input.password),
    createdAt: now,
    updatedAt: now,
  };

  const result = await collection.insertOne(user as User);
  return {...user, _id: result.insertedId};
}

async function findUserById(id: string): Promise<User | null> {
  if (!ObjectId.isValid(id)) {
    return null;
  }

  const collection = getUsersCollection();
  return await collection.findOne({_id: new ObjectId(id)});
}

async function findUserByEmail(email: string): Promise<User | null> {
  const collection = getUsersCollection();
  return await collection.findOne({email});
}
