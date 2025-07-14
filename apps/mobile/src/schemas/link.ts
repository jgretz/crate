import {z} from 'zod';

export const createLinkSchema = z.object({
  url: z
    .url('Please enter a valid URL')
    .min(1, 'URL is required')
    .refine((url) => /^https?:\/\/.+/.test(url), 'URL must start with http:// or https://'),
  title: z.string().min(1, 'Title is required').max(200, 'Title must be less than 200 characters'),
  description: z.string().max(1000, 'Description must be less than 1000 characters').optional(),
});

export type CreateLinkFormData = z.infer<typeof createLinkSchema>;
