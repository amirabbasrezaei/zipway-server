// @ts-nocheck
import * as z from "zod"
import * as imports from "../null"
import { CompleteRider, RelatedRiderModel, CompleteRide, RelatedRideModel } from "./index"

export const TapsiRideModel = z.object({
  id: z.string(),
  tapsiRideId: z.string().nullish(),
  serviceType: z.string(),
  categoryType: z.string(),
  token: z.string(),
  price: z.number().int(),
  rideId: z.string(),
  isChosen: z.boolean().nullish(),
})

export interface CompleteTapsiRide extends z.infer<typeof TapsiRideModel> {
  Rider: CompleteRider[]
  Ride: CompleteRide
}

/**
 * RelatedTapsiRideModel contains all relations on your model in addition to the scalars
 *
 * NOTE: Lazy required in case of potential circular dependencies within schema
 */
export const RelatedTapsiRideModel: z.ZodSchema<CompleteTapsiRide> = z.lazy(() => TapsiRideModel.extend({
  Rider: RelatedRiderModel.array(),
  Ride: RelatedRideModel,
}))
