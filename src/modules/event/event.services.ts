import { PrismaClient, Event } from '@prisma/client';
import { EventType } from './event.dto';

const prisma = new PrismaClient();

// CREATE EVENT with validation
export const createEvent = async (payload: EventType): Promise<Event> => {
  if (!payload.title || !payload.date || !payload.description) {
    throw new Error('Missing required event fields: title, date, and description');
  }
  const event = await prisma.event.create({
    data: payload,
  });
  return event;
};

// GET EVENT BY ID with validation
export const getEventById = async (eventId: string): Promise<Event> => {
  if (!eventId) throw new Error('Event ID is required');

  const event = await prisma.event.findUnique({
    where: {
      id: eventId,
    },
  });
  if (!event) throw new Error('Event not found');
  return event;
};

// UPDATE EVENT with validation
export const updateEvent = async (
  eventId: string,
  payload: Partial<EventType>,
): Promise<Event> => {
  if (!eventId) throw new Error('Event ID is required');

  const eventExists = await prisma.event.findUnique({ where: { id: eventId } });
  if (!eventExists) throw new Error('Event not found');

  const event = await prisma.event.update({
    where: {
      id: eventId,
    },
    data: payload,
  });
  return event;
};

// DELETE EVENT with validation
export const deleteEvent = async (eventId: string): Promise<void> => {
  if (!eventId) throw new Error('Event ID is required');

  try {
    await prisma.event.delete({
      where: {
        id: eventId,
      },
    });
  } catch (error) {
    if (error.code === 'P2025') {
      throw new Error('Event not found');
    }
    throw error;
  }
};

// GET EVENTS with pagination and search functionality
export const getEvents = async (
  searchString?: string,
  limit: number = 10,
  page: number = 1,
) => {
  const skip = (page - 1) * limit;

  const where = searchString
    ? {
        title: {
          contains: searchString,
          mode: 'insensitive',
        },
      }
    : {};

  const [totalRecords, events] = await Promise.all([
    prisma.event.count({ where }),
    prisma.event.findMany({
      where,
      take: limit,
      skip,
      include: {
        candidates: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
    }),
  ]);

  return {
    results: events,
    totalRecords,
  };
};

// Optional: Helper function to disconnect Prisma connection on app shutdown
export const disconnectPrisma = async () => {
  await prisma.$disconnect();
};