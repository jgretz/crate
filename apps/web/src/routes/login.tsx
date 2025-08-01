import {createFileRoute} from '@tanstack/react-router';
import {LoginForm} from '../components/LoginForm';

export const Route = createFileRoute('/login')({
  component: Login,
});

function Login() {
  return (
    <div className='min-h-screen flex items-center justify-center'>
      <div className='max-w-[800px] mx-auto w-full px-4'>
        <div className='text-center mb-8'>
          <div className='flex items-center justify-center gap-3 mb-2'>
            <img src="/stashl-logo.png" alt="Stashl.ink mascot" className="w-12 h-12" />
            <h1 className='text-3xl font-bold'>Stashl.ink</h1>
          </div>
          <p className='text-gray-600 mt-2'>Sign in to your account</p>
        </div>
        <LoginForm />
      </div>
    </div>
  );
}
