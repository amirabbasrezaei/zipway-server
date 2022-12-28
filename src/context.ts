import type { inferAsyncReturnType } from "@trpc/server";
import * as trpcExpress from "@trpc/server/adapters/express";
import { PrismaClient } from "prisma/prisma-client";


export const prisma = new PrismaClient();

export async function createContext({
  req,
  res,
}: trpcExpress.CreateExpressContextOptions) {
  return {
    prisma,
    req,
    res,
    user: null,
  };
}

export type Context = inferAsyncReturnType<typeof createContext>;
