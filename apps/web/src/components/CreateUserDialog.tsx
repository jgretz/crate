import {useForm} from '@tanstack/react-form';
import {Button} from './ui/button';
import {FormInput} from './forms';
import {Dialog, DialogContent, DialogHeader, DialogTitle} from './ui/dialog';
import {type CreateUserInput} from '../services/user-service';

interface CreateUserDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (input: CreateUserInput) => void;
  isLoading: boolean;
  error: Error | null;
}

export function CreateUserDialog({
  isOpen,
  onClose,
  onSubmit,
  isLoading,
  error,
}: CreateUserDialogProps) {
  const form = useForm({
    defaultValues: {
      email: '',
      name: '',
      password: '',
    } as CreateUserInput,
    onSubmit: async ({value}) => {
      onSubmit(value);
    },
  });

  const handleClose = () => {
    form.reset();
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="p-6">
        <DialogHeader>
          <DialogTitle>Create New User</DialogTitle>
        </DialogHeader>

        <form
          onSubmit={(e) => {
            e.preventDefault();
            e.stopPropagation();
            form.handleSubmit();
          }}
        >
          <form.Field name="name">
            {(field) => (
              <FormInput
                id={field.name}
                name={field.name}
                label="Name"
                value={field.state.value}
                onBlur={field.handleBlur}
                onChange={field.handleChange}
                error={field.state.meta.errors?.[0]}
                placeholder="Full name"
                autoFocus
                required
              />
            )}
          </form.Field>

          <form.Field name="email">
            {(field) => (
              <FormInput
                id={field.name}
                name={field.name}
                label="Email"
                value={field.state.value}
                onBlur={field.handleBlur}
                onChange={field.handleChange}
                error={field.state.meta.errors?.[0]}
                type="email"
                placeholder="user@example.com"
                required
              />
            )}
          </form.Field>

          <form.Field name="password">
            {(field) => (
              <FormInput
                id={field.name}
                name={field.name}
                label="Password"
                value={field.state.value}
                onBlur={field.handleBlur}
                onChange={field.handleChange}
                error={field.state.meta.errors?.[0]}
                type="password"
                placeholder="Password"
                required
              />
            )}
          </form.Field>

          <div className="flex flex-row gap-3 mt-6">
            <Button
              type="button"
              variant="outline"
              onClick={handleClose}
              className="flex-1"
            >
              Cancel
            </Button>
            
            <form.Subscribe selector={(state) => [state.canSubmit, state.isSubmitting]}>
              {([canSubmit, isSubmitting]) => (
                <Button
                  type="submit"
                  disabled={!canSubmit || isLoading}
                  className="flex-1"
                >
                  {isLoading || isSubmitting ? 'Creating...' : 'Create User'}
                </Button>
              )}
            </form.Subscribe>
          </div>

          {error && (
            <p className="text-red-600 text-sm mt-2">
              Failed to create user. Please try again.
            </p>
          )}
        </form>
      </DialogContent>
    </Dialog>
  );
}