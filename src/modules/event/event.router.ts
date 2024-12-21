import { idSchema } from '../../common/common.schema';
import { canAccess } from '../../middlewares/can-access.middleware';
import MagicRouter from '../../openapi/magic-router';
import {
  handleCreateEvent,
  handleGetEventById,
  handleUpdateEvent,
  handleDeleteEvent,
  handleGetEvents,
  handleCreateVote,
  handleGetActiveEvent,
  handleCheckVoteIsValid,
} from './event.controller';
import {
  createEventSchema,
  getEventsSchema,
  createVoteSchema,
  getActiveEventSchema,
  getVoteIsValidSchema,
} from './event.schema';
// import { eventSchema } from './event.dto';

export const EVENT_ROUTER_ROOT = '/events';

const eventRouter = new MagicRouter(EVENT_ROUTER_ROOT);

// Rute untuk mendapatkan daftar event
eventRouter.get(
  '/',
  {
    requestType: { query: getEventsSchema },
  },
  canAccess(),
  handleGetEvents,
);

eventRouter.get(
  '/active',
  {
    requestType: { query: getActiveEventSchema },
  },
  handleGetActiveEvent,
);

eventRouter.get(
  '/check-vote',
  {
    requestType: { query: getVoteIsValidSchema },
  },
  canAccess(),
  handleCheckVoteIsValid,
);

// Rute untuk membuat event baru
eventRouter.post(
  '/',
  { requestType: { body: createEventSchema } },
  //   canAccess('roles', ['SUPER_ADMIN']),
  handleCreateEvent,
);

// Rute untuk mendapatkan event berdasarkan ID
eventRouter.get(
  '/:id',
  { requestType: { params: idSchema } },
  handleGetEventById,
);

// Rute untuk memperbarui event berdasarkan ID
eventRouter.put(
  '/:id',
  { requestType: { params: idSchema, body: createEventSchema } },
  handleUpdateEvent,
);

// Rute untuk menghapus event berdasarkan ID
eventRouter.delete(
  '/:id',
  { requestType: { params: idSchema } },
  handleDeleteEvent,
);

// Rute untuk melakukan voting
eventRouter.post(
  '/:id/vote',
  {
    requestType: { params: idSchema, body: createVoteSchema },
  },
  canAccess('roles', ['DEFAULT_USER']),
  handleCreateVote,
);

// Route for set Finish event

export default eventRouter.getRouter();
