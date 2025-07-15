import {createRootRoute, Outlet, HeadContent, Scripts} from '@tanstack/react-router';
import {TanStackRouterDevtools} from '@tanstack/react-router-devtools';
import {QueryClient, QueryClientProvider} from '@tanstack/react-query';
import {ReactQueryDevtools} from '@tanstack/react-query-devtools';

import '../globals.css';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // 5 minutes
    },
  },
});

export const Route = createRootRoute({
  head: () => ({
    meta: [
      {
        charSet: 'utf-8',
      },
      {
        name: 'viewport',
        content: 'width=device-width, initial-scale=1',
      },
      {
        title: 'Crate',
      },
    ],
    links: [
      {
        rel: 'icon',
        type: 'image/svg+xml',
        href: 'favicon.svg',
      },
    ],
  }),
  component: Root,
});

export default function Root() {
  return (
    <html>
      <head>
        <HeadContent />
      </head>
      <body className='min-h-screen'>
        <QueryClientProvider client={queryClient}>
          <Outlet />
          <ReactQueryDevtools />
          <TanStackRouterDevtools />
        </QueryClientProvider>
        <Scripts />
      </body>
    </html>
  );
}
