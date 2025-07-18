import {createFileRoute} from '@tanstack/react-router';
import {LinkList} from '../components/LinkList';
import {AddLinkForm} from '../components/AddLinkForm';
import {requireAuth} from '../services/auth/requireAuth';

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
          <h1 className='text-3xl font-bold'>Crate</h1>
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
