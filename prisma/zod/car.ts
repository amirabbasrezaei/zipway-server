import * as z from "zod"
import * as imports from "../null"
import { CompleteRider, RelatedRiderModel } from "./index"

export const CarModel = z.object({
  id: z.string(),
  platePartA: z.number().int(),
  platePartB: z.number().int(),
  plateCcharacter: z.string(),
  plateProvinceCode: z.number().int(),
  plateImageUrl: z.string().nullish(),
  color: z.string(),
  model: z.string(),
  riderId: z.string(),
})

export interface CompleteCar extends z.infer<typeof CarModel> {
  Rider: CompleteRider
}

/**
 * RelatedCarModel contains all relations on your model in addition to the scalars
 *
 * NOTE: Lazy required in case of potential circular dependencies within schema
 */
export const RelatedCarModel: z.ZodSchema<CompleteCar> = z.lazy(() => CarModel.extend({
  Rider: RelatedRiderModel,
}))
