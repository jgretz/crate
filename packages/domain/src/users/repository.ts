import {Collection, ObjectId} from 'mongodb';
import {setDependency, resolveDependency} from '@crate/iocdi';
import {getDatabase} from '../database/connection';
import type {User, CreateUserInput, UpdateUserInput, UserRepository} from '../types';

export const USER_SYMBOLS = {
  COLLECTION: Symbol('users-collection'),
  REPOSITORY: Symbol('user-repository'),
} as const;

/**
 * Initialize the users collection and register it in the IOC container
 */
export function initializeUsersCollection(): void {
  const database = getDatabase();
  const collection = database.collection<User>('users');
  setDependency(USER_SYMBOLS.COLLECTION, collection);
  
  // Register the UserRepository implementation
  const userRepository: UserRepository = {
    create: createUser,
    findById: findUserById,
    findByEmail: findUserByEmail,
    findAll: findAllUsers,
    update: updateUser,
    delete: deleteUser,
  };
  setDependency(USER_SYMBOLS.REPOSITORY, userRepository);
}

/**
 * Get the users collection from the IOC container
 */
export function getUsersCollection(): Collection<User> {
  const collection = resolveDependency<Collection<User>>(USER_SYMBOLS.COLLECTION);
  if (!collection) {
    throw new Error('Users collection not initialized. Call initializeUsersCollection() first.');
  }
  return collection;
}

/**
 * Create a new user
 */
export async function createUser(input: CreateUserInput): Promise<User> {
  const collection = getUsersCollection();

  const now = new Date();
  const user: Omit<User, '_id'> = {
    email: input.email,
    name: input.name,
    password: input.password,
    createdAt: now,
    updatedAt: now,
  };

  const result = await collection.insertOne(user as User);
  return {...user, _id: result.insertedId};
}

/**
 * Find a user by ID
 */
export async function findUserById(id: string): Promise<User | null> {
  if (!ObjectId.isValid(id)) {
    return null;
  }

  const collection = getUsersCollection();
  return await collection.findOne({_id: new ObjectId(id)});
}

/**
 * Find a user by email
 */
export async function findUserByEmail(email: string): Promise<User | null> {
  const collection = getUsersCollection();
  return await collection.findOne({email});
}

/**
 * Find all users
 */
export async function findAllUsers(): Promise<User[]> {
  const collection = getUsersCollection();
  return await collection.find({}).sort({createdAt: -1}).toArray();
}

/**
 * Update a user by ID
 */
export async function updateUser(id: string, input: UpdateUserInput): Promise<User | null> {
  if (!ObjectId.isValid(id)) {
    return null;
  }

  const collection = getUsersCollection();
  const updateDoc: Partial<User> = {
    updatedAt: new Date(),
  };

  if (input.email !== undefined) updateDoc.email = input.email;
  if (input.name !== undefined) updateDoc.name = input.name;
  if (input.password !== undefined) updateDoc.password = input.password;

  const result = await collection.findOneAndUpdate(
    {_id: new ObjectId(id)},
    {$set: updateDoc},
    {returnDocument: 'after'},
  );

  return result;
}

/**
 * Delete a user by ID
 */
export async function deleteUser(id: string): Promise<boolean> {
  if (!ObjectId.isValid(id)) {
    return false;
  }

  const collection = getUsersCollection();
  const result = await collection.deleteOne({_id: new ObjectId(id)});
  return result.deletedCount === 1;
}