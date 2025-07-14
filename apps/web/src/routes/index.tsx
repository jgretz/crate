import {createFileRoute} from '@tanstack/react-router';
import {LinkList} from '../../src/components/LinkList';
import {AddLinkForm} from '../../src/components/AddLinkForm';

export const Route = createFileRoute('/')({
  component: Home,
});

function Home() {
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
