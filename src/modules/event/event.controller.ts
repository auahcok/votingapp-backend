import { Request, Response } from 'express';
import { CreateEventSchemaType, GetEventsSchemaType, CreateVoteSchemaType } from './event.schema';
import {
  createEvent,
  getEventById,
  updateEvent,
  deleteEvent,
  getEvents,
  createVote,
} from './event.services';
import { successResponse } from '../../utils/api.utils';
import { StatusCodes } from 'http-status-codes';

export const handleCreateEvent = async (
  req: Request<unknown, unknown, CreateEventSchemaType>,
  res: Response,
) => {
  const event = await createEvent(req.body);

  return successResponse(
    res,
    'Event has been created',
    event,
    StatusCodes.CREATED,
  );
  // return res.status(201).json({ message: 'Event created', event });
};

export const handleGetEventById = async (
  req: Request<{ id: string }>,
  res: Response,
) => {
  const event = await getEventById(req.params.id);

  return successResponse(res, undefined, event);
  // return res.json(event);
};

export const handleGetEvents = async (
  req: Request<unknown, unknown, unknown, GetEventsSchemaType>,
  res: Response,
) => {
  // const { keyword, limitParam, pageParam, isActive } = req.query;
  // const limit = parseInt(limitParam as unknown as string) || 10;
  // const page = parseInt(pageParam as unknown as string) || 1;
  // const activeStatus =
  //   isActive === 'true' ? true : isActive === 'false' ? false : undefined;

  const { results, paginatorInfo } = await getEvents(req.query);

  // return res.json({ results, totalRecords });
  return successResponse(res, undefined, { results, paginatorInfo });
};

export const handleUpdateEvent = async (
  req: Request<{ id: string }, unknown, Partial<CreateEventSchemaType>>,
  res: Response,
) => {
  const event = await updateEvent(req.params.id, req.body);

  return successResponse(
    res,
    'Event has been updated',
    event,
    StatusCodes.ACCEPTED,
  );
  // return res.json(event);
};

export const handleDeleteEvent = async (
  req: Request<{ id: string }>,
  res: Response,
) => {
  await deleteEvent(req.params.id);

  return successResponse(res, 'Event has been deleted');
  // return res.json({ message: 'Event deleted' });
};

export const handleCreateVote = async (
  req: Request<{id: string}, unknown, CreateVoteSchemaType>,
  res: Response,
) => {
  const vote = await createVote(req.params.id, req.body);

  return successResponse(res, 'Vote has been created', vote, StatusCodes.CREATED);
  // return res.json(vote);
};
