import {useForm} from '@tanstack/react-form';
import {useNavigate} from '@tanstack/react-router';
import {useState} from 'react';
import {login, setAuthToken} from '@web/services';
import {loginSchema, type LoginFormData} from '@web/schemas';

import {Button} from '@web/components/ui/button';
import {FormInput} from '@web/components/forms/FormInput';
import {createZodValidator} from '@web/components/forms/createZodValidator';
import {ResetPasswordDialog} from '@web/components/auth/ResetPasswordDialog';

export function LoginForm() {
  const navigate = useNavigate();
  const [showResetDialog, setShowResetDialog] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

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

      setIsLoading(true);
      setError(null);

      try {
        const data = await login({
          data: validationResult.data,
        });
        setAuthToken(data.token);
        navigate({to: '/list'});
      } catch (err) {
        setError('Invalid email or password. Please try again.');
        console.error('Login failed:', err);
      } finally {
        setIsLoading(false);
      }
    },
  });

  return (
    <div className='max-w-md mx-auto'>
      <div className='bg-white p-8 rounded-lg border border-gray-200 shadow-sm'>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            e.stopPropagation();
            form.handleSubmit();
          }}
        >
          <form.Field
            name='email'
            validators={{
              onChange: createZodValidator<LoginFormData>(loginSchema, 'email'),
            }}
          >
            {(field) => (
              <FormInput
                id={field.name}
                name={field.name}
                label='Email'
                value={field.state.value}
                onBlur={field.handleBlur}
                onChange={field.handleChange}
                error={field.state.meta.errors?.[0]}
                type='email'
                placeholder='your@email.com'
                autoFocus
                required
              />
            )}
          </form.Field>

          <form.Field
            name='password'
            validators={{
              onChange: createZodValidator<LoginFormData>(loginSchema, 'password'),
            }}
          >
            {(field) => (
              <FormInput
                id={field.name}
                name={field.name}
                label='Password'
                value={field.state.value}
                onBlur={field.handleBlur}
                onChange={field.handleChange}
                error={field.state.meta.errors?.[0]}
                type='password'
                placeholder='Your password'
                required
              />
            )}
          </form.Field>

          <form.Subscribe selector={(state) => [state.canSubmit, state.isSubmitting]}>
            {([canSubmit, isSubmitting]) => (
              <Button type='submit' disabled={!canSubmit || isLoading} className='w-full mt-6'>
                {isLoading || isSubmitting ? 'Signing in...' : 'Sign in'}
              </Button>
            )}
          </form.Subscribe>

          {error && <p className='text-red-600 text-sm mt-2 text-center'>{error}</p>}

          <div className='text-center mt-4'>
            <button
              type='button'
              onClick={() => setShowResetDialog(true)}
              className='text-sm text-blue-600 hover:text-blue-800 underline'
            >
              Forgot your password?
            </button>
          </div>
        </form>

        <ResetPasswordDialog open={showResetDialog} onOpenChange={setShowResetDialog} />
      </div>
    </div>
  );
}
