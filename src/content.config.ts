import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';

const guias = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/guias' }),
  schema: z.object({
    title: z.string(),
    description: z.string(),
    /** Fecha de la última revisión del contenido (AAAA-MM-DD). */
    updated: z.string(),
    models: z.array(z.string()).default([]),
    order: z.number().default(99),
    /** Servicio relacionado (slug de /servicios/). */
    service: z.string().optional(),
  }),
});

export const collections = { guias };
