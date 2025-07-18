import {InjectIn} from '@crate/iocdi';
import {findAllUsers} from './repository';
import type {User} from '../types';

/**
 * Service function to get all users
 */
export const getAllUsersService = InjectIn(
  function () {
    return async function (): Promise<User[]> {
      return await findAllUsers();
    };
  },
  {callbackName: 'getAllUsersService'},
);