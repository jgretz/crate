import {Collection} from 'mongodb';
import {setDependency, resolveDependency} from '@crate/iocdi';
import {getDatabase} from '../database/connection';
import type {User} from '../types';

export const USER_SYMBOLS = {
  COLLECTION: Symbol('users-collection'),
} as const;

export function initializeUsersCollection(): void {
  const database = getDatabase();
  const collection = database.collection<User>('users');
  setDependency(USER_SYMBOLS.COLLECTION, collection);
}

export function getUsersCollection(): Collection<User> {
  const collection = resolveDependency<Collection<User>>(USER_SYMBOLS.COLLECTION);
  if (!collection) {
    throw new Error('Users collection not initialized. Call initializeUsersCollection() first.');
  }
  return collection;
}