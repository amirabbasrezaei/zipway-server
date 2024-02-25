import { TRPCError } from "@trpc/server";
import { RouterArgsController } from "./type";
import { z } from "zod";


export const UserModel = z.object({
  id: z.string(),
  name: z.string(),
  familyName: z.string().nullish(),
  password: z.string().nullish(),
  email: z.string().nullish(),
  phoneNumber: z.string(),
  role: z.enum(["USER", "SUPERADMIN"]),
  loginCode: z.string().nullish(),
  isVerified: z.boolean(),
  credit: z.number().int(),
  createdAt: z.date(),
  lastLogin: z.date().nullish(),
  numberOfLogins: z.number().int().nullish(),
})

export const getUsersControllerArgsTypeSchema = z.object({
  orderBy: z.enum(UserModel.keyof()._def.values),
  type: z.enum(["asc", "desc"])
});

type getUserArgsType = z.infer<typeof getUsersControllerArgsTypeSchema>;

export async function getUsersController({
  ctx,input
}: RouterArgsController<getUserArgsType>) {
  const { prisma , user} = ctx;
  if(user.role !== "SUPERADMIN"){
       throw new TRPCError({code: "UNAUTHORIZED"})
  }

  console.log(UserModel.keyof()._def.values)
  const orderBy = {
    [input.orderBy]:input.type
  }

  return await prisma.user.findMany({ orderBy});

  
}
