import { Request, Response } from 'express';
import { CreateEventSchemaType, GetEventsSchemaType } from './event.schema';
import {
  createEvent,
  getEventById,
  updateEvent,
  deleteEvent,
  getEvents,
} from './event.services';

export const handleCreateEvent = async (
  req: Request<unknown, unknown, CreateEventSchemaType>,
  res: Response,
) => {
  const event = await createEvent(req.body);
  return res.status(201).json({ message: 'Event created', event });
};

export const handleGetEventById = async (
  req: Request<{ id: string }>,
  res: Response,
) => {
  const event = await getEventById(req.params.id);
  return res.json(event);
};

export const handleUpdateEvent = async (
  req: Request<{ id: string }, unknown, Partial<CreateEventSchemaType>>,
  res: Response,
) => {
  const event = await updateEvent(req.params.id, req.body);
  return res.json(event);
};

export const handleDeleteEvent = async (
  req: Request<{ id: string }>,
  res: Response,
) => {
  await deleteEvent(req.params.id);
  return res.json({ message: 'Event deleted' });
};

export const handleGetEvents = async (
  req: Request<unknown, unknown, unknown, GetEventsSchemaType>,
  res: Response,
) => {
  const { searchString, limitParam, pageParam, isActive } = req.query;
  const limit = parseInt(limitParam as unknown as string) || 10;
  const page = parseInt(pageParam as unknown as string) || 1;
  const activeStatus = isActive === 'true' ? true : isActive === 'false' ? false : undefined;

  const { results, totalRecords } = await getEvents(searchString, limit, page, activeStatus);
  return res.json({ results, totalRecords });
};
