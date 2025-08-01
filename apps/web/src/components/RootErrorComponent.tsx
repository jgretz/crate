import {Link, ErrorComponent, useRouter} from '@tanstack/react-router';
import {Button} from './ui/button';
import {Mascot} from './Mascot';

export function RootErrorComponent({error}: {error: Error}) {
  const router = useRouter();

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="max-w-[800px] mx-auto w-full px-4 text-center">
        <div className="flex items-center justify-center gap-3 mb-4">
          <Mascot />
          <h1 className="text-3xl font-bold">Stashl.ink</h1>
        </div>
        <h2 className="text-xl font-semibold text-red-600 mb-4">Something went wrong</h2>
        
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
          <p className="text-red-800 font-medium mb-2">Error Details:</p>
          <p className="text-red-700 text-sm font-mono break-all">
            {error.message}
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button
            onClick={() => router.invalidate()}
            variant="outline"
          >
            Try Again
          </Button>
          
          <Link to="/">
            <Button>
              Go Home
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}