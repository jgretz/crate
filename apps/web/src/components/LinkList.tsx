import {useQuery, useMutation, useQueryClient} from '@tanstack/react-query';
import {match} from 'ts-pattern';
import {getLinks, deleteLink, type LinksResponse} from '../services';
import type {Link} from '@stashl/domain-types';
import {LinkCard} from './LinkCard';

// Loading state component
function LoadingState() {
  return (
    <div className='flex justify-center py-12'>
      <div className='animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600'></div>
    </div>
  );
}

// Error state component
function ErrorState() {
  return (
    <div className='text-center py-12'>
      <p className='text-red-600'>Failed to load links. Please try again.</p>
    </div>
  );
}

// Empty state component
function EmptyState() {
  return (
    <div className='text-center py-12'>
      <p className='text-gray-500'>No links yet. Add your first link above!</p>
    </div>
  );
}

// Links list component
function LinksList({links, onDelete}: {links: Link[]; onDelete: (linkId: string) => void}) {
  return (
    <div className='space-y-4'>
      {links.map((link) => (
        <LinkCard
          key={link._id?.toString()}
          link={link}
          onDelete={() => onDelete(link._id?.toString() || '')}
        />
      ))}
    </div>
  );
}

// Main state type
type LinkListState =
  | {type: 'loading'}
  | {type: 'error'}
  | {type: 'empty'}
  | {type: 'success'; links: Link[]};

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

  // Determine current state
  const state: LinkListState = match({isLoading, error, data})
    .with({isLoading: true}, () => ({type: 'loading'}) as const)
    .when(
      ({error}) => error !== null && error !== undefined,
      () => ({type: 'error'}) as const,
    )
    .when(
      ({data}) => !data?.links || data.links.length === 0,
      () => ({type: 'empty'}) as const,
    )
    .otherwise(({data}) => ({type: 'success', links: data!.links}) as const);

  // Render appropriate component based on state
  return match(state)
    .with({type: 'loading'}, () => <LoadingState />)
    .with({type: 'error'}, () => <ErrorState />)
    .with({type: 'empty'}, () => <EmptyState />)
    .with({type: 'success'}, ({links}) => <LinksList links={links} onDelete={handleDelete} />)
    .exhaustive();
}
