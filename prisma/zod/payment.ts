// @ts-nocheck
import * as z from "zod"
import * as imports from "../null"
import { CompleteUser, RelatedUserModel } from "./index"

export const PaymentModel = z.object({
  id: z.number().int(),
  payment_create_date: z.date(),
  payment_success_date: z.date().nullish(),
  userId: z.string(),
  trackId: z.string().nullish(),
  status: z.number().int().nullish(),
  isPayed: z.boolean(),
  servicePaymentId: z.string().nullish(),
  paymentUrl: z.string().nullish(),
  value: z.number().int(),
  cardNumber: z.string().nullish(),
  paymentDescription: z.string().nullish(),
})

export interface CompletePayment extends z.infer<typeof PaymentModel> {
  user: CompleteUser
}

/**
 * RelatedPaymentModel contains all relations on your model in addition to the scalars
 *
 * NOTE: Lazy required in case of potential circular dependencies within schema
 */
export const RelatedPaymentModel: z.ZodSchema<CompletePayment> = z.lazy(() => PaymentModel.extend({
  user: RelatedUserModel,
}))
