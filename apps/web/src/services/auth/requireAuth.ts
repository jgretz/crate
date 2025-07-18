import {redirect} from '@tanstack/react-router';
import {isAuthenticated} from '../auth-service';

export function requireAuth({location}: {location: {href: string}}) {
  if (!isAuthenticated()) {
    throw redirect({
      to: '/login',
      search: {
        redirect: location.href,
      },
    });
  }
}