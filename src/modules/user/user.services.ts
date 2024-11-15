import { hashPassword } from '../../utils/auth.utils';
import { getPaginator } from '../../utils/getPaginator';
import { UserType } from './user.dto';
import { GetUsersSchemaType } from './user.schema';
import { MongoIdSchemaType } from '../../common/common.schema';
import { Prisma, PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const updateUser = async (
  userId: string,
  payload: Partial<UserType>,
): Promise<UserType> => {
  const user = (await prisma.user.update({
    where: { id: userId },
    data: { ...payload },
  })) as UserType;

  if (!user) throw new Error('User not found');

  return user;
};

export const getUserById = async (
  userId: string,
  selectPassword = false,
): Promise<UserType> => {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      avatar: true,
      metamaskAddress: true,
      nonce: true,
      googleId: true,
      googleToken: true,
      tokenExpiry: true,
      password: selectPassword,
      passwordResetCode: true,
      createdAt: true,
      updatedAt: true,
    },
    // select: select ? { [select]: true } : undefined,
  });

  // if (!user) {
  //   throw new Error('User not found');
  // }

  return user as UserType;
};

export const getUserByEmail = async (
  email: string,
  selectPassword = false,
): Promise<UserType | null> => {
  const user = await prisma.user.findUnique({
    where: { email },
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      avatar: true,
      metamaskAddress: true,
      nonce: true,
      googleId: true,
      googleToken: true,
      tokenExpiry: true,
      password: selectPassword,
      passwordResetCode: true,
      createdAt: true,
      updatedAt: true,
    },
  });

  return user as UserType;
};

export const deleteUser = async (userId: MongoIdSchemaType) => {
  const user = await prisma.user.delete({
    where: { id: userId.id },
  });

  if (!user) {
    throw new Error('User not found');
  }
};

// user.services.ts
export const getUsers = async (
  userId: MongoIdSchemaType,
  payload: GetUsersSchemaType,
) => {
  const { id } = userId;

  console.log(id, userId);

  const currentUser = await prisma.user.findUnique({ where: { id } });
  if (!currentUser) {
    throw new Error('User must be logged in');
  }

  const conditions: Prisma.UserWhereInput = {};

  if (payload.searchString) {
    conditions.OR = [
      { name: { contains: payload.searchString, mode: 'insensitive' } },
      { email: { contains: payload.searchString, mode: 'insensitive' } },
    ];
  }

  if (payload.filterByRole) {
    conditions.role = payload.filterByRole;
  } else {
    conditions.role = { in: ['DEFAULT_USER'] };
  }

  const totalRecords = await prisma.user.count({ where: conditions });
  const paginatorInfo = getPaginator(
    payload.limitParam,
    payload.pageParam,
    totalRecords,
  );

  const results = await prisma.user.findMany({
    where: conditions,
    take: paginatorInfo.limit,
    skip: paginatorInfo.skip,
  });

  return {
    results: results || [],
    paginatorInfo: paginatorInfo || {},
  };
};

export const createUser = async (
  payload: Partial<UserType> & { password: string },
  checkExist: boolean = true,
): Promise<UserType> => {
  try {
    // Check if user exists
    if (checkExist) {
      const isUserExist = await prisma.user.findFirst({
        where: {
          OR: [
            { email: payload.email },
            { metamaskAddress: payload.metamaskAddress },
          ].filter(Boolean),
        },
      });

      if (isUserExist) {
        throw new Error(
          'User already exists with this email or metamask address',
        );
      }
    }

    // Validate required fields
    if (!payload.email) {
      throw new Error('Email is required');
    }

    if (!payload.password) {
      throw new Error('Password is required');
    }

    if (!payload.role) {
      throw new Error('Role is required');
    }

    // Hash password
    const hashedPassword = await hashPassword(payload.password);

    // Create user with sanitized data
    const createdUser = await prisma.user.create({
      data: {
        email: payload.email,
        password: hashedPassword,
        name: payload.name || payload.email.split('@')[0],
        avatar: payload.avatar,
        metamaskAddress: payload.metamaskAddress,
        nonce: payload.nonce,
        role: payload.role,
        googleId: payload.googleId,
        googleToken: payload.googleToken,
        tokenExpiry: payload.tokenExpiry,
        passwordResetCode: payload.passwordResetCode,
      },
    });

    // Return user without sensitive data
    const { password, ...userWithoutPassword } = createdUser;
    return userWithoutPassword as UserType;
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(`Failed to create user: ${error.message}`);
    }
    throw new Error('Failed to create user');
  }
};
