import {InjectIn} from '@crate/iocdi';
import {createUser, findUserById, findUserByEmail} from './repository';
import type {User, CreateUserInput} from '../types';

/**
 * Service function to create a new user with validation
 */
export const createUserService = InjectIn(
  function () {
    return async function (input: CreateUserInput): Promise<User> {
      // Business logic validation
      if (!input.email.trim()) {
        throw new Error('Email cannot be empty');
      }

      if (!input.name.trim()) {
        throw new Error('Name cannot be empty');
      }

      // Basic email validation
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(input.email)) {
        throw new Error('Invalid email format');
      }

      // Check if user with email already exists
      const existingUser = await findUserByEmail(input.email);
      if (existingUser) {
        throw new Error('User with this email already exists');
      }

      return await createUser(input);
    };
  },
  {callbackName: 'createUserService'},
);

/**
 * Service function to get a user by ID
 */
export const getUserByIdService = InjectIn(
  function () {
    return async function (id: string): Promise<User | null> {
      return await findUserById(id);
    };
  },
  {callbackName: 'getUserByIdService'},
);

/**
 * Service function to get a user by email
 */
export const getUserByEmailService = InjectIn(
  function () {
    return async function (email: string): Promise<User | null> {
      return await findUserByEmail(email);
    };
  },
  {callbackName: 'getUserByEmailService'},
);