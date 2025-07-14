import {useState} from 'react';
import {useMutation, useQueryClient} from '@tanstack/react-query';
import {useForm} from '@tanstack/react-form';
import {createLink} from '../services';
import type {CreateLinkInput} from '@crate/domain-types';
import {Button} from './ui/button';
import {Input} from './ui/input';
import {Label} from './ui/label';
import {Textarea} from './ui/textarea';
import {Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger} from './ui/dialog';
import {DialogDescription} from '@radix-ui/react-dialog';

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
    } as CreateLinkInput,
    onSubmit: async ({value}) => {
      createLinkMutation.mutate(value);
    },
  });

  return (
    <div className='bg-white rounded-lg border shadow-sm p-6'>
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogTrigger asChild>
          <button
            onClick={() => setIsOpen(true)}
            className='w-full p-4 text-left text-gray-500 border-2 border-dashed border-gray-300 rounded-lg hover:border-gray-400 hover:text-gray-600 transition-colors'
          >
            + Add a new link
          </button>
        </DialogTrigger>

        <DialogContent className='sm:max-w-md'>
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
            className='space-y-4'
          >
            <form.Field
              name='url'
              validators={{
                onChange: ({value}) =>
                  !value
                    ? 'URL is required'
                    : !/^https?:\/\/.+/.test(value)
                      ? 'Please enter a valid URL'
                      : undefined,
              }}
            >
              {(field) => (
                <div>
                  <Label htmlFor={field.name}>URL *</Label>
                  <Input
                    id={field.name}
                    name={field.name}
                    value={field.state.value}
                    onBlur={field.handleBlur}
                    onChange={(e) => field.handleChange(e.target.value)}
                    type='url'
                    placeholder='https://example.com'
                    autoFocus
                  />
                  {field.state.meta.errors ? (
                    <p className='text-sm text-red-600 mt-1'>{field.state.meta.errors[0]}</p>
                  ) : null}
                </div>
              )}
            </form.Field>

            <form.Field
              name='title'
              validators={{
                onChange: ({value}) => (!value ? 'Title is required' : undefined),
              }}
            >
              {(field) => (
                <div>
                  <Label htmlFor={field.name}>Title *</Label>
                  <Input
                    id={field.name}
                    name={field.name}
                    value={field.state.value}
                    onBlur={field.handleBlur}
                    onChange={(e) => field.handleChange(e.target.value)}
                    placeholder='Title for this link'
                  />
                  {field.state.meta.errors ? (
                    <p className='text-sm text-red-600 mt-1'>{field.state.meta.errors[0]}</p>
                  ) : null}
                </div>
              )}
            </form.Field>

            <form.Field
              name='description'
              validators={{
                onChange: ({value}) => (!value ? 'Description is required' : undefined),
              }}
            >
              {(field) => (
                <div>
                  <Label htmlFor={field.name}>Description *</Label>
                  <Textarea
                    id={field.name}
                    name={field.name}
                    value={field.state.value}
                    onBlur={field.handleBlur}
                    onChange={(e) => field.handleChange(e.target.value)}
                    placeholder='Description of this link'
                    rows={3}
                  />
                  {field.state.meta.errors ? (
                    <p className='text-sm text-red-600 mt-1'>{field.state.meta.errors[0]}</p>
                  ) : null}
                </div>
              )}
            </form.Field>

            <div className='flex space-x-3 pt-2'>
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
