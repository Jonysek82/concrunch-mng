import { z } from 'zod';

// Pole odpovídají modelu Event a validaci eventRules na backendu.
export const eventSchema = z
  .object({
    title: z
      .string()
      .trim()
      .min(3, 'Název musí mít alespoň 3 znaky')
      .max(120, 'Název může mít nejvýše 120 znaků'),
    description: z
      .string()
      .trim()
      .min(1, 'Popis je povinný')
      .max(2000, 'Popis může mít nejvýše 2000 znaků'),
    day: z.string().min(1, 'Zadejte datum'),
    startTime: z.string().regex(/^\d{2}:\d{2}$/, 'Zadejte začátek'),
    endTime: z.string().regex(/^\d{2}:\d{2}$/, 'Zadejte konec'),
    location: z.string().trim().min(1, 'Místo je povinné').max(120, 'Místo může mít nejvýše 120 znaků'),
    status: z.enum(['draft', 'published']),
    performerIds: z.array(z.string()),
    tagIds: z.array(z.string()),
  })
  .refine((d) => !d.startTime || !d.endTime || d.endTime > d.startTime, {
    message: 'Konec musí být po začátku',
    path: ['endTime'],
  });

export type EventFormValues = z.infer<typeof eventSchema>;
