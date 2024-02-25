// @ts-nocheck
import * as z from "zod"
import * as imports from "../null"
import { Decimal } from "decimal.js"
import { CompleteRide, RelatedRideModel } from "./index"

// Helper schema for Decimal fields
z
  .instanceof(Decimal)
  .or(z.string())
  .or(z.number())
  .refine((value) => {
    try {
      return new Decimal(value)
    } catch (error) {
      return false
    }
  })
  .transform((value) => new Decimal(value))

export const DestinationCoordinateModel = z.object({
  rideId: z.string(),
  latitude: z.number(),
  longitude: z.number(),
})

export interface CompleteDestinationCoordinate extends z.infer<typeof DestinationCoordinateModel> {
  ride: CompleteRide
}

/**
 * RelatedDestinationCoordinateModel contains all relations on your model in addition to the scalars
 *
 * NOTE: Lazy required in case of potential circular dependencies within schema
 */
export const RelatedDestinationCoordinateModel: z.ZodSchema<CompleteDestinationCoordinate> = z.lazy(() => DestinationCoordinateModel.extend({
  ride: RelatedRideModel,
}))
