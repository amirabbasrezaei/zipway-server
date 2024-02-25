// @ts-nocheck
import * as z from "zod"
import * as imports from "../null"
import { CompleteRider, RelatedRiderModel, CompleteRide, RelatedRideModel } from "./index"

export const MaximRideModel = z.object({
  id: z.string(),
  maximRideId: z.string().nullish(),
  serviceType: z.string(),
  price: z.number().int(),
  rideId: z.string(),
  isChosen: z.boolean().nullish(),
})

export interface CompleteMaximRide extends z.infer<typeof MaximRideModel> {
  Rider: CompleteRider[]
  Ride?: CompleteRide | null
}

/**
 * RelatedMaximRideModel contains all relations on your model in addition to the scalars
 *
 * NOTE: Lazy required in case of potential circular dependencies within schema
 */
export const RelatedMaximRideModel: z.ZodSchema<CompleteMaximRide> = z.lazy(() => MaximRideModel.extend({
  Rider: RelatedRiderModel.array(),
  Ride: RelatedRideModel.nullish(),
}))
