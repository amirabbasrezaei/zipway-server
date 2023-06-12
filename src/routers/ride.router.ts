import {
  requestNewRideController,
  requestNewRidePayloadSchema,
  requestRideControllerArgsSchema,
  updateRideController,
  updateRideControllerArgsSchema,
  // updateRidePayloadSchema,
  userRidesController,
  
} from "../controllers/ride.controller";
import { router, userProtectedProcedure } from "../trpc";

export const rideRouter = router({
  requestRide: userProtectedProcedure
    .input(requestRideControllerArgsSchema).output(requestNewRidePayloadSchema)
    .mutation(requestNewRideController),
  updateRide: userProtectedProcedure
    .input(updateRideControllerArgsSchema)
    .mutation(updateRideController),
  getRides: userProtectedProcedure.query(userRidesController),
});

