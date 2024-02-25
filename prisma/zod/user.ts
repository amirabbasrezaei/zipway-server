import * as z from "zod"
import { role } from "@prisma/client"
import { CompletePayment, RelatedPaymentModel, CompleteSession, RelatedSessionModel, CompleteRide, RelatedRideModel } from "./index"

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

export interface CompleteUser extends z.infer<typeof UserModel> {
  Payment: CompletePayment[]
  Session: CompleteSession[]
  Ride: CompleteRide[]
}

/**
 * RelatedUserModel contains all relations on your model in addition to the scalars
 *
 * NOTE: Lazy required in case of potential circular dependencies within schema
 */
export const RelatedUserModel: z.ZodSchema<CompleteUser> = z.lazy(() => UserModel.extend({
  Payment: RelatedPaymentModel.array(),
  Session: RelatedSessionModel.array(),
  Ride: RelatedRideModel.array(),
}))
