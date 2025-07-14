import {InjectIn} from '@crate/iocdi';
import {updateLink} from './repository';
import {isValidUrl} from '../utils';
import type {Link, UpdateLinkInput} from '../types';

/**
 * Service function to update a link with validation
 */
export const updateLinkService = InjectIn(
  function () {
    return async function (id: string, input: UpdateLinkInput): Promise<Link | null> {
      // Validate URL if provided
      if (input.url && !isValidUrl(input.url)) {
        throw new Error('Invalid URL provided');
      }

      // Validate title if provided
      if (input.title !== undefined && !input.title.trim()) {
        throw new Error('Title cannot be empty');
      }

      return await updateLink(id, input);
    };
  },
  {callbackName: 'updateLinkService'},
);
