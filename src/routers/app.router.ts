import {
  ZipwayConfigPayloadSchema,
  appLogsController,
  appLogsControllerSchema,
  coordinateToAddressController,
  coordinateToAddressSchema,
  placeBaseSearchController,
  placeBaseSearchSchema,
  zipwayConfigController,
  zipwayConfigSchema,
} from "../controllers/app.controller";
import { router, userProtectedProcedure, publicProcedure } from "../trpc";

export const zipwayAppRouter = router({
  zipwayConfig: userProtectedProcedure
    .input(zipwayConfigSchema).output(ZipwayConfigPayloadSchema)
    .query(zipwayConfigController),
  coordinateToAddress: userProtectedProcedure
    .input(coordinateToAddressSchema)
    .mutation(coordinateToAddressController),
  placeBaseSearch: userProtectedProcedure
    .input(placeBaseSearchSchema)
    .mutation(placeBaseSearchController),
  log: publicProcedure
    .input(appLogsControllerSchema)
    .mutation(appLogsController),
});
