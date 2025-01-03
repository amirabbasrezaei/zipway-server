import { router } from "../trpc";
import { zipwayAppRouter } from "./app.router";
import { panelRouter } from "./panel.router";
import { paymentRouter } from "./payment.router";
import { rideRouter } from "./ride.router";
import { userRouter } from "./user.router";

export const appRouter = router({
  user: userRouter,
  app: zipwayAppRouter,
  payment: paymentRouter,
  ride: rideRouter,
  panel: panelRouter
});

export type AppRouter = typeof appRouter;
