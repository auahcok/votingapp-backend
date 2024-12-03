import { PrismaClient, Event, Prisma, UserVoteEvent } from '@prisma/client';
import { EventType, VoteType } from './event.dto';
import { getPaginator } from '../../utils/getPaginator';
import { GetActiveEventSchemaType, GetEventsSchemaType } from './event.schema';
import { ethers } from 'hardhat';
import { ContractTransactionResponse } from 'ethers';
import { Voting__factory } from '../../../temp/hardhat/typechain-types';

const prisma = new PrismaClient();

// Konfigurasi Blockchain menggunakan Hardhat
const provider = new ethers.JsonRpcProvider('http://localhost:8545');
const privateKey = process.env.PRIVATE_KEY || '';
const wallet = new ethers.Wallet(privateKey, provider);

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
    orderBy: [{ isActive: 'desc' }, { createdAt: 'desc' }],
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
    orderBy: [{ isActive: 'desc' }, { createdAt: 'desc' }],
  });

  // Pastikan data response sesuai dengan validasi
  return {
    results: events || [],
    paginatorInfo: paginatorInfo || {},
  };
};

// GET 1 ACTIVE EVENT
export const getActiveEvent = async (payload: GetActiveEventSchemaType) => {
  const conditions: Prisma.EventWhereInput = {
    isActive: true,
    ...(payload.keyword
      ? { title: { contains: payload.keyword, mode: 'insensitive' } }
      : {}),
  };

  const event = await prisma.event.findFirst({
    where: conditions,
    include: {
      candidates: true,
    },
  });

  if (!event) {
    throw new Error('Active event not found');
  }

  // Paginasi untuk votes
  const voteConditions: Prisma.UserVoteEventWhereInput = { eventId: event.id };
  const totalVotes = await prisma.userVoteEvent.count({
    where: voteConditions,
  });

  const candidateVotes = await Promise.all(
    event.candidates.map(async (candidate) => {
      const votes = await prisma.userVoteEvent.count({
        where: {
          eventId: event.id,
          candidateId: candidate.id,
        },
      });
      return {
        candidateId: candidate.id,
        position: candidate.position,
        votes,
      };
    }),
  );

  const paginatorInfo = getPaginator(
    payload.limitParam || 15, // Default limit
    payload.pageParam || 1, // Default page
    totalVotes,
  );

  const votes = await prisma.userVoteEvent.findMany({
    where: voteConditions,
    include: { user: true },
    orderBy: { createdAt: 'desc' },
    take: paginatorInfo.limit,
    skip: paginatorInfo.skip,
  });

  return {
    event,
    votes,
    candidateVotes,
    paginatorInfo,
  };
};

// GET EVENT BY ID with validation
export const getEventById = async (eventId: string) => {
  if (!eventId) throw new Error('Event ID is required');

  const event = await prisma.event.findUnique({
    where: {
      id: eventId,
    },
    include: { candidates: true },
  });

  if (!event) throw new Error('Event not found');

  const totalVotes = await prisma.userVoteEvent.count({
    where: {
      eventId: eventId,
    },
  });

  const candidateVotes = await Promise.all(
    event.candidates.map(async (candidate) => {
      const votes = await prisma.userVoteEvent.count({
        where: {
          eventId: eventId,
          candidateId: candidate.id,
        },
      });
      return {
        candidateId: candidate.id,
        position: candidate.position,
        votes,
      };
    }),
  );

  return {
    event,
    totalVotes,
    candidateVotes,
  };
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
    !payload.title ||
    !payload.startDate ||
    !payload.endDate ||
    !payload.description
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
      updatedAt: new Date(),
    },
  });

  // Handle candidate updates
  if (payload.candidates) {
    const existingCandidateIds = existingEvent.candidates.map((c) => c.id);
    const incomingCandidateIds = payload.candidates
      .map((c) => c.id)
      .filter((id): id is string => Boolean(id));

    // Find candidates to delete
    const candidatesToDelete = existingCandidateIds.filter(
      (id) => !incomingCandidateIds.includes(id),
    );

    // Delete UserVotes associated with candidates to be deleted
    if (candidatesToDelete.length > 0) {
      await prisma.userVoteEvent.deleteMany({
        where: {
          candidateId: { in: candidatesToDelete },
        },
      });

      // Delete the candidates
      await prisma.candidate.deleteMany({
        where: {
          id: { in: candidatesToDelete },
        },
      });
    }

    // Process candidates
    await Promise.all(
      payload.candidates.map(async (candidate) => {
        if (candidate.id && existingCandidateIds.includes(candidate.id)) {
          // Update existing candidate
          await prisma.candidate.update({
            where: { id: candidate.id },
            data: {
              photo: candidate.photo,
              name: candidate.name,
              position: candidate.position,
              sequence: candidate.sequence,
              visi: candidate.visi,
              misi: candidate.misi,
              comment: candidate.comment,
            },
          });
        } else {
          // Create new candidate
          await prisma.candidate.create({
            data: {
              eventId,
              photo: candidate.photo,
              name: candidate.name,
              position: candidate.position,
              sequence: candidate.sequence,
              visi: candidate.visi,
              misi: candidate.misi,
              comment: candidate.comment,
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

  const votingContract = Voting__factory.connect(
    process.env.CONTRACT_ADDRESS || '', // Alamat kontrak voting
    wallet,
  );

  // Hash data vote untuk mencatat ke blockchain
  const voteHash = ethers.keccak256(
    ethers.AbiCoder.defaultAbiCoder().encode(
      ['string', 'string', 'string'],
      [userId, eventId, payload.candidateId],
    ),
  );

  try {
    // Panggil kontrak untuk mencatat vote di blockchain
    const tx: ContractTransactionResponse = await votingContract.castVote(
      userId,
      eventId,
      payload.candidateId,
    );

    // Tunggu transaksi selesai dan dapatkan receipt
    const receipt = await tx.wait();
    console.log(`Vote hash stored on blockchain: ${voteHash}`);
    console.log(`Transaction hash: ${receipt?.hash}`);

    // Simpan vote ke database setelah transaksi blockchain berhasil
    const vote = await prisma.userVoteEvent.create({
      data: {
        eventId: eventId,
        candidateId: payload.candidateId,
        userId: userId,
        transactionHash: receipt?.hash,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    });

    return vote;
  } catch (error) {
    console.error('Error during blockchain transaction:', error);
    throw new Error('Failed to record vote on blockchain');
  }
};

// DELETE EVENT with validation
export const deleteEvent = async (eventId: string): Promise<void> => {
  if (!eventId) throw new Error('Event ID is required');

  try {
    // Fetch candidates associated with the event
    const candidates = await prisma.candidate.findMany({
      where: { eventId },
      select: { id: true }, // Only fetch candidate IDs
    });

    if (candidates.length > 0) {
      const candidateIds = candidates.map((candidate) => candidate.id);

      // Delete UserVotes associated with these candidates
      await prisma.userVoteEvent.deleteMany({
        where: { candidateId: { in: candidateIds } },
      });

      // Delete the candidates themselves
      await prisma.candidate.deleteMany({
        where: { id: { in: candidateIds } },
      });
    }

    // Delete the event itself
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
