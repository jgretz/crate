import {InjectIn} from '@crate/iocdi';
import type {Link} from '@crate/domain';

/**
 * GraphQL field resolvers for Link type
 */
export const linkFieldResolver = InjectIn(
  function () {
    return {
      Link: {
        _id: function (link: Link): string {
          return link._id?.toString() || '';
        },
        dateAdded: function (link: Link): string {
          return link.dateAdded.toISOString();
        },
      },
    };
  },
  {callbackName: 'linkFieldResolver'},
);
