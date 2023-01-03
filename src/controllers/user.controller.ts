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
});
export type CreateUser = z.infer<typeof createUserSchema>;

type CreateUserPayload = {
  accessToken: string | null;
  refreshToken: string | null;
};

export async function createUserController({
  ctx,
  input,
}: UserRouterArgsController<CreateUser>): Promise<CreateUserPayload> {
  const { prisma, res } = ctx;
  const { phoneNumber, nameAndFamily } = input;
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
      name: nameAndFamily,
    },
  });

  const { accessToken, refreshToken } = await signJWT({
    res,
    user: createdUser,
  });

  return { accessToken, refreshToken };
}

////

//// login user
export const SendVerifyCodeSchema = z.object({
  phoneNumber: z.string(),
  hash: z.string(),
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

  const text = `Code: ${generatedCode} 
  کد ورود شما به زیپ وی
 
 ${input.hash}`;
  const body = {
    from: "50004001338886",
    to: input.phoneNumber,
    text,
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
  if (findUser?.loginCode != code) {
    throw new TRPCError({
      code: "BAD_REQUEST",
      message: "inputs are not valid",
      cause: "phonenumber or code is invalid",
    });
  }

  return signJWT({ res: ctx.res, user: findUser }).then(
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