import type {Link} from '@stashl/domain-types';
import {Button} from './ui/button';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from './ui/alert-dialog';

interface LinkCardProps {
  link: Link;
  onDelete: () => void;
}

export function LinkCard({link, onDelete}: LinkCardProps) {
  const formatDate = (date: Date | string) => {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  return (
    <div className='border rounded-lg p-4 bg-white shadow-sm hover:shadow-md transition-shadow'>
      <div className='flex items-start justify-between'>
        <div className='flex-1 min-w-0'>
          <div className='flex items-center space-x-2'>
            <a
              href={link.url}
              target='_blank'
              rel='noopener noreferrer'
              className='text-lg font-medium text-blue-600 hover:text-blue-800 truncate'
            >
              {link.title}
            </a>
          </div>

          <p className='text-sm text-gray-500 truncate mt-1'>{link.url}</p>
          <p className='text-gray-700 mt-2 line-clamp-2'>{link.description}</p>
          <p className='text-xs text-gray-400 mt-3'>Added {formatDate(link.dateAdded)}</p>
        </div>

        <div className='flex items-center space-x-2 ml-4'>
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button variant='destructive' size='sm'>
                Delete
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                <AlertDialogDescription>
                  This action cannot be undone. This will permanently delete the link &quot;
                  {link.title}&quot;.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction onClick={onDelete}>Delete</AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      </div>
    </div>
  );
}
