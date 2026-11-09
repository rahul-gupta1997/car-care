import { z } from 'zod';
export const vehicleSchema = z.object({
  name: z.string().trim().min(2, 'Enter the make and model.').max(60),
  plate: z
    .string()
    .trim()
    .min(4, 'Enter a registration number.')
    .max(20)
    .regex(/^[a-zA-Z0-9 -]+$/, 'Use letters, numbers, spaces or hyphens.')
    .transform((value) => value.toUpperCase()),
});
