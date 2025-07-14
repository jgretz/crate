import {useQuery, useMutation, useQueryClient} from '@tanstack/react-query';
import {getLinks, deleteLink, type LinksResponse} from '../services';
import type {Link} from '@crate/domain-types';
import {LinkCard} from './LinkCard';

export function LinkList() {
  const queryClient = useQueryClient();

  const {data, isLoading, error} = useQuery<LinksResponse>({
    queryKey: ['links'],
    queryFn: getLinks,
  });

  const deleteLinkMutation = useMutation({
    mutationFn: (id: string) => deleteLink(id),
    onSuccess: () => {
      queryClient.invalidateQueries({queryKey: ['links']});
    },
  });

  const handleDelete = (linkId: string) => {
    deleteLinkMutation.mutate(linkId);
  };

  if (isLoading) {
    return (
      <div className='flex justify-center py-12'>
        <div className='animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600'></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className='text-center py-12'>
        <p className='text-red-600'>Failed to load links. Please try again.</p>
      </div>
    );
  }

  const links = data?.links || [];

  return (
    <div className='space-y-4'>
      {links.length === 0 ? (
        <div className='text-center py-12'>
          <p className='text-gray-500'>No links yet. Add your first link above!</p>
        </div>
      ) : (
        links.map((link) => (
          <LinkCard
            key={link._id?.toString()}
            link={link}
            onDelete={() => handleDelete(link._id?.toString() || '')}
          />
        ))
      )}
    </div>
  );
}
