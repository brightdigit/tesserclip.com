// Content collections (spec §6). Help articles (#3) and legal pages (#4) add
// their entries to src/content/help/ and src/content/legal/.
import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';

const help = defineCollection({
  loader: glob({ pattern: '**/*.mdx', base: './src/content/help' }),
  schema: z.object({
    title: z.string(),
    description: z.string(),
    breadcrumb: z.string(),
    order: z.number(),
    related: z.array(z.object({ label: z.string(), href: z.string() })).optional(),
  }),
});

const legal = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/legal' }),
  schema: z.object({
    title: z.string(),
    description: z.string(),
    lastUpdated: z.coerce.date(),
    dateLabel: z.enum(['Last updated', 'Effective']),
  }),
});

export const collections = { help, legal };
