import { Request, Response } from "express";
import { prisma } from "../context";
import jwt, { Secret } from "jsonwebtoken";
import { Session, User } from "prisma/prisma-client";
import { AccessTokenPayload, RefreshTokenPayload, signJWT } from "./signJWT";
import { TRPCError } from "@trpc/server";
import type { TRPCError as Error } from "@trpc/server";

type GetUserSession =
  | {
      session: Session;
      user: User;
    }
  | Error;

async function getUserSession(
  sessionId: string
): Promise<GetUserSession> {

  try {
    const session = await prisma.session.findUnique({
      where: {
        id: sessionId,
      },
    });

    if (session) {
      const [user] = await prisma.$transaction([
        prisma.user.findUnique({
          where: {
            id: session.userId,
          },
        }),
        prisma.user.update({
          where: { id: session.userId },
          data: {
            lastLogin: new Date(Date.now()),
            numberOfLogins: { increment: 1 },
          },
        }),
      ]);
      
      
      if (user == null) {
        throw new TRPCError({ code: "NOT_FOUND", cause: "کاربر یافت نشد" });
      }
  
      return { user, session };
    }
  } catch (error) {
    console.log("session doesn't found")
    throw new TRPCError({code: "UNAUTHORIZED", cause: "لطفا وارد حساب کاربری خود شوید"})
  }
  
  throw new TRPCError({ code: "NOT_FOUND", cause: "کاربر یافت نشد" });
}

async function checkRefreshToken(req: Request): Promise<{ user: User | null }> {
  const refreshToken = req.cookies["refreshToken"];
  if (refreshToken) {
    const verifyRefreshToken = jwt.verify(
      refreshToken,
      process.env.JWT_PRIVATE_KEY as Secret
    );

    // @ts-ignore
    return await getUserSession(verifyRefreshToken.sessionId as string)
      .then(({ user }: any) => {
        return { user };
      })
      .catch(() => {
        throw new TRPCError({
          code: "UNAUTHORIZED",
          message: "you are not authorize to request",
        });
      });
  }
  return { user: null };
}

function checkAccessToken(req: Request) {
  const accessToken = req.cookies["accessToken"];
  if (accessToken) {
    const token = jwt.verify(
      accessToken,
      process.env.JWT_PRIVATE_KEY as Secret
    );
    return token;
  }
  return null;
}

type GetUser = {
  accessToken: jwt.JwtPayload | string | null;
  refreshToken: string | null;
  accessTokenPayload: AccessTokenPayload | null;
  refreshTokenPayload: RefreshTokenPayload | null;
};

export async function getUser(
  req: Request<any, Record<string, any>>,
  res: Response
): Promise<GetUser> {
  const userWithAccessToken = checkAccessToken(req);
  if (userWithAccessToken) {
    return {
      accessToken: userWithAccessToken,
      refreshToken: null,
      accessTokenPayload: null,
      refreshTokenPayload: null,
    };
  }
  const payload: GetUser = await checkRefreshToken(req)
    .then(async ({ user }) => {
      if (!user) {
        return { accessToken: null, refreshToken: null };
      }
      const {
        accessToken,
        refreshToken,
        accessTokenPayload,
        refreshTokenPayload,
      } = await signJWT({ res, user });

      return {
        accessToken,
        refreshToken,
        accessTokenPayload,
        refreshTokenPayload,
      };
    })
    .then(
      ({
        accessToken,
        refreshToken,
        accessTokenPayload = null,
        refreshTokenPayload = null,
      }) => {
        return {
          accessToken,
          refreshToken,
          accessTokenPayload,
          refreshTokenPayload,
        };
      }
    );
  if (payload) {
    return payload;
  }

  return {
    accessToken: null,
    refreshToken: null,
    accessTokenPayload: null,
    refreshTokenPayload: null,
  };
}
