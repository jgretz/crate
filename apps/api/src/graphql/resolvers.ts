import type {Link} from '@crate/domain';

export const linkFieldResolver = function () {
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
};
