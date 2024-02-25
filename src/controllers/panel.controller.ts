import { TRPCError } from "@trpc/server";
import { RouterArgsController } from "./type";
import { z } from "zod";
import {UserModel} from "../../prisma/zod/user.ts"



export const getUsersControllerArgsTypeSchema = z.object({
  orderBy: z.enum(UserModel.keyof()._def.values),
  type: z.enum(["asc", "desc"])
});

type getUserArgsType = z.infer<typeof getUsersControllerArgsTypeSchema>;

export async function getUsersController({
  ctx,input
}: RouterArgsController<getUserArgsType>) {
  const { prisma , user} = ctx;
  if(user.role !== "SUPERUSER"){
       throw new TRPCError({code: "UNAUTHORIZED"})
  }

  console.log(UserModel.keyof()._def.values)
  const orderBy = {
    [input.orderBy]:input.type
  }

  return await prisma.user.findMany({ orderBy});

  
}