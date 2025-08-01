import {useState} from 'react';
import {useMutation, useQueryClient} from '@tanstack/react-query';
import {useForm} from '@tanstack/react-form';
import {createLink} from '../services';
import type {CreateLinkInput} from '@stashl/domain-types';
import {createLinkSchema, type CreateLinkFormData} from '../schemas';
import {Button} from './ui/button';
import {FormInput, FormTextArea} from './forms';
import {Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger} from './ui/dialog';
import {DialogDescription} from '@radix-ui/react-dialog';

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

export function AddLinkForm() {
  const [isOpen, setIsOpen] = useState(false);
  const queryClient = useQueryClient();

  const createLinkMutation = useMutation({
    mutationFn: (input: CreateLinkInput) => createLink(input),
    onSuccess: () => {
      queryClient.invalidateQueries({queryKey: ['links']});
      setIsOpen(false);
      form.reset();
    },
  });

  const form = useForm({
    defaultValues: {
      url: '',
      title: '',
      description: '',
    } as CreateLinkFormData,
    onSubmit: async ({value}) => {
      // Convert empty description to undefined for optional field
      const formData = {
        ...value,
        description: value.description?.trim() || undefined,
      };

      // Validate the entire form with Zod before submission
      const validationResult = createLinkSchema.safeParse(formData);
      if (!validationResult.success) {
        // This shouldn't happen if field validation is working correctly
        console.error('Form validation failed:', validationResult.error);
        return;
      }
      createLinkMutation.mutate(validationResult.data as CreateLinkInput);
    },
  });

  return (
    <div>
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogTrigger asChild>
          <Button className='rounded p-4' onClick={() => setIsOpen(true)}>
            Add a new link
          </Button>
        </DialogTrigger>

        <DialogContent className='p-6'>
          <DialogHeader>
            <DialogTitle>Add New Link</DialogTitle>
            <DialogDescription>Add a new link to your collection</DialogDescription>
          </DialogHeader>

          <form
            onSubmit={(e) => {
              e.preventDefault();
              e.stopPropagation();
              form.handleSubmit();
            }}
          >
            <form.Field
              name='url'
              validators={{
                onChange: createZodValidator<CreateLinkFormData>(createLinkSchema, 'url'),
              }}
            >
              {(field) => (
                <FormInput
                  id={field.name}
                  name={field.name}
                  label='URL'
                  value={field.state.value}
                  onBlur={field.handleBlur}
                  onChange={field.handleChange}
                  error={field.state.meta.errors?.[0]}
                  type='url'
                  placeholder='https://example.com'
                  autoFocus
                  required
                />
              )}
            </form.Field>

            <form.Field
              name='title'
              validators={{
                onChange: createZodValidator<CreateLinkFormData>(createLinkSchema, 'title'),
              }}
            >
              {(field) => (
                <FormInput
                  id={field.name}
                  name={field.name}
                  label='Title'
                  value={field.state.value}
                  onBlur={field.handleBlur}
                  onChange={field.handleChange}
                  error={field.state.meta.errors?.[0]}
                  placeholder='Title for this link'
                  required
                />
              )}
            </form.Field>

            <form.Field
              name='description'
              validators={{
                onChange: createZodValidator<CreateLinkFormData>(createLinkSchema, 'description'),
              }}
            >
              {(field) => (
                <FormTextArea
                  id={field.name}
                  name={field.name}
                  label='Description'
                  value={field.state.value || ''}
                  onBlur={field.handleBlur}
                  onChange={field.handleChange}
                  error={field.state.meta.errors?.[0]}
                  placeholder='Description of this link'
                  rows={3}
                />
              )}
            </form.Field>

            <div className='flex flex-row'>
              <Button
                type='button'
                variant='outline'
                onClick={() => {
                  setIsOpen(false);
                  form.reset();
                }}
                className='flex-1'
              >
                Cancel
              </Button>
              <div className='w-3'></div>
              <form.Subscribe selector={(state) => [state.canSubmit, state.isSubmitting]}>
                {([canSubmit, isSubmitting]) => (
                  <Button
                    type='submit'
                    disabled={!canSubmit || createLinkMutation.isPending}
                    className='flex-1'
                  >
                    {createLinkMutation.isPending || isSubmitting ? 'Adding...' : 'Add Link'}
                  </Button>
                )}
              </form.Subscribe>
            </div>

            {createLinkMutation.error && (
              <p className='text-red-600 text-sm mt-2'>Failed to add link. Please try again.</p>
            )}
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
