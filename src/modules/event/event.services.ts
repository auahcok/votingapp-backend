import { PrismaClient, Event, Prisma, UserVoteEvent } from '@prisma/client';
import { EventType, VoteType } from './event.dto';

import { getPaginator } from '../../utils/getPaginator';
import { GetEventsSchemaType } from './event.schema';

const prisma = new PrismaClient();

// GET EVENTS with pagination and search functionality
export const getEvents = async (payload: GetEventsSchemaType) => {
  // Kondisi untuk filter
  const conditions: Prisma.EventWhereInput = {
    ...(payload.keyword
      ? { title: { contains: payload.keyword, mode: 'insensitive' } }
      : {}),
    ...(payload.isActive !== undefined
      ? { isActive: payload.isActive == 'true' ? true : false }
      : {}),
  };

  // Hitung total records
  const totalRecords = await prisma.event.count({ where: conditions });

  // Paginator
  const paginatorInfo = getPaginator(
    payload.limitParam,
    payload.pageParam,
    totalRecords,
  );

  // Ambil data events dengan semua field yang diperlukan
  const events = await prisma.event.findMany({
    where: conditions,
    take: paginatorInfo.limit,
    skip: paginatorInfo.skip,
    orderBy: { createdAt: 'desc' },
  });

  // Pastikan data response sesuai dengan validasi
  return {
    results: events || [],
    paginatorInfo: paginatorInfo || {},
  };
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

// CREATE EVENT with validation
export const createEvent = async (payload: EventType): Promise<Event> => {
  if (
    !payload.title ||
    !payload.startDate ||
    !payload.endDate ||
    !payload.description
  ) {
    throw new Error(
      'Missing required event fields: title, date, and description',
    );
  }

  if (!payload.candidates || payload.candidates.length === 0) {
    throw new Error('At least one candidate is required');
  }

  const event = await prisma.event.create({
    data: {
      title: payload.title,
      description: payload.description,
      isActive: payload.isActive ? true : false,
      startDate: payload.startDate,
      endDate: payload.endDate,
    },
  });

  await Promise.all(
    payload.candidates.map((candidate) =>
      prisma.candidate.create({
        data: {
          ...candidate,
          eventId: event.id,
        },
      }),
    ),
  );

  return event;
};

// UPDATE EVENT with validation
export const updateEvent = async (
  eventId: string,
  payload: Partial<EventType>,
): Promise<Event> => {
  if (!eventId) throw new Error('Event ID is required');

  // Periksa apakah event dengan ID tersebut ada
  const existingEvent = await prisma.event.findUnique({
    where: { id: eventId },
  });
  if (!existingEvent) throw new Error('Event not found');

  // Validasi untuk field penting
  if (
    payload.title === '' ||
    payload.startDate === undefined ||
    payload.endDate === undefined ||
    payload.description === ''
  ) {
    throw new Error(
      'Missing required fields for update: title, startDate, endDate, and description',
    );
  }

  // Perbarui data event
  const updatedEvent = await prisma.event.update({
    where: {
      id: eventId,
    },
    data: {
      title: payload.title,
      description: payload.description,
      isActive: payload.isActive,
      startDate: payload.startDate,
      endDate: payload.endDate,
    },
  });

  // Update kandidat jika ada dalam payload
  if (payload.candidates && payload.candidates.length > 0) {
    // Hapus kandidat yang ada sebelumnya
    await prisma.candidate.deleteMany({
      where: { eventId: eventId },
    });

    // Tambahkan kandidat baru
    await Promise.all(
      payload.candidates.map((candidate) =>
        prisma.candidate.create({
          data: {
            ...candidate,
            eventId: eventId,
          },
        }),
      ),
    );
  }

  return updatedEvent;
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
    if (
      error instanceof Prisma.PrismaClientKnownRequestError &&
      error.code === 'P2025'
    ) {
      throw new Error('Event not found or has already been deleted');
    }
    if (error instanceof Error) {
      throw new Error(`Failed to delete event: ${error.message}`);
    }
    throw error;
  }
};

export const createVote = async (
  eventId: string,
  payload: VoteType,
): Promise<UserVoteEvent> => {
  if (!eventId) throw new Error('Event ID is required');
  
    const existingVote = await prisma.userVoteEvent.findFirst({
      where: {
        eventId: eventId,
        userId: payload.userId,
      },
    });

    if (existingVote) {
      throw new Error('You have already voted for this event');
    }

    const vote = await prisma.userVoteEvent.create({
      data: {
        eventId: eventId,
        candidateId: payload.candidateId,
        userId: payload.userId,
      },
    });

    return vote;
  }
