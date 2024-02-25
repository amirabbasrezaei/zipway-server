import * as z from "zod"
import * as imports from "../null"
import { CompleteRider, RelatedRiderModel, CompleteRide, RelatedRideModel } from "./index"

export const SnappRideModel = z.object({
  id: z.string(),
  snappRideId: z.string().nullish(),
  serviceType: z.string(),
  price: z.number().int(),
  rideId: z.string(),
  isChosen: z.boolean().nullish(),
})

export interface CompleteSnappRide extends z.infer<typeof SnappRideModel> {
  Rider: CompleteRider[]
  Ride?: CompleteRide | null
}

/**
 * RelatedSnappRideModel contains all relations on your model in addition to the scalars
 *
 * NOTE: Lazy required in case of potential circular dependencies within schema
 */
export const RelatedSnappRideModel: z.ZodSchema<CompleteSnappRide> = z.lazy(() => SnappRideModel.extend({
  Rider: RelatedRiderModel.array(),
  Ride: RelatedRideModel.nullish(),
}))
