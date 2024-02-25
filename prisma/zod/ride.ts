import * as z from "zod"
import * as imports from "../null"
import { RideServiceProvider, RideStatus } from "@prisma/client"
import { CompleteDestinationCoordinate, RelatedDestinationCoordinateModel, CompleteUser, RelatedUserModel, CompleteSnappRide, RelatedSnappRideModel, CompleteTapsiRide, RelatedTapsiRideModel, CompleteMaximRide, RelatedMaximRideModel } from "./index"

export const RideModel = z.object({
  id: z.string(),
  originCoordinate: z.number().array(),
  finalPrice: z.number().int().nullish(),
  createdDate: z.date(),
  finishDate: z.date().nullish(),
  originDescription: z.string(),
  destinationDescription: z.string(),
  numberOfPassengers: z.number().int().nullish(),
  chosenServiceProvider: z.nativeEnum(RideServiceProvider).nullish(),
  Status: z.nativeEnum(RideStatus).nullish(),
  commission: z.number().int().nullish(),
})

export interface CompleteRide extends z.infer<typeof RideModel> {
  destinationCoordiante: CompleteDestinationCoordinate[]
  passenger: CompleteUser[]
  snappPrices: CompleteSnappRide[]
  tapsiPrices: CompleteTapsiRide[]
  maximPrices: CompleteMaximRide[]
}

/**
 * RelatedRideModel contains all relations on your model in addition to the scalars
 *
 * NOTE: Lazy required in case of potential circular dependencies within schema
 */
export const RelatedRideModel: z.ZodSchema<CompleteRide> = z.lazy(() => RideModel.extend({
  destinationCoordiante: RelatedDestinationCoordinateModel.array(),
  passenger: RelatedUserModel.array(),
  snappPrices: RelatedSnappRideModel.array(),
  tapsiPrices: RelatedTapsiRideModel.array(),
  maximPrices: RelatedMaximRideModel.array(),
}))
