import {createFileRoute, Link} from '@tanstack/react-router';
import {Button} from '../components/ui/button';
import {Mascot} from '../components/Mascot';

export const Route = createFileRoute('/')({
  component: Landing,
});

function Landing() {
  return (
    <div className='min-h-screen flex items-center justify-center'>
      <div className='max-w-[800px] mx-auto w-full px-4 text-center'>
        <div className='flex items-center justify-center gap-4 mb-6'>
          <Mascot />
          <h1 className='text-3xl font-bold'>Stashl.ink</h1>
        </div>
        <p className='text-gray-600 mb-8 text-lg'>Organize and manage your links in one place</p>
        <Link to='/list'>
          <Button size='lg' className='px-8 py-3'>
            Get Started
          </Button>
        </Link>
      </div>
    </div>
  );
}
