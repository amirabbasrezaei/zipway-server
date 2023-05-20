import { router } from "../trpc";
import { zipwayAppRouter } from "./app.router";
import { paymentRouter } from "./payment.router";
import { userRouter } from "./user.router";

export const appRouter = router({
  user: userRouter, // put procedures under "user" namespace
  app: zipwayAppRouter,
  payment: paymentRouter
});

export type AppRouter = typeof appRouter;
