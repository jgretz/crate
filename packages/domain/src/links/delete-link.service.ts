import {InjectIn} from '@crate/iocdi';
import {deleteLink} from './repository';

/**
 * Service function to delete a link
 */
export const deleteLinkService = InjectIn(
  function () {
    return async function (id: string): Promise<boolean> {
      return await deleteLink(id);
    };
  },
  {callbackName: 'deleteLinkService'},
);
