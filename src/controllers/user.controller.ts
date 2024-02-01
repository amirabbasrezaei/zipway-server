import { Context } from "../context";
import { z } from "zod";
import { signJWT } from "../utils/signJWT";
import { TRPCError } from "@trpc/server";
import Prisma from "@prisma/client";
import { sendSMSCodeController } from "./sms.controller";

type UserRouterArgsController<T = null> = T extends null
  ? {
      ctx: Context;
    }
  : {
      ctx: Context;
      input: T;
    };

/// create user

export const createUserSchema = z.object({
  phoneNumber: z.string(),
  nameAndFamily: z.string(),
  hash: z.string().optional(),
});
export type CreateUser = z.infer<typeof createUserSchema>;

type CreateUserPayload = {
  isUserCreated: boolean;
};

export async function createUserController({
  ctx,
  input,
}: UserRouterArgsController<CreateUser>): Promise<CreateUserPayload> {
  const { prisma } = ctx;
  const { phoneNumber, nameAndFamily } = input;
  const findUser = await prisma.user.findUnique({
    where: {
      phoneNumber,
    },
  });

  if (findUser?.isVerified) {
    throw new TRPCError({
      code: "BAD_REQUEST",
      message: "user already exists",
    });
  }

  const createdUser = await prisma.user.create({
    data: {
      phoneNumber,
      name: nameAndFamily,
      credit: process.env.INITIAL_CREDIT as unknown
    },
  });

  if (createdUser) {
    const generatedCode = Math.random().toString().substring(2, 8);

    const body = {
      bodyId: 125257,
      to: input.phoneNumber,
      args: [String(generatedCode), input?.hash ? String(input.hash) : ""],
    };

    const { status: tokenCodeStatus } = await sendSMSCodeController({
      body,
    });

    if (tokenCodeStatus !== "ارسال موفق بود") {
      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: "مشکل در ارسال کد تایید",
      });
    }

    const updateUser = await prisma.user.update({
      where: {
        phoneNumber: input.phoneNumber,
      },
      data: {
        loginCode: generatedCode,
      },
    });

    if (!updateUser)
      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        cause: "creating login code",
      });

    return { isUserCreated: true };
  }

  return { isUserCreated: false };
}

////

//// login user
export const SendVerifyCodeSchema = z.object({
  phoneNumber: z.string(),
  hash: z.string().optional(),
});
export type SendVerifyCode = z.infer<typeof SendVerifyCodeSchema>;

type SendVerifyCodeControllerPayload = {
  status: string;
  isNewUser: boolean;
};

export async function sendVerifyCodeController({
  ctx,
  input,
}: UserRouterArgsController<SendVerifyCode>): Promise<SendVerifyCodeControllerPayload> {
  const { prisma } = ctx;

  if (!input.phoneNumber) {
    throw new TRPCError({
      code: "BAD_REQUEST",
      message: "phonenumber is invalid",
      cause: "phonenumber is invalid",
    });
  }

  const findUser = await prisma.user.findUnique({
    where: {
      phoneNumber: input.phoneNumber,
    },
  });

  if (!findUser) {
    return { status: "ok", isNewUser: true };
  }
  const generatedCode = Math.random().toString().substring(2, 8);

  const body = {
    bodyId: 125257,
    to: input.phoneNumber,
    args: [String(generatedCode), input?.hash ? String(input.hash) : ""],
  };

  const { status: tokenCodeStatus } = await sendSMSCodeController({
    body,
  });

  console.log(tokenCodeStatus);

  if (tokenCodeStatus !== "ارسال موفق بود") {
    throw new TRPCError({
      code: "INTERNAL_SERVER_ERROR",
      message: "مشکل در ارسال کد تایید",
    });
  }

  const updateUser = await prisma.user.update({
    where: {
      phoneNumber: input.phoneNumber,
    },
    data: {
      loginCode: generatedCode,
    },
  });
  if (!updateUser)
    throw new TRPCError({
      code: "INTERNAL_SERVER_ERROR",
      cause: "creating login code",
    });

  return { status: "ok", isNewUser: false };
}
////

//// verify login code
export const VerifyLoginCodeSchema = z.object({
  code: z.string().length(6),
  phoneNumber: z.string().max(13),
});
export type VerifyLoginCode = z.infer<typeof VerifyLoginCodeSchema>;
export async function verifyLoginCodeController({
  ctx,
  input,
}: UserRouterArgsController<VerifyLoginCode>) {
  const { code, phoneNumber } = input;
  const findUser = await ctx.prisma.user.findUnique({
    where: {
      phoneNumber,
    },
  });

  if (!findUser) {
    throw new TRPCError({
      code: "BAD_REQUEST",
      message: "user doesn't found",
      cause: "you didn't signup",
    });
  }

  if (findUser?.loginCode != code) {
    throw new TRPCError({
      code: "BAD_REQUEST",
      message: "inputs are not valid",
      cause: "phonenumber or code is invalid",
    });
  }

  if (!findUser.isVerified) {
    try {
      await ctx.prisma.user.update({
        data: {
          isVerified: true,
        },
        where: {
          phoneNumber,
        },
      });
    } catch (error: any) {
      throw Error(error);
    }
  }

  return signJWT({ res: ctx.res, user: findUser }).then(
    ({ accessToken, refreshToken }) => {
      return { accessToken, refreshToken };
    }
  );
}

////

//// Logout

export const LogoutPayloadSchema = z.object({
  isUserLoggedout: z.boolean(),
});

export type LogoutController =
  | {
      isUserLoggedout: boolean;
    }
  | TRPCError;
export type LogoutPayload = z.infer<typeof LogoutPayloadSchema>;
export async function logoutController({
  ctx,
}: UserRouterArgsController): Promise<LogoutPayload> {
  const { res, req, prisma } = ctx;
  const refreshToken = req.cookies["refreshToken"];
  try {
    await prisma.session.delete({
      where: {
        id: refreshToken,
      },
    });
  } catch (error) {
    console.log(error);
  }
  res.clearCookie("accessToken");
  res.clearCookie("refreshToken");

  return { isUserLoggedout: true };
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
