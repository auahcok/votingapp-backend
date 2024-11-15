// import { canAccess } from '../../middlewares/can-access.middleware';
import MagicRouter from '../../openapi/magic-router';
import {
  handleCreateEvent,
  handleGetEventById,
  handleUpdateEvent,
  handleDeleteEvent,
  handleGetEvents,
} from './event.controller';
import { createEventSchema, getEventsSchema } from './event.schema';
import { eventSchema } from './event.dto';

export const EVENT_ROUTER_ROOT = '/events';

const eventRouter = new MagicRouter(EVENT_ROUTER_ROOT);

// Rute untuk mendapatkan daftar event
eventRouter.get(
  '/',
  {
    requestType: { query: getEventsSchema },
    responseModel: eventSchema,
  },
  handleGetEvents,
);

// Rute untuk membuat event baru
eventRouter.post(
  '/',
  { requestType: { body: createEventSchema } },
  // canAccess('roles', ['SUPER_ADMIN']),
  handleCreateEvent,
);

// Rute untuk mendapatkan event berdasarkan ID
eventRouter.get('/:id', {}, handleGetEventById);

// Rute untuk memperbarui event berdasarkan ID
eventRouter.put('/:id', {}, handleUpdateEvent);

// Rute untuk menghapus event berdasarkan ID
eventRouter.delete('/:id', {}, handleDeleteEvent);

export default eventRouter.getRouter();
