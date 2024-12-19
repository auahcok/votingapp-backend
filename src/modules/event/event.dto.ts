import z from 'zod';

// Schema untuk Kandidat
export const candidateSchema = z.object({
  id: z.string().min(1, 'Candidate ID is required').optional(),
  eventId: z.string().min(1, 'Event ID is required').optional(),
  photo: z.string().min(1, 'Photo is required'),
  name: z.string().min(1, 'Candidate name is required'),
  position: z.string().min(1, 'Position is required'),
  sequence: z
    .number()
    .min(1, 'Sequence is required and must be a positive number'),
  visi: z.string().min(1, 'Visi is required'),
  misi: z.string().min(1, 'Misi is required'),
  comment: z.string().min(1, 'Comment is required'),
});

// Schema untuk Event
export const eventSchema = z.object({
  id: z.string().min(1, 'Candidate ID is required').optional(),
  title: z.string().min(1, 'Title is required'),
  description: z.string().min(1, 'Description is required'),
  isActive: z.boolean().optional(),
  startDate: z.string().refine((val) => !isNaN(Date.parse(val)), {
    message: 'Start date must be a valid date',
  }),
  endDate: z.string().refine((val) => !isNaN(Date.parse(val)), {
    message: 'End date must be a valid date',
  }),
  candidates: z.array(candidateSchema).optional(),
});

// Schema untuk Vote
export const voteSchema = z.object({
  candidateId: z.string().min(1, 'Candidate ID is required'),
});

export type EventType = z.infer<typeof eventSchema>;
export type VoteType = z.infer<typeof voteSchema>;
