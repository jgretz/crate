import {createFileRoute, useRouter} from '@tanstack/react-router';
import {useEffect} from 'react';
import {LinkList} from '@web/components/links/LinkList';
import {AddLinkForm} from '@web/components/links/AddLinkForm';
import {requireAuth, isAuthenticated} from '@web/services';
import {Mascot} from '@web/components/Mascot';

export const Route = createFileRoute('/list')({
  beforeLoad: requireAuth,
  component: List,
});

function List() {
  const router = useRouter();

  useEffect(() => {
    // Client-side auth check after component mounts
    if (!isAuthenticated()) {
      router.navigate({
        to: '/login',
        search: {
          redirect: window.location.href,
        },
      });
    }
  }, [router]);

  // Don't render content during SSR to avoid hydration mismatch
  if (typeof document === 'undefined') {
    return null;
  }

  // Don't render if not authenticated (will redirect)
  if (!isAuthenticated()) {
    return null;
  }

  return (
    <div className='max-w-[800px] mx-auto'>
      <div className='flex flex-row items-center justify-center py-5'>
        <div className='flex items-center gap-3'>
          <Mascot />
          <h1 className='text-3xl font-bold'>Stashl.ink</h1>
        </div>
      </div>

      <div className='flex justify-end mb-4'>
        <AddLinkForm />
      </div>

      <div className='space-y-8'>
        <LinkList />
      </div>
    </div>
  );
}
