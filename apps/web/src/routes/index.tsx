import {createFileRoute, Link} from '@tanstack/react-router';
import {Button} from '../components/ui/button';

export const Route = createFileRoute('/')({
  component: Landing,
});

function Landing() {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="max-w-[800px] mx-auto w-full px-4 text-center">
        <h1 className="text-3xl font-bold mb-6">Crate</h1>
        <p className="text-gray-600 mb-8 text-lg">
          Organize and manage your links in one place
        </p>
        <Link to="/login">
          <Button size="lg" className="px-8 py-3">
            Get Started
          </Button>
        </Link>
      </div>
    </div>
  );
}