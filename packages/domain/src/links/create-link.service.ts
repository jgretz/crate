import {InjectIn} from '@crate/iocdi';
import {createLink, findLinkById} from './repository';
import {isValidUrl} from '../utils';
import type {Link, CreateLinkInput} from '../types';

/**
 * Service function to create a new link with validation
 */
export const createLinkService = InjectIn(
  function () {
    return async function (input: CreateLinkInput): Promise<Link> {
      // Business logic validation
      if (!isValidUrl(input.url)) {
        throw new Error('Invalid URL provided');
      }

      if (!input.title.trim()) {
        throw new Error('Title cannot be empty');
      }

      return await createLink(input);
    };
  },
  {callbackName: 'createLinkService'},
);

/**
 * Service function to get a link by ID
 */
export const getLinkByIdService = InjectIn(
  function () {
    return async function (id: string): Promise<Link | null> {
      return await findLinkById(id);
    };
  },
  {callbackName: 'getLinkByIdService'},
);
