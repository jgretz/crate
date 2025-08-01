import {createFileRoute, useRouter} from '@tanstack/react-router';
import {useEffect} from 'react';
import {LinkList} from '../components/LinkList';
import {AddLinkForm} from '../components/AddLinkForm';
import {requireAuth} from '../services/auth/requireAuth';
import {isAuthenticated} from '../services/auth-service';
import {Mascot} from '../components/Mascot';

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
      <div className='flex flex-row items-center justify-between w-full py-5'>
        <div className='flex-1'></div>
        <div className='flex-1 text-center'>
          <div className='flex items-center justify-center gap-3'>
            <Mascot />
            <h1 className='text-3xl font-bold'>Stashl.ink</h1>
          </div>
        </div>
        <div className='flex-1 flex justify-center items-right'>
          <AddLinkForm />
        </div>
      </div>

      <div className='space-y-8'>
        <LinkList />
      </div>
    </div>
  );
}
