import { z } from 'zod';

const optionalUrl = z.string().trim().url('Zadejte platnou URL adresu').or(z.literal(''));

// Společný formulář pro Performer (POST /api/performers) a Merchant (POST /api/merchants).
export const performerSchema = z.object({
  type: z.enum(['performer', 'vendor']),
  name: z
    .string()
    .trim()
    .min(2, 'Jméno musí mít alespoň 2 znaky')
    .max(80, 'Jméno může mít nejvýše 80 znaků'),
  description: z
    .string()
    .trim()
    .min(1, 'Popis je povinný')
    .max(1000, 'Popis může mít nejvýše 1000 znaků'),
  imageUrl: optionalUrl,
  website: optionalUrl, // jen vendor
  tagIds: z.array(z.string()),
  published: z.boolean(),
});

export type PerformerFormValues = z.infer<typeof performerSchema>;
