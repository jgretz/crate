import {createFileRoute} from '@tanstack/react-router';
import {UsersTable} from '@web/components/admin/UsersTable';
import {requireAuth} from '@web/services/auth/requireAuth';

export const Route = createFileRoute('/admin/users')({
  beforeLoad: requireAuth,
  component: AdminUsers,
});

function AdminUsers() {
  return (
    <div className='max-w-[800px] mx-auto px-4 py-8'>
      <div className='flex flex-row items-center justify-between w-full mb-8'>
        <div className='flex-1'></div>
        <div className='flex-1 text-center'>
          <h1 className='text-3xl font-bold'>User Management</h1>
        </div>
        <div className='flex-1'></div>
      </div>

      <UsersTable />
    </div>
  );
}
