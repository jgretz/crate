import {createFileRoute} from '@tanstack/react-router';
import {LinkList} from '../../src/components/LinkList';
import {AddLinkForm} from '../../src/components/AddLinkForm';

export const Route = createFileRoute('/')({
  component: Home,
});

function Home() {
  return (
    <div className='max-w-4xl mx-auto p-6'>
      <header className='mb-8'>
        <h1 className='text-3xl font-bold text-gray-900 mb-2'>Crate</h1>
        <p className='text-gray-600'>Save and organize your links</p>
      </header>

      <div className='space-y-8'>
        <AddLinkForm />
        <LinkList />
      </div>
    </div>
  );
}
