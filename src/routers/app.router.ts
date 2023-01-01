import {
  coordinateToAddressController,
  coordinateToAddressSchema,
  placeBaseSearchController,
  placeBaseSearchSchema,
  zipwayConfigController,
} from "../controllers/app.controller";
import { router, userProtectedProcedure } from "../trpc";

export const zipwayAppRouter = router({
  zipwayConfig: userProtectedProcedure.query(zipwayConfigController),
  coordinateToAddress: userProtectedProcedure
    .input(coordinateToAddressSchema)
    .mutation(coordinateToAddressController),
  placeBaseSearch: userProtectedProcedure
    .input(placeBaseSearchSchema)
    .mutation(placeBaseSearchController),
});
