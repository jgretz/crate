import {getUsersCollection} from './repository';
import type {User} from '../types';

export async function getAllUsersService(): Promise<User[]> {
  return await findAllUsers();
}

async function findAllUsers(): Promise<User[]> {
  const collection = getUsersCollection();
  return await collection.find({}).sort({createdAt: -1}).toArray();
}

export async function findUserByEmailService(email: string): Promise<User | null> {
  return await findUserByEmail(email);
}

async function findUserByEmail(email: string): Promise<User | null> {
  const collection = getUsersCollection();
  return await collection.findOne({email});
}
