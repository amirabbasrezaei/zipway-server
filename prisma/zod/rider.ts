// @ts-nocheck
import * as z from "zod"
import * as imports from "../null"
import { CompleteCar, RelatedCarModel, CompleteSnappRide, RelatedSnappRideModel, CompleteMaximRide, RelatedMaximRideModel, CompleteTapsiRide, RelatedTapsiRideModel } from "./index"

export const RiderModel = z.object({
  id: z.string(),
  name: z.string(),
  imageUrl: z.string().nullish(),
  phoneNumber: z.string(),
  snappRideId: z.string().nullish(),
  maximRideId: z.string().nullish(),
  tapsiRideId: z.string().nullish(),
})

export interface CompleteRider extends z.infer<typeof RiderModel> {
  Car?: CompleteCar | null
  SnappRide?: CompleteSnappRide | null
  MaximRide?: CompleteMaximRide | null
  TapsiRide?: CompleteTapsiRide | null
}

/**
 * RelatedRiderModel contains all relations on your model in addition to the scalars
 *
 * NOTE: Lazy required in case of potential circular dependencies within schema
 */
export const RelatedRiderModel: z.ZodSchema<CompleteRider> = z.lazy(() => RiderModel.extend({
  Car: RelatedCarModel.nullish(),
  SnappRide: RelatedSnappRideModel.nullish(),
  MaximRide: RelatedMaximRideModel.nullish(),
  TapsiRide: RelatedTapsiRideModel.nullish(),
}))
