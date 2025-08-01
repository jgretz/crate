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
    <div className='border border-amber-200 rounded-lg p-4 bg-amber-50 shadow-sm hover:shadow-md transition-all hover:border-amber-300 hover:bg-amber-100'>
      <div className='flex items-start justify-between'>
        <div className='flex-1 min-w-0'>
          <div className='flex items-center space-x-2'>
            <a
              href={link.url}
              target='_blank'
              rel='noopener noreferrer'
              className='text-lg font-medium text-teal-700 hover:text-orange-600 truncate transition-colors'
            >
              {link.title}
            </a>
          </div>

          <p className='text-sm text-teal-600 truncate mt-1'>{link.url}</p>
          <p className='text-amber-900 mt-2 line-clamp-2'>{link.description}</p>
          <p className='text-xs text-amber-700 mt-3'>Added {formatDate(link.dateAdded)}</p>
        </div>

        <div className='flex items-center space-x-2 ml-4'>
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button variant='destructive' size='sm' className='bg-orange-500 hover:bg-orange-600 border-orange-600'>
                Delete
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent className='bg-amber-50 border-amber-200'>
              <AlertDialogHeader>
                <AlertDialogTitle className='text-amber-900'>Are you absolutely sure?</AlertDialogTitle>
                <AlertDialogDescription className='text-amber-800'>
                  This action cannot be undone. This will permanently delete the link &quot;
                  {link.title}&quot;.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel className='bg-amber-100 text-amber-900 border-amber-300 hover:bg-amber-200'>Cancel</AlertDialogCancel>
                <AlertDialogAction onClick={onDelete} className='bg-orange-500 hover:bg-orange-600 text-white'>Delete</AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      </div>
    </div>
  );
}
