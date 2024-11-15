import * as z from 'zod';
import { eventSchema } from './event.dto';

export const createEventSchema = eventSchema;

export const getEventsSchema = z.object({
  keyword: z.string().optional(),
  limitParam: z.string().default('10').transform(Number),
  pageParam: z.string().default('1').transform(Number),
  isActive: z.boolean().optional(),
});

export type CreateEventSchemaType = z.infer<typeof createEventSchema>;
export type GetEventsSchemaType = z.infer<typeof getEventsSchema>;
