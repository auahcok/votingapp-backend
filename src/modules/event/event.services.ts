import { PrismaClient, Event, UserVoteEvent } from '@prisma/client';
import { EventType } from './event.dto';

const prisma = new PrismaClient();

import { ObjectId } from 'mongodb';

export const voteForCandidate = async (userAddress: string, eventId: string, candidateId: string): Promise<UserVoteEvent> => {
  // Pastikan eventId dan candidateId dalam format ObjectId yang benar
  if (!ObjectId.isValid(eventId) || !ObjectId.isValid(candidateId)) {
    throw new Error('Invalid eventId or candidateId format');
  }

  // Konversi eventId dan candidateId menjadi ObjectId
  const convertedEventId = new ObjectId(eventId);
  const convertedCandidateId = new ObjectId(candidateId);

  // Lakukan pencarian atau operasi lainnya dengan ObjectId
  const existingVote = await prisma.userVoteEvent.findFirst({
    where: { userAddress, eventId: convertedEventId.toString(), candidateId: convertedCandidateId.toString() },
  });

  if (existingVote) {
    throw new Error('User has already voted for this candidate in this event');
  }

  return await prisma.userVoteEvent.create({
    data: {
      userAddress,
      eventId: convertedEventId.toString(),
      candidateId: convertedCandidateId.toString(),
    },
  });
};

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
  isActive?: boolean
) => {
  const skip = (page - 1) * limit;

  const where = {
    ...(searchString ? { title: { contains: searchString, mode: 'insensitive' } } : {}),
    ...(isActive !== undefined ? { isActive } : {})
  };

  const [totalRecords, events] = await Promise.all([
    prisma.event.count({ where }),
    prisma.event.findMany({
      where,
      take: limit,
      skip,
      include: {
        candidates: isActive === true 
      },
      orderBy: { createdAt: 'desc' },
    }),
  ]);

  return { results: events, totalRecords };
};

// Optional: Helper function untuk menutup koneksi Prisma saat aplikasi shutdown
export const disconnectPrisma = async () => {
  await prisma.$disconnect();
};
