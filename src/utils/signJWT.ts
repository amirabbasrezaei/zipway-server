import { Response } from "express";
import jwt, { Secret } from "jsonwebtoken";
import { User, Session } from "@prisma/client";
import { prisma } from "../context";
// import { Session } from "prisma/prisma-client";

export type AccessTokenPayload = {
  userId: string;
  role: string;
  phoneNumber: string;
};

export interface RefreshTokenPayload {
  sessionId: string;
  userId: string;
}

type SetToken = {
  res: Response;
  user: User;
};

interface SignJWTPayload {
  accessTokenPayload: AccessTokenPayload | null;
  refreshTokenPayload: RefreshTokenPayload | null;
  accessToken: string | null;
  refreshToken: string | null;
}

interface SetAccessTokenOutput {
  accessToken: string;
  accessTokenPayload: AccessTokenPayload;
}

interface SetRefreshTokenOutput {
  refreshToken: string;
  refreshTokenPayload: RefreshTokenPayload;
}

async function createSession(userId: string): Promise<Session> {
  const createdSession = await prisma.session.create({
    data: {
      userId,
    },
  });

  return createdSession;
}

function setAccessToken(res: Response, user: User): SetAccessTokenOutput {
  const accessTokenPayload: AccessTokenPayload = {
    phoneNumber: user.phoneNumber as string,
    role: user.role,
    userId: user.id,
  };
  const accessToken = jwt.sign(
    accessTokenPayload,
    process.env.JWT_PRIVATE_KEY as Secret,
    {
      expiresIn: Date.now() + 300000,
    }
  );
   res.cookie("accessToken", accessToken, {
    expires: new Date(Date.now() + 300000),
    httpOnly: true,
  });

  return { accessToken, accessTokenPayload };
}

async function setRefreshToken(
  res: Response,
  user: User
): Promise<SetRefreshTokenOutput> {
  
  const session = await createSession(user.id);

  const refreshTokenPayload: RefreshTokenPayload = {
    sessionId: session.id,
    userId: session.userId,
  };
  const refreshToken = await jwt.sign(
    refreshTokenPayload,
    process.env.JWT_PRIVATE_KEY as Secret,
    {
      expiresIn: Date.now() + 7889400000,
    }
  );
  await res.cookie("refreshToken", refreshToken, {
    expires: new Date(Date.now() + 7889400000),
    httpOnly: true,
  });

  return { refreshToken, refreshTokenPayload };
}

export async function signJWT({ res, user }: SetToken): Promise<SignJWTPayload> {

  const { accessToken, accessTokenPayload } = setAccessToken(res, user);
  return setRefreshToken(res, user)
    .then(({ refreshToken, refreshTokenPayload }) => {

      return {
        accessToken,
        accessTokenPayload,
        refreshToken,
        refreshTokenPayload,
      };
    }).catch((err) => {
      console.log(err)
      return {
        accessToken,
        accessTokenPayload,
        refreshToken: null,
        refreshTokenPayload: null,
      }
    })
    
}
