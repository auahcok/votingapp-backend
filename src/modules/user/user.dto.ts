import z from 'zod';
import { definePaginatedResponse } from '../../common/common.utils';
import {
  ROLE_ENUM,
  RoleType,
  // SOCIAL_ACCOUNT_ENUM,
  // SocialAccountType,
} from '../../enums';

// export const SocialAccountTypeZ = z.enum(
//   Object.keys(SOCIAL_ACCOUNT_ENUM) as [SocialAccountType],
// );

export const RoleTypeZ = z.enum(Object.keys(ROLE_ENUM) as [RoleType]);

// export const socialAccountInfoSchema = z.object({
//   accountType: SocialAccountTypeZ,
//   accessToken: z.string(),
//   tokenExpiry: z.date(),
//   refreshToken: z.string().optional(),
//   accountID: z.string(),
// });

export const userOutSchema = z.object({
  id: z.string(),
  name: z.string(),
  email: z.string().email(),
  password: z.string().nullable().optional(),
  avatar: z.string().nullable().optional(),
  metamaskAddress: z.string().nullable().optional(),
  nonce: z.string().nullable().optional(),
  passwordResetCode: z.string().nullable().optional(),
  role: RoleTypeZ,
  googleId: z.string().nullable().optional(),
  googleToken: z.string().nullable().optional(),
  tokenExpiry: z.date().nullable().optional(),
  createdAt: z.date().optional(),
  updatedAt: z.date().optional(),
});

export const userSchema = userOutSchema;
export const usersPaginatedSchema = definePaginatedResponse(userOutSchema);

export type UserModelType = z.infer<typeof userSchema>;
export type UserType = z.infer<typeof userSchema>;
export type UserPaginatedType = z.infer<typeof usersPaginatedSchema>;
// export type SocialAccountInfoType = z.infer<typeof socialAccountInfoSchema>;
