import { Request, Response } from 'express';
import {
  CreateEventSchemaType,
  GetEventsSchemaType,
  CreateVoteSchemaType,
  GetActiveEventSchemaType,
} from './event.schema';
import {
  createEvent,
  getEventById,
  updateEvent,
  deleteEvent,
  getAllEvents,
  getUserEvents,
  createVote,
  getActiveEvent,
} from './event.services';
import { errorResponse, successResponse } from '../../utils/api.utils';
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
  try {
    let results, paginatorInfo;

    if (req.user.role === 'DEFAULT_USER') {
      ({ results, paginatorInfo } = await getUserEvents(req.user.id, req.query));
      return successResponse(res, undefined, { results, paginatorInfo });

    } else if (req.user.role === 'SUPER_ADMIN') {
      ({ results, paginatorInfo } = await getAllEvents(req.query));
      return successResponse(res, undefined, { results, paginatorInfo });

    } else {
      return errorResponse(res, 'Unauthorized', StatusCodes.UNAUTHORIZED);

    }
  } catch (error) {
    console.error('Error in handleGetEvents:', error);

    return errorResponse(
      res,
      'Unexpected error occurred while fetching events',
      StatusCodes.INTERNAL_SERVER_ERROR,
      {},
    );
  }
};

export const handleGetActiveEvent = async (
  req: Request<unknown, unknown, unknown, GetActiveEventSchemaType>,
  res: Response,
) => {
  const results = await getActiveEvent(req.query);

  return successResponse(res, undefined, results);
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
  req: Request<{ id: string }, unknown, CreateVoteSchemaType>,
  res: Response,
) => {
  try {
    // Memanggil fungsi `createVote`
    const vote = await createVote(req.user.id, req.params.id, req.body);

    // Response sukses
    return successResponse(
      res,
      'Vote has been created',
      vote,
      StatusCodes.CREATED,
    );
  } catch (error) {
    console.error('Error in handleCreateVote:', error);

    // Menggunakan errorResponse untuk menangani error
    if (error instanceof Error) {
      return errorResponse(
        res,
        error.message || 'Failed to create vote',
        StatusCodes.BAD_REQUEST,
        {},
      );
    }

    return errorResponse(
      res,
      'Unexpected error occurred while creating vote',
      StatusCodes.INTERNAL_SERVER_ERROR,
      {},
    );
  }
};
