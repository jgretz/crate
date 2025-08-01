import {useMutation} from '@tanstack/react-query';
import {useForm} from '@tanstack/react-form';
import {useNavigate} from '@tanstack/react-router';
import {useState} from 'react';
import {login, setAuthToken} from '../services';
import {loginSchema, type LoginFormData} from '../schemas';
import {Button} from './ui/button';
import {FormInput} from './forms';
import {ResetPasswordDialog} from './ResetPasswordDialog';

// Helper function to create TanStack Form validators from Zod schema
function createZodValidator<T>(schema: any, field: keyof T) {
  return ({value}: {value: any}) => {
    const result = schema.safeParse({[field]: value});
    if (!result.success) {
      const fieldError = result.error.issues.find((issue) => issue.path[0] === field);
      return fieldError?.message;
    }
    return undefined;
  };
}

export function LoginForm() {
  const navigate = useNavigate();
  const [showResetDialog, setShowResetDialog] = useState(false);

  const loginMutation = useMutation({
    mutationFn: login,
    onSuccess: (data) => {
      setAuthToken(data.token);
      navigate({to: '/list'});
    },
  });

  const form = useForm({
    defaultValues: {
      email: '',
      password: '',
    } as LoginFormData,
    onSubmit: async ({value}) => {
      // Validate the entire form with Zod before submission
      const validationResult = loginSchema.safeParse(value);
      if (!validationResult.success) {
        console.error('Form validation failed:', validationResult.error);
        return;
      }
      loginMutation.mutate(validationResult.data);
    },
  });

  return (
    <div className="max-w-md mx-auto">
      <div className="bg-white p-8 rounded-lg border border-gray-200 shadow-sm">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            e.stopPropagation();
            form.handleSubmit();
          }}
        >
          <form.Field
            name="email"
            validators={{
              onChange: createZodValidator<LoginFormData>(loginSchema, 'email'),
            }}
          >
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
                placeholder="your@email.com"
                autoFocus
                required
              />
            )}
          </form.Field>

          <form.Field
            name="password"
            validators={{
              onChange: createZodValidator<LoginFormData>(loginSchema, 'password'),
            }}
          >
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
                placeholder="Your password"
                required
              />
            )}
          </form.Field>

          <form.Subscribe selector={(state) => [state.canSubmit, state.isSubmitting]}>
            {([canSubmit, isSubmitting]) => (
              <Button
                type="submit"
                disabled={!canSubmit || loginMutation.isPending}
                className="w-full mt-6"
              >
                {loginMutation.isPending || isSubmitting ? 'Signing in...' : 'Sign in'}
              </Button>
            )}
          </form.Subscribe>

          {loginMutation.error && (
            <p className="text-red-600 text-sm mt-2 text-center">
              Invalid email or password. Please try again.
            </p>
          )}

          <div className="text-center mt-4">
            <button
              type="button"
              onClick={() => setShowResetDialog(true)}
              className="text-sm text-blue-600 hover:text-blue-800 underline"
            >
              Forgot your password?
            </button>
          </div>
        </form>

        <ResetPasswordDialog
          open={showResetDialog}
          onOpenChange={setShowResetDialog}
        />
      </div>
    </div>
  );
}