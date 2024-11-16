import { PrismaClient, Event, Prisma, UserVoteEvent } from '@prisma/client';
import { EventType, VoteType } from './event.dto';
import { getPaginator } from '../../utils/getPaginator';
import { GetActiveEventSchemaType, GetEventsSchemaType } from './event.schema';

const prisma = new PrismaClient();

// GET EVENTS with pagination and search functionality
export const getAllEvents = async (payload: GetEventsSchemaType) => {
  // Kondisi untuk filter
  const conditions: Prisma.EventWhereInput = {
    ...(payload.keyword
      ? { title: { contains: payload.keyword, mode: 'insensitive' } }
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

// GET EVENTS with pagination and search functionality
export const getUserEvents = async (
  userId: string,
  payload: GetEventsSchemaType,
) => {
  // Kondisi untuk filter
  const conditions: Prisma.EventWhereInput = {
    ...(payload.keyword
      ? { title: { contains: payload.keyword, mode: 'insensitive' } }
      : {}),
    votes: {
      some: {
        userId: userId,
      },
    },
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

// GET 1 ACTIVE EVENT
export const getActiveEvent = async (
  payload: GetActiveEventSchemaType,
): Promise<Event> => {
  const conditions: Prisma.EventWhereInput = {
    isActive: true,
    ...(payload.keyword
      ? { title: { contains: payload.keyword, mode: 'insensitive' } }
      : {}),
  };

  const event = await prisma.event.findFirst({
    where: conditions,
    include: { candidates: true, votes: true },
  });

  if (!event) {
    throw new Error('Active event not found');
  }
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

  // Update existing active event to inactive if isActive is true
  if (payload.isActive) {
    await prisma.event.updateMany({
      where: { isActive: true },
      data: { isActive: false },
    });
  }

  const event = await prisma.event.create({
    data: {
      title: payload.title,
      description: payload.description,
      isActive: Boolean(payload.isActive),
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
    include: { candidates: true },
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

  // Update existing active event to inactive if isActive is true
  if (payload.isActive) {
    await prisma.event.updateMany({
      where: { isActive: true },
      data: { isActive: false },
    });
  }

  // Perbarui data event
  const updatedEvent = await prisma.event.update({
    where: {
      id: eventId,
    },
    data: {
      title: payload.title,
      description: payload.description,
      isActive: Boolean(payload.isActive),
      startDate: payload.startDate,
      endDate: payload.endDate,
    },
  });

  // Handle candidate updates
  if (payload.candidates) {
    const existingCandidateIds = existingEvent.candidates.map((c) => c.id);
    const incomingCandidateIds = payload.candidates
      .map((c) => c.id)
      .filter((id): id is string => Boolean(id));

    // Delete candidates that are not in the incoming payload
    await prisma.candidate.deleteMany({
      where: {
        eventId,
        id: { notIn: incomingCandidateIds },
      },
    });

    // Process candidates
    await Promise.all(
      payload.candidates.map(async (candidate) => {
        if (candidate.id && existingCandidateIds.includes(candidate.id)) {
          // Update existing candidate
          await prisma.candidate.update({
            where: { id: candidate.id },
            data: {
              ...candidate,
            },
          });
        } else {
          // Create new candidate
          await prisma.candidate.create({
            data: {
              ...candidate,
              eventId,
            },
          });
        }
      }),
    );
  }

  return updatedEvent;
};

// CREATE VOTE with validation
export const createVote = async (
  userId: string,
  eventId: string,
  payload: VoteType,
): Promise<UserVoteEvent> => {
  // Periksa apakah payload valid
  if (!eventId || !userId || !payload.candidateId) {
    throw new Error(
      'Missing required fields for voting: eventId, userId, and candidateId',
    );
  }

  // Periksa apakah event dengan ID tersebut ada
  const existingEvent = await prisma.event.findUnique({
    where: {
      id: eventId,
    },
  });

  if (!existingEvent) throw new Error('Event not found');

  // Periksa apakah user dengan ID tersebut ada
  const existingUser = await prisma.user.findUnique({
    where: {
      id: userId,
    },
  });

  if (!existingUser) throw new Error('User not found');

  // Periksa apakah candidate dengan ID tersebut ada
  const existingCandidate = await prisma.candidate.findUnique({
    where: {
      id: payload.candidateId,
    },
  });

  if (!existingCandidate) throw new Error('Candidate not found');

  const existingVote = await prisma.userVoteEvent.findFirst({
    where: {
      eventId: eventId,
      userId: userId,
    },
  });

  if (existingVote) {
    throw new Error('You have already voted for this event');
  }

  const vote = await prisma.userVoteEvent.create({
    data: {
      eventId: eventId,
      candidateId: payload.candidateId,
      userId: userId,
    },
  });

  return vote;
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
