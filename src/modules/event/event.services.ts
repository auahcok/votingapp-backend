import { PrismaClient, Event } from '@prisma/client';
import { EventType } from './event.dto';

const prisma = new PrismaClient();

export const createEvent = async (payload: EventType): Promise<Event> => {
  const event = await prisma.event.create({
    data: payload,
  });
  return event;
};

export const getEventById = async (eventId: string): Promise<Event> => {
  const event = await prisma.event.findUnique({
    where: {
      id: eventId,
    },
  });
  if (!event) throw new Error('Event not found');
  return event;
};

export const updateEvent = async (
  eventId: string,
  payload: Partial<EventType>,
): Promise<Event> => {
  const event = await prisma.event.update({
    where: {
      id: eventId,
    },
    data: payload,
  });
  return event;
};

export const deleteEvent = async (eventId: string): Promise<void> => {
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

// Optional: Helper function untuk menutup koneksi Prisma saat aplikasi shutdown
export const disconnectPrisma = async () => {
  await prisma.$disconnect();
};
