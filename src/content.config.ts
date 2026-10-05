import { defineCollection } from 'astro:content';
import { z } from 'astro/zod';
import { glob } from 'astro/loaders';

const posts = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/posts' }),
  schema: z.object({
    title: z.string(),
    description: z.string(),
    date: z.coerce.date(),
    category: z.enum(['hiking', 'gear', 'essay']),
    image: z.enum(['lake', 'forest', 'ridge']),
    location: z.string(),
    readingTime: z.number().positive(),
    sample: z.boolean().default(false),
    draft: z.boolean().default(false),
  }),
});

export const collections = { posts };
