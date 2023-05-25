// import type { inferAsyncReturnType } from "@trpc/server";
// import { inferAsyncReturnType } from "@trpc/server";
import { inferAsyncReturnType } from "@trpc/server";
import * as trpcExpress from "@trpc/server/adapters/express";
import { Request, Response } from "express";

import { Prisma, PrismaClient } from "prisma/prisma-client";

export const prisma = new PrismaClient();

export type createContextPayload = {
  prisma: PrismaClient<
    Prisma.PrismaClientOptions,
    never,
    Prisma.RejectOnNotFound | Prisma.RejectPerOperation | undefined
  >;
  req: Request<any, any, any, any, Record<string, any>>;
  res: Response<any, Record<string, any>>;
  user?: null | any;
};

export async function createContext({
  req,
  res,
}: trpcExpress.CreateExpressContextOptions): Promise<createContextPayload> {
  return {
    prisma,
    req,
    res,
  };
}

export type Context = inferAsyncReturnType<typeof createContext>;
