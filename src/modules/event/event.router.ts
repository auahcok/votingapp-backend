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
} from './event.controller';
import {
  createEventSchema,
  getEventsSchema,
  createVoteSchema,
  getActiveEventSchema,
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
  handleGetEvents,
);

eventRouter.get(
  '/active',
  {
    requestType: { query: getActiveEventSchema },
  },
  handleGetActiveEvent,
);

// Rute untuk membuat event baru
eventRouter.post(
  '/',
  { requestType: { body: createEventSchema } },
  //   canAccess('roles', ['SUPER_ADMIN']),
  handleCreateEvent,
);

// Rute untuk mendapatkan event berdasarkan ID
eventRouter.get('/:id', {}, handleGetEventById);

// Rute untuk memperbarui event berdasarkan ID
eventRouter.put('/:id', {}, handleUpdateEvent);

// Rute untuk menghapus event berdasarkan ID
eventRouter.delete('/:id', {}, handleDeleteEvent);

// Rute untuk melakukan voting
eventRouter.post(
  '/:id/vote',
  {
    requestType: { body: createVoteSchema },
  },
  canAccess('roles', ['DEFAULT_USER']),
  handleCreateVote,
);

export default eventRouter.getRouter();
