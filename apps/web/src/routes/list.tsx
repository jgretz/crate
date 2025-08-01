import {createFileRoute} from '@tanstack/react-router';
import {LinkList} from '../components/LinkList';
import {AddLinkForm} from '../components/AddLinkForm';
import {requireAuth} from '../services/auth/requireAuth';
import {Mascot} from '../components/Mascot';

export const Route = createFileRoute('/list')({
  beforeLoad: requireAuth,
  component: List,
});

function List() {
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
