import {InjectIn} from '@crate/iocdi';
import {findAllLinks} from './repository';
import type {Link} from '../types';

/**
 * Service function to get all links
 */
export const getAllLinksService = InjectIn(
  function () {
    return async function (): Promise<Link[]> {
      return await findAllLinks();
    };
  },
  {callbackName: 'getAllLinksService'},
);
