import {InjectIn} from '@crate/iocdi';
import {deleteUser} from './repository';

/**
 * Service function to delete a user
 */
export const deleteUserService = InjectIn(
  function () {
    return async function (id: string): Promise<boolean> {
      return await deleteUser(id);
    };
  },
  {callbackName: 'deleteUserService'},
);