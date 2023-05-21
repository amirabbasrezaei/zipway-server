// import type { inferAsyncReturnType } from "@trpc/server";
import * as trpcExpress from "@trpc/server/adapters/express";
import { Request, Response } from "express";
import { Prisma, PrismaClient } from "prisma/prisma-client";

export const prisma = new PrismaClient();
export type Context<T = null> = {
  prisma: PrismaClient<
    Prisma.PrismaClientOptions,
    never,
    Prisma.RejectOnNotFound | Prisma.RejectPerOperation | undefined
  >;
  req: Request;
  res: Response;
  user: T;
};

export async function createContext({
  req,
  res,
}: trpcExpress.CreateExpressContextOptions): Promise<Context> {
  return {
    prisma,
    req,
    res,
    user: null,
  };
}

// export type Context = inferAsyncReturnType<typeof createContext>;
