import {InjectIn} from '@crate/iocdi';
import {updateUser, findUserByEmail} from './repository';
import type {User, UpdateUserInput} from '../types';

/**
 * Service function to update a user with validation
 */
export const updateUserService = InjectIn(
  function () {
    return async function (id: string, input: UpdateUserInput): Promise<User | null> {
      // Validate email format if provided
      if (input.email !== undefined) {
        if (!input.email.trim()) {
          throw new Error('Email cannot be empty');
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(input.email)) {
          throw new Error('Invalid email format');
        }

        // Check if another user with this email already exists
        const existingUser = await findUserByEmail(input.email);
        if (existingUser && existingUser._id?.toString() !== id) {
          throw new Error('User with this email already exists');
        }
      }

      // Validate name if provided
      if (input.name !== undefined && !input.name.trim()) {
        throw new Error('Name cannot be empty');
      }

      return await updateUser(id, input);
    };
  },
  {callbackName: 'updateUserService'},
);