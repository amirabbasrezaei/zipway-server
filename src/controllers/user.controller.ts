import { Context } from "../context";
import { z } from "zod";
import { signJWT } from "../utils/signJWT";
import { TRPCError } from "@trpc/server";
import Prisma from "@prisma/client";
/// create user

export const createUserSchema = z.object({
  phoneNumber: z.string(),
  deviceId: z.string().optional(),
});
export type CreateUser = z.infer<typeof createUserSchema>;

type UserRouterArgsController<T = null> = T extends null
  ? {
      ctx: Context;
    }
  : {
      ctx: Context;
      input: T;
    };

export async function createUserController({
  ctx,
  input,
}: UserRouterArgsController<CreateUser>) {
  const { prisma, res } = ctx;

  const { phoneNumber } = input;
  const findUser = await prisma.user.findUnique({
    where: {
      phoneNumber,
    },
  });
  if (findUser) {
    throw new TRPCError({
      code: "BAD_REQUEST",
      message: "user already exists",
    });
  }
  const createdUser = await prisma.user.create({
    data: {
      phoneNumber,
    },
  });

  const {} = signJWT({ res, user: createdUser });

  return { createdUser };
}

////

//// login user
export const loginUserSchema = z.object({
  phoneNumber: z.string(),
  code: z.string().max(6),
});
export type LoginUser = z.infer<typeof loginUserSchema>;

export async function loginController({
  ctx,
  input,
}: UserRouterArgsController<LoginUser>) {
  const { prisma, res } = ctx;

  const findUser = await prisma.user.findUnique({
    where: {
      phoneNumber: input.phoneNumber,
    },
  });

  if (!findUser) {
    throw new TRPCError({
      code: "UNAUTHORIZED",
      message: "user not found",
    });
  }

  

  return signJWT({ res, user: findUser }).then(
    ({ accessToken, refreshToken }) => {
      return { accessToken, refreshToken };
    }
  );
}
////

//// users list

export async function users({
  ctx,
}: UserRouterArgsController): Promise<Prisma.User[]> {
  const { prisma } = ctx;
  const users = await prisma.user.findMany();
  return users;
}
