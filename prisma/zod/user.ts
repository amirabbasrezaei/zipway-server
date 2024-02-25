import * as z from "zod"
import { role } from "@prisma/client"

export const UserModel = z.object({
  id: z.string(),
  name: z.string(),
  familyName: z.string().nullish(),
  password: z.string().nullish(),
  email: z.string().nullish(),
  phoneNumber: z.string(),
  role: z.nativeEnum(role),
  loginCode: z.string().nullish(),
  isVerified: z.boolean(),
  credit: z.number().int(),
  createdAt: z.date(),
  lastLogin: z.date().nullish(),
  numberOfLogins: z.number().int().nullish(),
})


