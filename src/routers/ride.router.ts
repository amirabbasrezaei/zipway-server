import {
  requestNewRideController,
  requestRideControllerArgsSchema,
  updateRideController,
  updateRideControllerArgsSchema,
  userRidesController,
} from "../controllers/ride.controller";
import { publicProcedure, router } from "../trpc";

export const rideRouter = router({
  requestRide: publicProcedure
    .input(requestRideControllerArgsSchema)
    .mutation(requestNewRideController),
  updateRide: publicProcedure
    .input(updateRideControllerArgsSchema)
    .mutation(updateRideController),
  getRides: publicProcedure.query(userRidesController),
});
