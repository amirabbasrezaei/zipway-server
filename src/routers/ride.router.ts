import {
  requestNewRideController,
  requestNewRidePayloadSchema,
  requestRideControllerArgsSchema,
  updateRideController,
  updateRideControllerArgsSchema,
  updateRidePayloadSchema,
  userRidesController,
} from "../controllers/ride.controller";
import { publicProcedure, router } from "../trpc";

export const rideRouter = router({
  requestRide: publicProcedure
    .input(requestRideControllerArgsSchema).output(requestNewRidePayloadSchema)
    .mutation(requestNewRideController),
  updateRide: publicProcedure
    .input(updateRideControllerArgsSchema).output(updateRidePayloadSchema)
    .mutation(updateRideController),
  getRides: publicProcedure.query(userRidesController),
});

